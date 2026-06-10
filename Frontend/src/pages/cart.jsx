import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import OrderPreview from './Orderviewer';
import '../style/cart.css';
import axios from 'axios';



// Base URL for all API calls
const API_BASE_URL = 'https://rmj-backend.onrender.com';


// Component to render different types of customization data
const CustomizationPreview = ({ item }) => {
  // If no customization exists, don't render anything
  if (!item.customization || !item.customization.type) {
    return null;
  }

  const { type } = item.customization;

  switch (type) {
    case 'engraving':
      return (
        <div className="customization-preview engraving-preview">
          <h4>Personalization:</h4>
          <p className={`custom-text ${item.customization.selectedFont || 'script'}`}>
            {item.customization.customName}
          </p>
          <p className="customization-detail">
            Font: {item.customization.selectedFont || 'Default'}
          </p>
        </div>
      );

    case 'fingerprint':
    case 'image':
      return (
        <div className="customization-preview image-preview">
          <h4>{type === 'fingerprint' ? 'Fingerprint:' : 'Custom Image:'}</h4>
          {item.customization.fileData ? (
            <div className="preview-image-container">
              <img 
                src={item.customization.fileData} 
                alt={`${type} preview`} 
                className="customization-image"
              />
            </div>
          ) : (
            <p>Image: {item.customization.uploadedFile || 'Custom design'}</p>
          )}
        </div>
      );
      
      case 'combined':
        return (
          <div className="customization-preview combined-preview">
            <h4>Combined Customization:</h4>
            {/* Text Customization Preview */}
            {item.customization.text && (
              <div className="text-preview">
                <p className={`custom-text ${item.customization.text.font || 'script'}`}>
                  {item.customization.text.content}
                </p>
                <p className="customization-detail">
                  Font: {item.customization.text.font || 'Default'}
                </p>
              </div>
            )}
            
            {/* File Customization Preview */}
            {item.customization.file && (
              <div className="file-preview">
                {item.customization.file.type?.startsWith('image/') ? (
                  <div className="preview-image-container">
                    <img 
                      src={item.customization.file.data} 
                      alt="Custom file preview" 
                      className="customization-image"
                    />
                  </div>
                ) : (
                  <p>File: {item.customization.file.name || 'Custom file'}</p>
                )}
              </div>
            )}
          </div>
        );
    default:
      return (
        <div className="customization-preview">
          <p>Custom {type}</p>
        </div>
      );
  }
};

