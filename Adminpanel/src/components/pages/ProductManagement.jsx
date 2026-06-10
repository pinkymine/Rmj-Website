import React, { useState, useEffect } from 'react';
import '../Styles/ProductManagement.css';
import ImageUpload from './ImageUpload';
import * as apiService from '../../api';


const ProductManagementDashboard = () => {
  // State
  const [products, setProducts] = useState([]);
  const [peopleCategories, setPeopleCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  
  // Form states
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    gram: '',
    peopleCategory: '',
    productCategory: '',
    productType: '',
    priceRange: '',
    stock: '',
    metalType: '',
    customOption: '',  // Default, but will be properly updated
    images: []
  });
  
  // Today Update tab states - Disconnected from backend
  const [metalRates, setMetalRates] = useState({
    gold: '',
    silver: ''
  });
  const [gst, setGst] = useState('3');
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Selected product for editing
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('products');
  
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // At the top of your component
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // Adjust as needed
const totalPages = Math.ceil(products.length / itemsPerPage);



// Filter state
const [categoryFilter, setCategoryFilter] = useState('all');

// Filtered products logic
const getFilteredProducts = () => {
  if (categoryFilter === 'all') {
    return products;
  }
  return products.filter(product => product.productCategory === categoryFilter);
};

const filteredProducts = getFilteredProducts();
const totalFilteredPages = Math.ceil(filteredProducts.length / itemsPerPage);

// Effect to validate current page when filter changes
useEffect(() => {
  if (currentPage > totalFilteredPages && totalFilteredPages > 0) {
    setCurrentPage(totalFilteredPages);
  }
}, [categoryFilter, filteredProducts.length, totalFilteredPages, currentPage]);


