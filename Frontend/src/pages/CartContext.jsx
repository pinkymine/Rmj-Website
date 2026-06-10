import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Create a provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage
  const [cart, setCart] = useState(() => {
    // Check both localStorage keys to maintain compatibility
    const savedCart = localStorage.getItem('rmjCart') || localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Derived state calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const isCartEmpty = cart.length === 0;
  
  // Calculate cart total with improved price handling
  const cartTotal = cart.reduce((total, item) => {
    // Handle different price formats
    let price = item.price;
    
    // If price is a string with commas, convert it
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/,/g, ''));
    }
    
    // Handle NaN cases
    if (isNaN(price)) {
      console.error(`Invalid price for item ${item.id}: ${item.price}`);
      return total;
    }
    
    return total + (price * item.quantity);
  }, 0);
  
  // Update localStorage whenever cart changes
  useEffect(() => {
    try {
      // Store in both keys for backward compatibility
      localStorage.setItem('rmjCart', JSON.stringify(cart));
      localStorage.setItem('cartItems', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // If localStorage fails (e.g., due to quota exceeded), attempt to store a simplified version
      try {
        // Create a simplified version without large data like fileData
        const simplifiedCart = cart.map(item => {
          const simplified = { ...item };
          
          // If the item has customization with fileData, store a reference instead
          if (simplified.customization && simplified.customization.fileData) {
            simplified.customization = {
              ...simplified.customization,
              fileData: '[[FILE_DATA_STORED]]', // Replace with a placeholder
              hasFileData: true // Flag to indicate data was simplified
            };
          }
          
          return simplified;
        });
        
        localStorage.setItem('rmjCart', JSON.stringify(simplifiedCart));
        localStorage.setItem('cartItems', JSON.stringify(simplifiedCart));
      } catch (fallbackError) {
        console.error('Failed to save simplified cart:', fallbackError);
      }
    }
  }, [cart]);
  
  // Add item to cart with customization support
  const addToCart = (product, quantity = 1) => {
    // Use the quantity from the product if provided, otherwise use the parameter
    const qtyToAdd = product.quantity || quantity;
    
    // Create a unique identifier that includes customization details
    const getProductIdentifier = (prod) => {
      let identifier = prod.id;
      
      // Add customization details to make the identifier unique
      if (prod.customization) {
        const customization = prod.customization;
        
        if (customization.type === 'engraving' && customization.customName) {
          identifier += `-engraving-${customization.customName}-${customization.selectedFont || 'default'}`;
        } else if (customization.type === 'fingerprint' && customization.uploadedFile) {
          identifier += `-fingerprint-${customization.uploadedFile}`;
        } else if (customization.type === 'image' && customization.uploadedFile) {
          identifier += `-image-${customization.uploadedFile}`;
        } else if (customization.type) {
          identifier += `-${customization.type}`;
        }
      }
      
      // Include variant if present
      if (prod.variant) {
        identifier += `-variant-${prod.variant}`;
      }
      
      return identifier;
    };
    
    // Create a unique product identifier
    const productIdentifier = getProductIdentifier(product);
    
    setCart(prevCart => {
      // Find item with the same identifier (including customization)
      const existingItemIndex = prevCart.findIndex(item => 
        getProductIdentifier(item) === productIdentifier
      );
      
      if (existingItemIndex >= 0) {
        // Item exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + qtyToAdd
        };
        return updatedCart;
      } else {
        // Item doesn't exist in cart, add it with all its customization data
        return [...prevCart, { 
          ...product, 
          quantity: qtyToAdd,
          // Include the unique identifier to make sure we can match it later
          cartIdentifier: productIdentifier
        }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  // Remove specific item by cart identifier
  const removeItemByIdentifier = (identifier) => {
    setCart(prevCart => prevCart.filter(item => item.cartIdentifier !== identifier));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Update specific item quantity by cart identifier
  const updateItemQuantityByIdentifier = (identifier, quantity) => {
    if (quantity <= 0) {
      removeItemByIdentifier(identifier);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.cartIdentifier === identifier ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rmjCart');
    localStorage.removeItem('cartItems');
  };
  
  // Get formatted cart total
  const getCartTotal = () => cartTotal.toFixed(2);
  
  // Get customization details string for an item
  const getCustomizationDetails = (item) => {
    if (!item.customization) return null;
    
    const customization = item.customization;
    let details = '';
    
    switch (customization.type) {
      case 'engraving':
        details = `Engraved text: "${customization.customName}" (${customization.selectedFont} font)`;
        break;
      case 'fingerprint':
        details = `Custom fingerprint: "${customization.uploadedFile || 'Uploaded image'}"`;
        break;
      case 'image':
        details = `Custom image: "${customization.uploadedFile || 'Uploaded image'}"`;
        break;
      default:
        if (customization.type) {
          details = `Customization: ${customization.type}`;
        }
    }
    
    return details;
  };
  
  // Check if an item has customization
  const hasCustomization = (item) => {
    return !!item.customization && !!item.customization.type;
  };
  
  // Get customization image/preview for display
  const getCustomizationPreview = (item) => {
    if (!item.customization) return null;
    
    const customization = item.customization;
    
    if ((customization.type === 'fingerprint' || customization.type === 'image') && customization.fileData) {
      return customization.fileData;
    }
    
    return null;
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // For backward compatibility
        cartCount,
        cartTotal,
        isCartEmpty,
        addToCart,
        removeFromCart,
        removeItemByIdentifier,
        updateQuantity,
        updateItemQuantityByIdentifier,
        clearCart,
        getCartTotal,
        getCustomizationDetails,
        hasCustomization,
        getCustomizationPreview
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;