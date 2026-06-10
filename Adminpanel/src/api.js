import axios from 'axios';

// Base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || 'https://backend-ecommerce-1-zdfc.onrender.com/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },

});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Enhance error message with more details
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    enhancedError.endpoint = error.config?.url;
    enhancedError.response = error.response; // Add full response for detailed error handling
    
    // Log detailed error information
    console.error(`API Error: ${errorMessage}`, {
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    return Promise.reject(enhancedError);
  }
);

// Helper function to handle API requests
const apiRequest = async (method, endpoint, data = null) => {
  try {
    console.log(`API Request: ${method.toUpperCase()} ${endpoint}`);

    const config = {
      method,
      url: endpoint
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    // Add endpoint info to error
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// =============================
// ✅ PRODUCT SERVICES
// =============================

export const getProducts = async () => {
  return await apiRequest('get', '/products');
};

export const getProductById = async (productId) => {
  return await apiRequest('get', `/products/${productId}`);
};

export const addProduct = async (productData) => {
  return await apiRequest('post', '/products', productData);
};

export const updateProduct = async (productId, productData) => {
  return await apiRequest('put', `/products/${productId}`, productData);
};

export const deleteProduct = async (productId) => {
  return await apiRequest('delete', `/products/${productId}`);
};

// =============================
// ✅ CATEGORY SERVICES
// =============================

// Using consistent endpoint patterns with proper error handling
// Fix for getProductTypes function to use the correct endpoint
export const getProductTypes = async () => {
  try {
    // Try the direct endpoint that matches your actual route configuration
    return await apiRequest('get', '/product-types');
  } catch (error) {
    console.error('Error fetching product types:', error);
    return []; // Return empty array to prevent application crash
  }
};

// Similarly update other category functions if needed
export const getPeopleCategories = async () => {
  try {
    return await apiRequest('get', '/people-categories');
  } catch (error) {
    console.error('Error fetching people categories:', error);
    return [];
  }
};

export const getProductCategories = async () => {
  try {
    return await apiRequest('get', '/product-categories');
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
};

export const getPriceRanges = async () => {
  try {
    return await apiRequest('get', '/price-ranges');
  } catch (error) {
    console.error('Error fetching price ranges:', error);
    return [];
  }
};

// ✅ ADD CATEGORY FUNCTIONS

export const addPeopleCategory = async (categoryData) => {
  try {
    return await apiRequest('post', '/categories/people', categoryData);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('post', '/people-categories', categoryData);
  }
};

export const addProductCategory = async (categoryData) => {
  try {
    return await apiRequest('post', '/categories/product', categoryData);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('post', '/product-categories', categoryData);
  }
};

export const addProductType = async (typeData) => {
  try {
    return await apiRequest('post', '/categories/type', typeData);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('post', '/product-types', typeData);
  }
};

export const addPriceRange = async (rangeData) => {
  try {
    return await apiRequest('post', '/categories/price', rangeData);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('post', '/price-ranges', rangeData);
  }
};

// ✅ DELETE CATEGORY FUNCTIONS

export const deletePeopleCategory = async (categoryId) => {
  try {
    return await apiRequest('delete', `/categories/people/${categoryId}`);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('delete', `/people-categories/${categoryId}`);
  }
};

export const deleteProductCategory = async (categoryId) => {
  try {
    return await apiRequest('delete', `/categories/product/${categoryId}`);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('delete', `/product-categories/${categoryId}`);
  }
};

export const deleteProductType = async (typeId) => {
  try {
    return await apiRequest('delete', `/categories/type/${typeId}`);
  } catch (error) {
    console.warn('Primary endpoint failed, trying fallback:', error);
    return await apiRequest('delete', `/product-types/${typeId}`);
  }
};

export const deletePriceRange = async (rangeId) => {
  try {
    console.log(`Attempting to delete price range: ${rangeId}`);
    
    try {
      const response = await apiRequest('delete', `/categories/price/${rangeId}`);
      console.log('Delete success:', response);
      return response;
    } catch (error) {
      console.warn('Primary endpoint failed, trying fallback:', error);
      const response = await apiRequest('delete', `/price-ranges/${rangeId}`);
      console.log('Delete success with fallback:', response);
      return response;
    }
  } catch (error) {
    console.error(`Error deleting price range ${rangeId}:`, error.response?.data || error.message);
    throw error;
  }
};

// =============================
// ✅ API HEALTH CHECK
// =============================

export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    console.log('API Health Check:', response.data);
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw new Error(`API server may be down: ${error.message}`);
  }
};

// =============================
// ✅ METAL RATES SERVICES
// =============================

export const getMetalRates = async () => {
  try {
    const response = await apiRequest('get', '/rates');
    return response.data;
  } catch (error) {
    console.error('Error fetching metal rates:', error);
    // Return empty data to prevent crash
    return { rates: [] };
  }
};

export const getLatestMetalRates = async () => {
  try {
    const response = await apiRequest('get', '/rates/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest rates:', error);
    // Return empty data to prevent crash
    return { rates: [] };
  }
};

// Update product prices based on current metal rates
export const updateProductPrices = async (ratesData) => {
  try {
    return await apiRequest('post', '/products/update-prices', ratesData);
  } catch (error) {
    console.error('Error updating product prices:', error);
    throw error;
  }
};

// New method to get custom options
export const getCustomOptions = async () => {
  try {
    return await apiRequest('get', '/custom-options');
  } catch (error) {
    console.error('Error fetching custom options:', error);
    return [];
  }
};

// Method to add a new custom option
export const addCustomOption = async (optionData) => {
  try {
    return await apiRequest('post', '/custom-options', optionData);
  } catch (error) {
    console.error('Error adding custom option:', error);
    throw error;
  }
};

// Method to delete a custom option
export const deleteCustomOption = async (optionId) => {
  try {
    return await apiRequest('delete', `/custom-options/${optionId}`);
  } catch (error) {
    console.error('Error deleting custom option:', error);
    throw error;
  }
};