// Modify your renderProductsTable function to slice only the current page items

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Improved fetchAllData function with better error handling
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch each data type individually with try/catch for each to prevent complete failure
      let productsData = [];
      let peopleData = [];
      let productCatData = [];
      let typesData = [];
      let rangesData = [];
      let metalRatesData = null;
      let customOptions =[];

      
      // Get products
      try {
        productsData = await apiService.getProducts();
        console.log('Products from API:', productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      }
      
      // Get people categories
      try {
        peopleData = await apiService.getPeopleCategories();
      } catch (err) {
        console.error('Error fetching people categories:', err);
        setError(prev => prev || 'Failed to load categories. Please try again.');
      }
      
      // Get product categories
      try {
        productCatData = await apiService.getProductCategories();
      } catch (err) {
        console.error('Error fetching product categories:', err);
        setError(prev => prev || 'Failed to load categories. Please try again.');
      }
      
      // Get product types
      try {
        typesData = await apiService.getProductTypes();
      } catch (err) {
        console.error('Error fetching product types:', err);
        setError(prev => prev || 'Failed to load product types. Please try again.');
      }
      
      // Get price ranges
      try {
        rangesData = await apiService.getPriceRanges();
      } catch (err) {
        console.error('Error fetching price ranges:', err);
        setError(prev => prev || 'Failed to load price ranges. Please try again.');
      }
      
      // Get metal rates
      try {
        metalRatesData = await apiService.getMetalRates();
      } catch (err) {
        console.error('Error fetching metal rates:', err);
        // Set default metal rates rather than failing
        metalRatesData = { gold: ' ', silver: ' ', gst: '3' };
      }

      try {
        customOptions = await apiService.getProductTypes();
      } catch (err) {
        console.error('Error fetching product types:', err);
        setError(prev => prev || 'Failed to load product types. Please try again.');
      }
      

      // Log the actual product data to debug
      console.log('Products from API:', productsData);
      
      // Process products - ensure metalType is preserved
      const processedProducts = productsData.map(product => ({
        ...product,
        gram: product.gram !== undefined && product.gram !== null ? String(product.gram) : '',
        // Important: Use the actual metalType from the API or default to 'gold' only if undefined
        metalType: product.metalType || 'gold'
      }));
      
      console.log('Processed products with metal values:', processedProducts);
      
      setProducts(processedProducts);
      setPeopleCategories(peopleData);
      setProductCategories(productCatData);
      setProductTypes(typesData);
      setPriceRanges(rangesData);
      setCustomOptions(customOptions);
      
      // Set metal rates from API or use defaults
      if (metalRatesData) {
        setMetalRates({
          gold: metalRatesData.gold || ' ',
          silver: metalRatesData.silver || ' '
        });
        setGst(metalRatesData.gst || '3');
      }
      
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Function to handle filter changes
  const handleFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  // Function to handle view button click
  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  // Function to close the product view
  const closeProductView = () => {
    setViewingProduct(null);
  };
  
  // Function to handle input changes - unified handler for all form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetalRates(prev => ({
      ...prev,
      [name]: value
    }));

    
    // Log changes to metal type for debugging
    if (name === 'metalType') {
      console.log(`Metal type changed to: ${value}`);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Auto-set price range based on price
    if (name === 'price') {
      const price = parseFloat(value);
      let priceRange = '';
      
      if (price < 1000) {
        priceRange = '0-999';
      } else if (price >= 1000 && price < 10000) {
        priceRange = '1k-10k';
      } else if (price >= 10000 && price < 50000) {
        priceRange = '10k-50k';
      } else {
        priceRange = '50k-above';
      }
      
      setFormData(prevData => ({
        ...prevData,
        priceRange: priceRange
      }));
    }
  };
  
  // Function to handle metal rate input changes
  const handleMetalRateChange = (e) => {
    const { name, value } = e.target;
    setMetalRates({
      ...metalRates,
      [name]: value
    });
  };
  
  // Function to handle GST input changes
  const handleGstChange = (e) => {
    setGst(e.target.value);
  };
  
 
  // Function to update prices based on metal rates - disconnected from backend
  // Function to update prices based on metal rates - Connected to backend
  // Improved error handling and input validation
  const handleUpdatePrices = async () => {
    const goldRate = parseFloat(metalRates.gold);
    const silverRate = parseFloat(metalRates.silver);
    const gstRate = parseFloat(gst);
    
    if (isNaN(goldRate) || isNaN(silverRate) || isNaN(gstRate)) {
      alert('Please enter valid values for gold rate, silver rate, and GST before updating prices.');
      return;
    }
    
    if (!window.confirm('This will update prices for all products based on their metal type, gram weight, and current rates. Continue?')) {
      return;
    }
    
    setUpdatingPrices(true);
    setLoading(true);
    setError(null);
    
    try {
      // Create a copy of products to modify
      const updatedProducts = [...products];
      let updateCount = 0;
      
      // Array to hold all update promises
      const updatePromises = [];
      
      // Update each product based on metal type and gram weight
      for (const product of updatedProducts) {
        // Skip products with invalid gram values
        if (!product.gram || isNaN(parseFloat(product.gram)) || parseFloat(product.gram) <= 0) {
          continue;
        }
        
        const gramWeight = parseFloat(product.gram);
        const metalType = product.metalType || 'gold';
        
        // Calculate the new price
        let basePrice = 0;
        if (metalType === 'gold') {
          basePrice = gramWeight * goldRate;
        } else if (metalType === 'silver') {
          basePrice = gramWeight * silverRate;
        }
        
        // Add GST to the price
        const newPrice = Math.round(basePrice * (1 + gstRate/100));
        
        // Only update if price has changed
        if (newPrice !== product.price) {
          // Determine the new price range
          let newPriceRange = '';
          if (newPrice < 1000) {
            newPriceRange = '0-999';
          } else if (newPrice >= 1000 && newPrice < 10000) {
            newPriceRange = '1k-10k';
          } else if (newPrice >= 10000 && newPrice < 50000) {
            newPriceRange = '10k-50k';
          } else {
            newPriceRange = '50k-above';
          }
          
          // Create product data for update
          const productData = {
            name: product.name,
            price: newPrice,
            gram: gramWeight,
            peopleCategory: product.peopleCategory,
            productCategory: product.productCategory,
            productType: product.productType,
            priceRange: newPriceRange,
            stock: product.stock,
            metalType: product.metalType,
            customOption: product.customOption,
            images: product.images
          };
          
          // Add update promise to array with error handling for individual updates
          updatePromises.push(
            apiService.updateProduct(product._id, productData)
              .catch(err => {
                console.error(`Error updating product ${product._id}:`, err);
                return null; // Return null for failed updates but continue with others
              })
          );
          updateCount++;
        }
      }
      
      // Wait for all updates to complete, filtering out any failed updates
      const updatedResults = await Promise.all(updatePromises);
      const successfulUpdates = updatedResults.filter(result => result !== null);
      // Refresh the products list to show updated prices
      try {
        const refreshedProducts = await apiService.getProducts();
        
        // Process the updated products to ensure consistent format
        if (Array.isArray(refreshedProducts)) {
          const processedProducts = refreshedProducts.map(product => ({
            ...product,
            gram: product.gram !== undefined && product.gram !== null ? String(product.gram) : '',
            metalType: product.metalType || 'gold'
          }));
          
          setProducts(processedProducts);
        }
      } catch (err) {
        console.error('Error refreshing products after update:', err);
        // Don't set error here, we'll show success for the updates that went through
      }
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      if (successfulUpdates.length === updateCount) {
        alert(`Successfully updated prices for all ${updateCount} products.`);
      } else {
        alert(`Updated prices for ${successfulUpdates.length} out of ${updateCount} products. Check console for details.`);
      }
    } catch (err) {
      setError('Failed to update product prices');
      console.error('Error updating prices:', err);
      alert(`Failed to update prices: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
      setUpdatingPrices(false);
    }
  };
  
  // Function to update images
  const setImages = (newImages) => {
    setFormData({
      ...formData,
      images: newImages
    });
  };
 // Function to add a new product with improved error handling
 const handleAddProduct = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    // Validate inputs
    if (formData.images.length < 4) {
      alert('Please add at least 4 images');
      setLoading(false);
      return;
    }
    
    // Make sure name is not empty
    if (!formData.name.trim()) {
      alert('Product name cannot be empty');
      setLoading(false);
      return;
    }
    
    // Make sure price is valid
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      setLoading(false);
      return;
    }
    
    // Process images for API submission
    const processedImages = formData.images.map(img => 
      typeof img === 'object' ? img.url : img
    );
    
    // Make sure gram is properly handled - default to 0 if empty
    const gramValue = formData.gram && formData.gram !== '' ? parseFloat(formData.gram) : 0;
    
    // Validate stock
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      alert('Please enter a valid stock quantity');
      setLoading(false);
      return;
    }
    
    // Create product data - explicitly including metalType
    const productData = {
      name: formData.name.trim(),
      price: price,
      gram: gramValue,
      peopleCategory: formData.peopleCategory,
      productCategory: formData.productCategory,
      productType: formData.productType,
      priceRange: formData.priceRange,
      stock: stock,
      metalType: formData.metalType, 
      customOption:formData.customOption,// Include metalType for the backend
      images: processedImages
    };
    
    console.log('Sending product data with metal type:', productData); // Debug log
    
    const newProduct = await apiService.addProduct(productData);
    console.log('New product response:', newProduct);
    
    // Ensure we preserve the metal type when adding to local state
    const processedNewProduct = {
      ...newProduct,
      gram: newProduct.gram !== undefined && newProduct.gram !== null ? String(newProduct.gram) : '',
      metalType: newProduct.metalType || formData.metalType // Preserve metal type
    };
    
    setProducts(prevProducts => [...prevProducts, processedNewProduct]);
    resetForm();
    alert('Product added successfully!');
  } catch (err) {
    setError('Failed to add product');
    console.error('Error adding product:', err);
    alert(`Failed to add product: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  // Function to select a product for editing
  const handleEditClick = (product) => {
    setFormMode('edit');
    setSelectedProductId(product._id);
    
    // Convert simple image URLs to objects with IDs
    const imageObjects = Array.isArray(product.images) ? product.images.map((image, index) => {
      // Handle both string URLs and object images
      const url = typeof image === 'object' ? image.url : image;
      return {
        id: `existing_${product._id}_${index}`,
        url: url,
        filename: `image-${index + 1}`
      };
    }) : [];
    
    // Ensure gram is not undefined or null and convert to string for the form
    const gramValue = product.gram !== undefined && product.gram !== null ? String(product.gram) : '';
    
    // Important: Use product's actual metal type from the data
    console.log("Setting form with metalType:", product.metalType);
    
    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      gram: gramValue,
      peopleCategory: product.peopleCategory,
      productCategory: product.productCategory,
      productType: product.productType,
      priceRange: product.priceRange,
      stock: product.stock,
      metalType: product.metalType || 'gold', 
      customOption:product.customOption,// Use existing metal type
      images: imageObjects
    });
  };

  // Function to update a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.images.length < 4) {
      alert('Please add at least 4 images');
      setLoading(false);
      return;
    }
    
    try {
      // Process images for API submission - handle both string and object image formats
      const processedImages = formData.images.map(img => 
        typeof img === 'object' ? img.url : img
      );
      
      // Make sure gram is properly handled - default to 0 if empty
      const gramValue = formData.gram && formData.gram !== '' ? parseFloat(formData.gram) : 0;
      
      // Create product data with explicit metalType
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        gram: gramValue,
        peopleCategory: formData.peopleCategory,
        productCategory: formData.productCategory,
        productType: formData.productType,
        priceRange: formData.priceRange,
        stock: parseInt(formData.stock),
        metalType: formData.metalType,
        customOption: formData.customOption, // Explicit metal type
        images: processedImages
      };
      
      console.log('Updating product data with metal type:', productData);
      
      const updatedProduct = await apiService.updateProduct(formData.id, productData);
      console.log('Updated product response:', updatedProduct);
      
      // Process the updated product with preserved metal type
      const processedUpdatedProduct = {
        ...updatedProduct,
        gram: updatedProduct.gram !== undefined && updatedProduct.gram !== null ? String(updatedProduct.gram) : '',
        metalType: updatedProduct.metalType || formData.metalType // Ensure metal type is preserved
      };
      
      const updatedProducts = products.map(product => 
        product._id === formData.id ? processedUpdatedProduct : product
      );
      
      setProducts(updatedProducts);
      resetForm();
      alert('Product updated successfully!');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
      alert(`Failed to update product: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      console.error('Invalid product ID');
      alert('Cannot delete product: Invalid product ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      setError(null);
      try {
        // Find the product to get its images before deletion
        const productToDelete = products.find(p => p._id === productId);
        
        if (productToDelete && productToDelete.images) {
          console.log(`Deleting ${productToDelete.images.length} images for product ${productId}`);
        }
        
        // Delete the product
        await apiService.deleteProduct(productId);
        const filteredProducts = products.filter(p => p._id !== productId);
        setProducts(filteredProducts);
        alert('Product deleted successfully!');
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
        alert(`Failed to delete product: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };
  

  
  // Reset form and set to add mode
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      gram: '',
      peopleCategory: '',
      productCategory: '',
      productType: '',
      priceRange: '',
      stock: '',
      metalType: 'gold',
      customOption: '', // Default to gold for new products
      images: []
    });
    setFormMode('add');
    setSelectedProductId(null);
  };
  
  // Function to handle category form
  const [categoryType, setCategoryType] = useState('people');
  const [categoryFormData, setCategoryFormData] = useState({ name: '' });
  
  const handleCategoryInputChange = (e) => {
    setCategoryFormData({
      ...categoryFormData,
      [e.target.name]: e.target.value
    });
  };
  
  // Function to add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      let updateFunction;
      
      switch(categoryType) {
        case 'people':
          response = await apiService.addPeopleCategory({ name: categoryFormData.name });
          updateFunction = setPeopleCategories;
          break;
        case 'product':
          response = await apiService.addProductCategory({ name: categoryFormData.name });
          updateFunction = setProductCategories;
          break;
        case 'type':
          response = await apiService.addProductType({ name: categoryFormData.name });
          updateFunction = setProductTypes;
          break;
        case 'price':
          response = await apiService.addPriceRange({ name: categoryFormData.name });
          updateFunction = setPriceRanges;
          break;
        default:
          throw new Error('Invalid category type');
      }
      
      // Update state with the new category
      updateFunction(prev => [...prev, response]);
      setCategoryFormData({ name: '' });
      alert('Category added successfully!');
    } catch (err) {
      setError(`Failed to add ${categoryType} category`);
      console.error(`Error adding ${categoryType} category:`, err);
      alert(`Failed to add category: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to delete a category
  const handleDeleteCategory = async (categoryId, type) => {
    if (!categoryId) {
      console.error('Invalid category ID');
      alert('Cannot delete category: Invalid category ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      try {
        let deleteFunction;
        let updateFunction;
        let currentList;
        
        switch(type) {
          case 'people':
            deleteFunction = apiService.deletePeopleCategory;
            updateFunction = setPeopleCategories;
            currentList = peopleCategories;
            break;
          case 'product':
            deleteFunction = apiService.deleteProductCategory;
            updateFunction = setProductCategories;
            currentList = productCategories;
            break;
          case 'type':
            deleteFunction = apiService.deleteProductType;
            updateFunction = setProductTypes;
            currentList = productTypes;
            break;
          case 'price':
            deleteFunction = apiService.deletePriceRange;
            updateFunction = setPriceRanges;
            currentList = priceRanges;
            break;
          default:
            throw new Error('Invalid category type');
        }
        
        await deleteFunction(categoryId);
        const filteredList = currentList.filter(item => item._id !== categoryId);
        updateFunction(filteredList);
        alert('Category deleted successfully!');
      } catch (err) {
        console.error(`Error deleting ${type} category:`, err);
        if (err.response?.status === 400) {
          alert(`Cannot delete this category as it is used by ${err.response.data.productsCount} product(s).`);
        } else {
          alert(`Failed to delete category: ${err.response?.data?.message || err.message}`);
        }
        setError(`Failed to delete ${type} category`);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Render products table with metal type column
  const renderProductsTable = () => {
    // Calculate the items to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    return (
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Gram</th>
              <th>Metal Type</th>
              <th>Category</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => {
              // Improved gram display logic
              let gramDisplay = 'N/A';
              
              // Better check for gram values including zero
              if (product.gram !== undefined && product.gram !== null && product.gram !== '') {
                const gramValue = parseFloat(product.gram);
                if (!isNaN(gramValue)) {
                  gramDisplay = `${gramValue}g`;
                }
              }
              
              // Capitalize first letter of metal type for display
              const displayMetalType = product.metalType ? 
                product.metalType.charAt(0).toUpperCase() + product.metalType.slice(1) : 
                'Gold';
              
              return (
                <tr key={product._id}>
                  <td>{product._id.substring(0, 8)}...</td>
                  <td>{product.name}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>{gramDisplay}</td>
                  <td>{displayMetalType}</td>
                  <td>{product.productCategory}</td>
                  <td>{product.customOption}</td>
                  <td>{product.productType}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="button-group">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="btn btn-view"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  // Render category table
  const renderCategoryTable = (items, type) => {
    return (
      <div className="table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <button
                    onClick={() => handleDeleteCategory(item._id, type)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderProductView = () => {
    if (!viewingProduct) return null;
    
    // Improved gram display logic for modal view
    let gramDisplay = 'N/A';
    if (viewingProduct.gram !== undefined && viewingProduct.gram !== null && viewingProduct.gram !== '') {
      const gramValue = parseFloat(viewingProduct.gram);
      if (!isNaN(gramValue)) {
        gramDisplay = `${gramValue}g`;
      }
    }
    
    // Capitalize first letter of metal type for display
    const displayMetalType = viewingProduct.metalType ? 
      viewingProduct.metalType.charAt(0).toUpperCase() + viewingProduct.metalType.slice(1) : 
      'Gold';
      // Safely handle potentially missing images
      const productImages = Array.isArray(viewingProduct.images) ? viewingProduct.images : [];
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{viewingProduct.name || 'Product Details'}</h2>
            <button
              onClick={closeProductView}
              className="modal-close"
            >
              ✕
            </button>
          </div>
          
          <div className="product-details">
            <div className="product-info">
              <p><strong>Price:</strong> ₹{viewingProduct.price.toLocaleString()}</p>
              <p><strong>Gram:</strong> {gramDisplay}</p>
              <p><strong>Metal Type:</strong> {displayMetalType}</p>
              <p><strong>Category:</strong> {viewingProduct.productCategory}</p>
              <p><strong>Type:</strong> {viewingProduct.productType}</p>
              <p><strong>For:</strong> {viewingProduct.peopleCategory}</p>
              <p><strong>Price Range:</strong> {viewingProduct.priceRange}</p>
              <p><strong>customOption:</strong> {viewingProduct.customOption}</p>

              <p><strong>Stock:</strong> {viewingProduct.stock} units</p>
            </div>
            
            <div className="product-images">
              {Array.isArray(viewingProduct.images) && viewingProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={typeof image === 'object' ? image.url : image}
                  alt={`${viewingProduct.name} - ${index + 1}`}
                  className="product-thumbnail"
                />
              ))}
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              onClick={closeProductView}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPagination = () => {
    if (totalFilteredPages <= 1) return null;
    
    const pageButtons = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalFilteredPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // First page button
    if (startPage > 1) {
      pageButtons.push(
        <button 
          key="first" 
          onClick={() => setCurrentPage(1)}
          className="pagination-btn"
        >
          First
        </button>
      );
    }
    
    // Previous page button
    if (currentPage > 1) {
      pageButtons.push(
        <button 
          key="prev" 
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn"
        >
          &lt;
        </button>
      );
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Next page button
    if (currentPage < totalFilteredPages) {
      pageButtons.push(
        <button 
          key="next" 
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn"
        >
          &gt;
        </button>
      );
    }
    
    // Last page button
    if (endPage < totalFilteredPages) {
      pageButtons.push(
        <button 
          key="last" 
          onClick={() => setCurrentPage(totalFilteredPages)}
          className="pagination-btn"
        >
          Last
        </button>
      );
    }
    
    return (
      <div className="pagination">
        {pageButtons}
      </div>
    );
  };
  
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Product Management Dashboard</h1>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <p>Loading...</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`tab-button ${activeTab === 'todayUpdate' ? 'active' : ''}`}
          onClick={() => setActiveTab('todayUpdate')}
        >
          Today Update
        </button>
      </div>
      
      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          
          <div className="form-section">
            <h2 className="section-title">{formMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
            <form onSubmit={formMode === 'add' ? handleAddProduct : handleUpdateProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Gram</label>
                  <input
                    type="number"
                    name="gram"
                    value={formData.gram}
                    onChange={handleInputChange}
                    className="form-input"
                    // step="0.01"
                    placeholder="Weight in grams"
                  />
                </div>
                
                <div className="form-group">
                  <label>Metal Type</label>
                  <select
                    name="metalType"
                    value={formData.metalType}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Custom</label>
                  <select
                    name="customOption"
                    value={formData.customOption}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="None">None</option>
                    <option value="Engraving">Engraving</option>
                    <option value="Fingerprint">Fingerprint</option>
                    <option value="combined">Combined</option>
                    <option value="image">Image</option>

                  </select>
                </div>
                
                <div className="form-group">
                  <label>People Category</label>
                  <select
                    name="peopleCategory"
                    value={formData.peopleCategory}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {peopleCategories.map(category => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Product Category</label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {productCategories.map(category => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Product Type</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Type</option>
                    {productTypes.map(type => (
                      <option key={type._id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Price Range</label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Range</option>
                    {priceRanges.map(range => (
                      <option key={range._id} value={range.name}>
                        {range.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group image-upload-section">
                  <label>Product Images (Minimum 4)</label>
                  <ImageUpload 
                    images={formData.images} 
                    setImages={setImages} 
                  />
                  <small>Upload at least 4 images of the product.</small>
                </div>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  {formMode === 'add' ? 'Add Product' : 'Update Product'}
                </button>
                {formMode === 'edit' && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          
          <div className="table-section">
  <h2 className="section-title">Product List</h2>
  {products.length > 0 ? (
    <>
         <div className="products-tab">
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="categoryFilter">Filter by Category:</label>
                <select
                  id="categoryFilter"
                  name="categoryFilter"
                  value={categoryFilter}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {productCategories.map(cat => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
      {renderProductsTable()}
      <div className="pagination">
        <button 
          className="pagination-button" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &laquo; Previous
        </button>
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
        <button 
          className="pagination-button" 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next &raquo;
        </button>
      </div>
    </>
  ) : (
    <p className="no-data-message">No products available. Add your first product above.</p>
  )}
</div>
        </div>
      )}
      
      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="form-section">
            <h2 className="section-title">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category Type</label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="people">People Category</option>
                    <option value="product">Product Category</option>
                    <option value="type">Product Type</option>
                    <option value="price">Price Range</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Add Category
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="categories-grid">
            <div className="category-section">
              <h3>People Categories</h3>
              {peopleCategories.length > 0 ? (
                renderCategoryTable(peopleCategories, 'people')
              ) : (
                <p className="no-data-message">No categories available.</p>
              )}
            </div>
            
            <div className="category-section">
              <h3>Product Categories</h3>
              {productCategories.length > 0 ? (
                renderCategoryTable(productCategories, 'product')
              ) : (
                <p className="no-data-message">No categories available.</p>
              )}
            </div>
            
            <div className="category-section">
              <h3>Product Types</h3>
              {productTypes.length > 0 ? (
                renderCategoryTable(productTypes, 'type')
              ) : (
                <p className="no-data-message">No categories available.</p>
              )}
            </div>
            
            <div className="category-section">
              <h3>Price Ranges</h3>
              {priceRanges.length > 0 ? (
                renderCategoryTable(priceRanges, 'price')
              ) : (
                <p className="no-data-message">No categories available.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Today Update Tab */}
      {activeTab === 'todayUpdate' && (
        <div>
          <div className="form-section">
            <h2 className="section-title">Today's Metal Rates & GST</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Gold Rate (₹/gram)</label>
                  <input
                    type="number"
                    name="gold"
                    value={metalRates.gold}
                    onChange={handleMetalRateChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Silver Rate (₹/gram)</label>
                  <input
                    type="number"
                    name="silver"
                    value={metalRates.silver}
                    onChange={handleMetalRateChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>GST (%)</label>
                  <input
                    type="number"
                    value={gst}
                    onChange={handleGstChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-buttons">
               
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleUpdatePrices}
                  disabled={updatingPrices}
                >
                  Update Product Prices
                </button>
              </div>
              
              {updateSuccess && (
                <div className="success-message">
                  Prices updated successfully!
                </div>
              )}
            </form>
          </div>
          
         
        </div>
      )}
      
      {/* Product view modal */}
      {renderProductView()}
    </div>
  );
};

export default ProductManagementDashboard;