// Customer Details Form component with Billing Address
const CustomerDetailsForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    // Added billing address fields
    address: initialValues.address || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    zipCode: initialValues.zipCode || '',
    country: initialValues.country || 'India'
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Validate billing address fields
    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="customer-details-overlay">
      <div className="customer-details-form">
        <div className="form-header">
          <h2>Enter Your Details</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Billing Address</h3>
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your street address"
                className={formErrors.address ? 'error' : ''}
              />
              {formErrors.address && <span className="error-message">{formErrors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className={formErrors.city ? 'error' : ''}
                />
                {formErrors.city && <span className="error-message">{formErrors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  className={formErrors.state ? 'error' : ''}
                />
                {formErrors.state && <span className="error-message">{formErrors.state}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter your 6-digit ZIP code"
                  className={formErrors.zipCode ? 'error' : ''}
                />
                {formErrors.zipCode && <span className="error-message">{formErrors.zipCode}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="submit-button">Proceed to Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modified CartPage component with shipping fee
const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartEmpty, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    addToCart,
    clearCart,
    removeItemByIdentifier,
    updateItemQuantityByIdentifier,
    getCustomizationDetails,
    hasCustomization
  } = useCart();
  
  // State for order viewer
  const [showOrderViewer, setShowOrderViewer] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    // Added billing address fields
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentDetails, setPaymentDetails] = useState({});
  
  // State for customer details form
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // New state for payment processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  // New state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for login notification
  const [showLoginNotification, setShowLoginNotification] = useState(false);
  
  // Fixed shipping fee
  const SHIPPING_FEE = 100;

  // Helper function to get size from item, considering both cases
  const getItemSize = (item) => {
    // First check direct property (lowercase)
    if (item.size) return item.size;
    
    // Then check in customization (uppercase)
    if (item.customization && item.customization.Size) return item.customization.Size;
    
    // Finally return N/A if no size found
    return 'N/A';
  };

  // Calculate total with shipping
  const calculateTotalWithShipping = () => {
    return parseFloat(getCartTotal()) + SHIPPING_FEE;
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setIsLoggedIn(true);
      
      // Try to pre-fill customer details from localStorage
      const firstName = localStorage.getItem('firstName') || '';
      const lastName = localStorage.getItem('lastName') || '';
      
      setCustomerDetails({
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleRemoveItem = (productId, cartIdentifier) => {
    // Use cartIdentifier if available, otherwise fall back to productId
    if (cartIdentifier) {
      removeItemByIdentifier(cartIdentifier);
    } else {
      removeFromCart(productId);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity, cartIdentifier) => {
    if (newQuantity < 1) return;
    
    // Use cartIdentifier if available, otherwise fall back to productId
    if (cartIdentifier) {
      updateItemQuantityByIdentifier(cartIdentifier, newQuantity);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Navigate to login page
  const handleNavigateToLogin = () => {
    // Store the current cart state or a return URL if needed
    localStorage.setItem('redirectAfterLogin', '/cart');
    navigate('/account');
  };

  // Show login notification
  const handleShowLoginNotification = () => {
    setShowLoginNotification(true);
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowLoginNotification(false);
    }, 3000);
  };

  // Simulate saving order to local storage instead of MongoDB
  const saveOrderToLocalStorage = (orderDetails) => {
    try {
      setIsProcessing(true);
      
      // Get existing orders from localStorage or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');

      const MAX_ORDERS = 5; // Reduced from 10 to 5
      const MAX_TOTAL_STORAGE = 250 * 1024; // 250KB total storage limit
      const MAX_ORDER_SIZE = 50 * 1024; // 50KB per order

      // Function to calculate current storage usage
      const calculateStorageSize = (orders) => {
        return JSON.stringify(orders).length;
      };

      // Trim existing orders if approaching limits
      while (existingOrders.length >= MAX_ORDERS) {
        existingOrders.shift(); // Remove the oldest order
      }

      // Create a trimmed version of order details to reduce size
      const trimmedOrderDetails = {
        orderId: orderDetails.orderId,
        paymentId: orderDetails.paymentId,
        amount: orderDetails.amount,
        orderDate: orderDetails.orderDate,
        items: orderDetails.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          variant: item.variant || 'N/A',
          size: item.size || 'N/A', // Store size information
          // Drastically reduce customization data
          customization: item.customization ? {
            type: item.customization.type,
            basicDetails: item.customization.details ? 
              item.customization.details.slice(0, 100) : null // Limit string length
          } : null
        })),
        customer: {
          name: orderDetails.customer.name,
          email: orderDetails.customer.email
        },
        shipping: orderDetails.shipping,
        status: orderDetails.status
      };

      // Potential new orders array
      const potentialOrders = [...existingOrders, trimmedOrderDetails];
      
      // Check total storage size
      const potentialTotalSize = calculateStorageSize(potentialOrders);
      
      if (potentialTotalSize > MAX_TOTAL_STORAGE) {
        // If total storage would exceed limit, clear some older orders
        while (potentialOrders.length > 1 && calculateStorageSize(potentialOrders) > MAX_TOTAL_STORAGE) {
          potentialOrders.shift(); // Remove oldest orders
        }
      }

      // Check individual order size
      if (calculateStorageSize(trimmedOrderDetails) > MAX_ORDER_SIZE) {
        throw new Error('Order too large to save');
      }

      // Save updated orders back to localStorage
      localStorage.setItem('orders', JSON.stringify(potentialOrders));
      
      setPaymentStatus('success');
      clearCart();
      console.log('Order saved successfully to localStorage');
      
      // Simulate a delay for processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
      
      setPaymentStatus('error');
      setIsProcessing(false);

      // Provide user-friendly error handling
      if (error.message === 'Order too large to save') {
        alert('Order details are too large to save completely. Some details may be truncated.');
      } else if (error.name === 'QuotaExceededError') {
        alert('Unable to save order: Storage is full. Clearing previous orders.');
        
        try {
          // Completely clear orders if storage is full
          localStorage.removeItem('orders');
        } catch (clearError) {
          console.error('Could not clear localStorage', clearError);
        }
      } else {
        alert('There was an issue saving your order details. Please contact support.');
      }
    }
  };

  // Prepare order data for viewing and saving to localStorage
  const prepareOrderData = (paymentResponseDetails) => {
    const orderDate = new Date().toLocaleString();
    
    const items = cartItems.map(item => {
      // Get full customization object for order viewer
      const customization = item.customization ? { ...item.customization } : null;
      
      // Get size from either direct property or customization
      const itemSize = getItemSize(item);
      
      return {
        'Product Name': item.name,
        'Price': item.price,
        'Quantity': item.quantity,
        'Total': parseFloat(item.price) * item.quantity,
        'Variant': item.variant || 'N/A',
        'Size': itemSize, // Use the helper function to get size
        'Customization': customization, // Pass the full customization object
        'Image': item.image // Pass the image URL to the OrderPreview component
      };
    });
    
    // Create formatted billing address string
    const formattedAddress = `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.zipCode}, ${customerDetails.country}`;
    
    const summary = [
      { 'Order Summary': 'Order Date', 'Value': orderDate },
      { 'Order Summary': 'Payment ID', 'Value': paymentResponseDetails.paymentId },
      { 'Order Summary': 'Order ID', 'Value': paymentResponseDetails.orderId },
      { 'Order Summary': 'Subtotal', 'Value': `₹ ${getCartTotal()}` },
      { 'Order Summary': 'Shipping', 'Value': `₹ ${SHIPPING_FEE}` },
      { 'Order Summary': 'Total Amount', 'Value': `₹ ${calculateTotalWithShipping()}` },
      { 'Order Summary': 'Billing Address', 'Value': formattedAddress }
    ];
    
    setOrderData(items);
    setOrderSummary(summary);
    setPaymentDetails(paymentResponseDetails);
    setShowOrderViewer(true);
    
    const orderForStorage = {
      orderId: paymentResponseDetails.orderId,
      paymentId: paymentResponseDetails.paymentId,
      signature: paymentResponseDetails.signature,
      amount: getCartTotal(),
      shipping: SHIPPING_FEE,
      totalAmount: calculateTotalWithShipping(),
      currency: 'INR',
      orderDate: new Date().toISOString(),
      items: cartItems.map(item => {
        const hasCustom = hasCustomization(item);
        const itemSize = getItemSize(item);

        return {
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || 'N/A',
          size: itemSize, // Use the helper function to get size
          total: parseFloat(item.price) * item.quantity,
          image: item.image, // Include the image in storage
          customization: hasCustom ? {
            type: item.customization.type,
            details: getCustomizationDetails(item),
            fileData: item.customization.fileData // Include fileData for images
          } : null
        };
      }),
      customer: {
        userId: localStorage.getItem('userId'),
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        billingAddress: {
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          zipCode: customerDetails.zipCode,
          country: customerDetails.country
        }
      },
      status: 'paid'
    };
    
    saveOrderToLocalStorage(orderForStorage);
  };

  // Handle customer form submission
  const handleCustomerFormSubmit = (formData) => {
    setCustomerDetails(formData);
    setShowCustomerForm(false);
    
    // Initialize Razorpay payment
    initializeRazorpay(formData);
  };

  const initializeRazorpay = async (userDetails) => {
    try {
      setIsProcessing(true);
      
      // First, fetch Razorpay key from backend
      const keyResponse = await axios.get(`${API_BASE_URL}/api/razorpay-key`);
      const keyData = keyResponse.data;
      
      if (!keyData.success) {
        throw new Error('Could not fetch Razorpay key');
      }
      
      // Create Razorpay order using backend API
      const orderResponse = await axios.post(`${API_BASE_URL}/api/create-razorpay-order`, {
        amount: calculateTotalWithShipping(),
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });
      
      const orderData = orderResponse.data;
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Could not create Razorpay order');
      }
      
      // Initialize Razorpay checkout
      const options = {
        key: keyData.key || "rzp_live_JAG0ew3v5xLtUG", // Use key from API or fallback
        amount: orderData.order.amount, // In paise
        currency: orderData.order.currency,
        name: "Rmjjewellery",
        description: "Customized of your Trend We Make That ",
        order_id: orderData.order.id, // This is important for verification
        image: "/your-logo.png",
        handler: async function(response) {
          try {
            // Verify payment with backend
            const verifyResponse = await axios.post(`${API_BASE_URL}/api/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            const verifyData = verifyResponse.data;
            
            if (!verifyData.success) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
            
            console.log("Payment verified:", response.razorpay_payment_id);
            
            // Prepare payment response details for order creation
            const paymentResponseDetails = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: 'Successful',
              method: 'Razorpay'
            };
            
            // Process order with successful payment
            prepareOrderData(paymentResponseDetails);
            
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus('error');
            setIsProcessing(false);
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        notes: {
          address: `${userDetails.address}, ${userDetails.city}, ${userDetails.state}, ${userDetails.zipCode}, ${userDetails.country}`
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            console.log('Checkout form closed');
          }
        }
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      setPaymentStatus('error');
      setIsProcessing(false);
      alert(`Payment initialization failed: ${error.message}`);
    }
  };
  
  // Handle checkout button click
  const handleCheckout = () => {
    // First check if user is logged in
    if (!isLoggedIn) {
      handleShowLoginNotification();
      return;
    }
    
    // Show customer details form
    setShowCustomerForm(true);
  };

  const handleAddRecommended = (product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      variant: product.variant || null,
      size: product.size || null // Include size when adding from recommended
    });
  };

  const handleCloseOrderViewer = () => {
    setShowOrderViewer(false);
    
    if (paymentStatus === 'success') {
      navigate('/cart');
    }
  };

  return (
    <>
      {/* LOGIN NOTIFICATION */}
      {showLoginNotification && (
        <div className="login-notification">
          <div className="login-notification-content">
            <p>Please log in to complete your purchase</p>
            <button onClick={handleNavigateToLogin}>Go to Login</button>
            <button onClick={() => setShowLoginNotification(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* CUSTOMER DETAILS FORM */}
      {showCustomerForm && (
        <CustomerDetailsForm
          initialValues={customerDetails}
          onSubmit={handleCustomerFormSubmit}
          onCancel={() => setShowCustomerForm(false)}
        />
      )}

      {/* ORDER VIEWER */}
      {showOrderViewer && (
        <OrderPreview
          orderData={orderData} 
          orderSummary={orderSummary}
          customerDetails={customerDetails}
          paymentDetails={paymentDetails}
          onClose={handleCloseOrderViewer}
        />
      )}

      {/* PAYMENT STATUS MESSAGE */}
      {paymentStatus && (
        <div className={`payment-status ${paymentStatus}`}>
          {paymentStatus === 'success' ? 
            'Payment successful! Your order has been placed.' : 
            'There was an issue processing your payment. Please try again.'}
        </div>
      )}

      {/* EMPTY CART VIEW */}
      {isCartEmpty && (
        <div className="empty-cart-container">
          <div className="empty-cart-message">
            <h1>Your cart is empty</h1>
            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continue shopping
            </button>
          </div>
          
          <div className="account-section">
            <h2>Have an account?</h2>
            <p><a href="/account" className="login-link">Log in</a> to check out faster.</p>
          </div>
          
          <div className="footer-divider"></div>
        </div>
      )}

      {/* FILLED CART VIEW */}
      {!isCartEmpty && !showOrderViewer && (
        <div className="cart-container">
          <h1>Your Cart</h1>
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.cartIdentifier || item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image || "/api/placeholder/80/80"} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-name-price">
                      <h3>{item.name}</h3>
                      <div className="item-attributes">
                        {item.variant && <p className="item-variant">Variant: {item.variant}</p>}
                        {/* Updated to use the helper function to get the size */}
                        {<p className="item-size">Size: {getItemSize(item)}</p>}
                      </div>
                      <p className="item-price">₹ {item.price}</p>
                    </div>
                    
                    {/* Customization preview */}
                    {hasCustomization(item) && (
                      <div className="item-customization">
                        <CustomizationPreview item={item} />
                      </div>
                    )}
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleUpdateQuantity(
                            item.id, 
                            item.quantity - 1, 
                            item.cartIdentifier
                          )}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(
                            item.id, 
                            parseInt(e.target.value) || 1,
                            item.cartIdentifier
                          )}
                          readOnly
                        />
                        <button onClick={() => handleUpdateQuantity(
                          item.id, 
                          item.quantity + 1,
                          item.cartIdentifier
                        )}>
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="remove-item"
                        onClick={() => handleRemoveItem(item.id, item.cartIdentifier)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {getCartTotal()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹ {SHIPPING_FEE}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹ {calculateTotalWithShipping()}</span>
              </div>
              
              <div className="promo-code">
                <input type="text" placeholder="Enter promo code" />
                <button>Apply</button>
              </div>
              <button 
                className="checkout-button"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isLoggedIn ? 
                  (isProcessing ? 'Processing...' : 'Pay with Razorpay') : 
                  'Login to Checkout'}
              </button>
              
              <button 
                className="continue-shopping"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CSS for the components */}
      <style jsx="true">{`
        .item-customization {
          margin: 10px 0;
          padding: 8px;
          background-color: #f9f9f9;
          border-radius: 4px;
          border-left: 3px solid #3399cc;
        }
        
        .customization-preview h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #555;
        }
        
        .engraving-preview .custom-text {
          padding: 5px;
          margin: 5px 0;
          border: 1px dashed #ddd;
          background: #fff;
          border-radius: 3px;
        }
        
        .engraving-preview .font-script {
          font-family: 'Brush Script MT', cursive;
        }
        
        .engraving-preview .font-serif {
          font-family: 'Times New Roman', serif;
        }
        
        .engraving-preview .font-modern {
          font-family: 'Arial', sans-serif;
        }
        
        .engraving-preview .font-handwritten {
          font-family: 'Comic Sans MS', cursive;
        }
        
        .customization-detail {
          font-size: 12px;
          color: #777;
          margin: 5px 0 0 0;
        }
        
        .preview-image-container {
          max-width: 100px;
          max-height: 100px;
          overflow: hidden;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin: 5px 0;
        }
        
        .customization-image {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
        
        .item-variant {
          font-size: 12px;
          color: #666;
          margin: 2px 0;
        }
        
        /* Styling for the customer details form */
        .customer-details-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .customer-details-form {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }
        
        .form-header h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #777;
        }
        
        .form-section {
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .form-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #555;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          color: #555;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group input.error {
          border-color: #e53935;
        }
        
        .error-message {
          color: #e53935;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        .form-actions {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.cancel-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  background-color: #3399cc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.submit-button:hover {
  background-color: #2980b9;
}

/* Login notification styling */
.login-notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-notification-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-notification-content p {
  margin-bottom: 15px;
  font-size: 16px;
}

.login-notification-content button {
  margin: 0 5px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-notification-content button:first-of-type {
  background-color: #3399cc;
  color: white;
}

.login-notification-content button:last-of-type {
  background-color: #f1f1f1;
  color: #333;
}

/* Payment status message */
.payment-status {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.payment-status.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
}

.payment-status.error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .customer-details-form {
    width: 95%;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}
      `}
      </style>
    </>
  );
};

export default CartPage;