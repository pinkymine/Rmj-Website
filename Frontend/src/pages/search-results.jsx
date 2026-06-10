import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from '../style/search.module.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  
  // Removed unused setFilters
  const [filters] = useState({
    peopleCategory: 'all',
    productCategory: 'all',
    productType: 'all',
    minPrice: 0,
    maxPrice: 50000,
    customOption: 'all',
    inStock: false
  });
  
  // Removed state for tracking customizable products - we want to show all products
  
  // Removed unused setSortBy
  const [sortBy] = useState('featured');
  
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Fetch products from API - wrapped in useCallback to fix dependency warnings
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Building query parameters
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      params.append('page', pagination.currentPage);
      params.append('limit', 12); // Number of products per page
      
      if (filters.peopleCategory !== 'all') {
        params.append('peopleCategory', filters.peopleCategory);
      }
      
      if (filters.productCategory !== 'all') {
        params.append('productCategory', filters.productCategory);
      }
      
      if (filters.productType !== 'all') {
        params.append('productType', filters.productType);
      }
      
      if (filters.customOption !== 'all') {
        params.append('customOption', filters.customOption);
      }
      
      if (filters.minPrice > 0) {
        params.append('minPrice', filters.minPrice);
      }
      
      if (filters.maxPrice < 50000) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      if (filters.inStock) {
        params.append('inStock', 'true');
      }
      
      if (sortBy !== 'featured') {
        params.append('sortBy', sortBy);
      }
      
      // Make API request
      const response = await axios.get(`https://rmj-backend.onrender.com/api/products/search?${params}`);
      
      setResults(response.data.products);
      setFilteredResults(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
      
      // Removed the customizable products check - we want to show all products
      setError(null);
      
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load products. Please try again later. Error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [searchQuery, pagination.currentPage, filters, sortBy]);

  // Watch for changes in searchQuery and reset pagination when it changes
  useEffect(() => {
    // Reset to page 1 when search query changes
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    
    // Clear previous results when starting a new search
    setResults([]);
    setFilteredResults([]);
    
    // Set loading states for new search
    setIsLoading(true);
    setIsInitialLoad(true);
    
    // Reset error state
    setError(null);
    
  }, [searchQuery]);

  // Call fetchProducts when pagination changes OR searchQuery changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, pagination.currentPage, searchQuery]);

  // Load products on component mount - initial API connection test
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('https://rmj-backend.onrender.com/api/test');
        // console.log('API Test Response:', response.data);
        // No need to call fetchProducts here as it will be triggered by the useEffect above
      } catch (err) {
        console.error('API connection test failed:', err);
        setError('Cannot connect to server. Please ensure the backend is running.');
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    testConnection();
  }, []);

  // Handle product click - store data and navigate
  const handleProductClick = (product) => {
    // Create a minimal product object with essential information
    const minimalProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: Math.round(product.price * 1.2), // Example calculation
      // Only keep the first image URL if available
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      category: product.productCategory,
      peopleCategory: product.peopleCategory,
      productType: product.productType,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      inStock: product.inStock,
      customizationType: product.customizationType || '',
    };
    
    try {
      // Try to store the minimal product data
      localStorage.setItem(`product_${product._id}`, JSON.stringify(minimalProduct));
    } catch (err) {
      console.warn('localStorage quota exceeded. Clearing some space and retrying...');
      
      // If quota exceeded, clear old product data
      clearOldProductData();
      
      try {
        // Try storing again
        localStorage.setItem(`product_${product._id}`, JSON.stringify(minimalProduct));
      } catch (storageErr) {
        // If still failing, use sessionStorage as fallback
        console.warn('Still unable to use localStorage, using sessionStorage instead');
        try {
          sessionStorage.setItem(`product_${product._id}`, JSON.stringify(minimalProduct));
        } catch (sessionErr) {
          console.error('Unable to store product data in browser storage');
          // Continue anyway - we'll still navigate to the product page
        }
      }
    }
    
    setHoveredProduct(product._id);
  };
  
  // Function to clear old product data from localStorage
  const clearOldProductData = () => {
    const keysToRemove = [];
    
    // Find keys that start with 'product_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('product_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the oldest 50% of product entries
    const removeCount = Math.ceil(keysToRemove.length / 2);
    keysToRemove.slice(0, removeCount).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  // Add to cart now redirects to product details
  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent the link navigation
    e.stopPropagation(); // Prevent navigating to product page
    
    // Store product data first
    handleProductClick(product);
    
    // Navigate to product details with product data in state
    // This ensures data is available even if localStorage fails
    navigate(`/product/${product._id}`, { state: { productData: product } });
  };
  
  // Handle redirect to customization page - kept but will be shown as a button alongside regular results
  const handleCustomizeRedirect = () => {
    navigate('/custom/men/rings');
  };

  // Page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));
      
      // Scroll to top of results
      window.scrollTo({
        top: document.querySelector(`.${styles.searchResultsHeader}`).offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Show loading spinner for initial load
  if (isInitialLoad) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Searching for "{searchQuery}"...</p>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className={styles.errorMessage}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Removed the hasCustomizableProducts conditional rendering - we now show all products

  return (
    <div className={styles.searchResultsListing}>
      <div className={styles.searchResultsHeader}>
        <h1>Search Results</h1>
        <div className={styles.searchInfo}>
          <FiSearch /> 
          <span>
            {isLoading 
              ? `Searching for "${searchQuery}"...` 
              : results.length > 0 
                ? `${pagination.total} results for "${searchQuery}"` 
                : `No results found for "${searchQuery}"`
            }
          </span>
        </div>
      </div>

      <div className={styles.searchResultsBanner}>
        <h2>Discover Your Perfect Piece</h2>
        <p>Browse our exclusive collection matching your search</p>
      </div>

      {/* Add customization button - optional, shows alongside regular results */}
      <div className={styles.customizationOptions}>
        <button 
          onClick={handleCustomizeRedirect}
          className={styles.customRedirectBtn}
        >
          Explore Customizable Products
        </button>
      </div>

      {/* Only show loading overlay during non-initial loading states */}
      {isLoading && !isInitialLoad && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {results.length > 0 ? (
        <>
          <div className={styles.searchProductGrid}>
            {filteredResults.map((product, index) => (
              <div 
                className={`${styles.searchProductCard} ${hoveredProduct === product._id ? styles.cardHighlight : ''}`}
                key={product._id || index}
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className={styles.searchProductImage}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <img src="/api/placeholder/400/400" alt={product.name} />
                  )}
                  {/* Show customization badge if product has custom options */}
                  {product.customOption && ['Fingerprint', 'Engraving', 'Image', 'combined'].includes(product.customOption) && (
                    <div className={styles.customBadge}>
                      Customizable
                    </div>
                  )}
                </div>
                <div className={styles.searchProductInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.searchDescription}>
                    {product.productType} {product.productCategory} - {product.peopleCategory}
                  </p>
                  <p className={styles.searchPrice}>₹ {formatPrice(product.price)} {product.gram && `(${product.gram} gram)`}</p>
                  {!product.inStock && (
                    <p className={styles.outOfStock}>Out of Stock</p>
                  )}
                  <button 
                    className={styles.searchAddToCart}
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isLoading}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination - only show when not loading */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className={styles.searchPagination}>
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || isLoading}
                className={`${styles.pageButton} ${styles.prevButton}`}
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages).keys()].map(page => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={isLoading}
                  className={`${styles.pageButton} ${pagination.currentPage === page + 1 ? styles.activePage : ''}`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || isLoading}
                className={`${styles.pageButton} ${styles.nextButton}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : !isLoading && (
        <div className={styles.noProductsFound}>
          <div className={styles.noResultsIcon}>
            <FiSearch size={40} />
          </div>
          <h3>No products found matching "{searchQuery}"</h3>
          <p>Try adjusting your search term or browse our categories</p>
          <div className={styles.suggestedLinks}>
            <Link to="/category/Female" className={styles.linkHoverEffect}>Women's Jewelry</Link>
            <Link to="/category/Male" className={styles.linkHoverEffect}>Men's Jewelry</Link>
            <Link to="/category/Kids" className={styles.linkHoverEffect}>Kid's Jewelry</Link>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className={styles.returnHomeButton}
          >
            Return to Home
          </button>
        </div>
      )}

      <div className={styles.searchPromotionBanner}>
        SECURED PAYMENT • HALLMARK CERTIFICATION
      </div>
    </div>
  );
};

export default SearchResults;