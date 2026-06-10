import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/kids.css";

// Optimized Image Component with lazy loading and progressive enhancement
const OptimizedImage = React.memo(({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`image-container ${loaded ? 'loaded' : 'loading'}`}>
      <img
        src={src || "/api/placeholder/400/400"}
        alt={alt}
        className={`${className} ${loaded ? 'fade-in-fast' : ''}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden',
        }}
      />
      {!loaded && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
    </div>
  );
});

// Main Product Listing component for Kids Jewelry
const KidsJewelry = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    productCategory: '',
    productType: '',
    minPrice: 0,
    maxPrice: 50000
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [priceOpen, setPriceOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  
  // Simplified animation states
  const [pageLoaded, setPageLoaded] = useState(false);

  // Debounced filter function to prevent excessive API calls
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Memoized API call
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (filters.productCategory) {
        params.append('productCategory', filters.productCategory);
      }
      
      if (filters.productType) {
        params.append('productType', filters.productType);
      }
      
      if (filters.minPrice > 0) {
        params.append('minPrice', filters.minPrice);
      }
      
      if (filters.maxPrice < 50000) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      if (sortBy !== 'featured') {
        params.append('sortBy', sortBy);
      }
      
      const response = await axios.get(
        `https://rmj-backend.onrender.com/api/products/category/kids?${params}`,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  // Debounced version of fetchProducts
  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 300),
    [fetchProducts, debounce]
  );

  // Initial load
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Quick connection test
        await axios.get('https://rmj-backend.onrender.com/api/test', { timeout: 5000 });
        fetchProducts();
      } catch (err) {
        console.error('API connection test failed:', err);
        setError('Cannot connect to server. Please ensure the backend is running.');
        setLoading(false);
      }
    };
    
    initializeComponent();
    
    // Quick page load animation
    requestAnimationFrame(() => {
      setPageLoaded(true);
    });
  }, [fetchProducts]);

  // Apply filters with debouncing
  useEffect(() => {
    if (!loading && pageLoaded) {
      debouncedFetchProducts();
    }
  }, [filters, sortBy, debouncedFetchProducts, loading, pageLoaded]);

  // Optimized add to cart handler
  const handleAddToCart = useCallback((e, product) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`, { state: { productData: product } });
  }, [navigate]);

  // Memoized price formatter
  const formatPrice = useCallback((price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // Optimized filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handlePriceChange = useCallback((type, value) => {
    const numValue = parseInt(value, 10) || 0;
    setFilters(prev => ({ ...prev, [type]: numValue }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      productCategory: '',
      productType: '',
      minPrice: 0,
      maxPrice: 50000
    });
  }, []);

  // Memoized product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => {
    return filteredProducts.map((product, index) => (
      <div 
        className="kids-jewelry-product-card optimized-card"
        key={product._id || index}
        style={{ 
          '--animation-delay': `${Math.min(index * 50, 1000)}ms`,
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      >
        <div className="kids-jewelry-product-image">
          <OptimizedImage
            src={product.images && product.images.length > 0 ? product.images[0] : null}
            alt={product.name}
            className="product-image-optimized"
          />
        </div>
        <div className="kids-jewelry-product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="kids-jewelry-description">
            {product.productType} {product.productCategory}
          </p>
          <p className="kids-jewelry-price">
            ₹ {formatPrice(product.price)} {product.gram && `(${product.gram} gram)`}
          </p>
          <button 
            className="kids-jewelry-add-to-cart optimized-button"
            onClick={(e) => handleAddToCart(e, product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    ));
  }, [filteredProducts, handleAddToCart, formatPrice]);


  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`kids-jewelry-listing optimized ${pageLoaded ? 'loaded' : ''}`}>
      <div className="kids-jewelry-header">
        <h1 className="main-title">Kids Jewelry Collection</h1>
        <p className="kids-jewelry-subtitle">Adorable and delightful jewelry for your little ones</p>
      </div>

      <div className="kids-jewelry-banner">
        <h2>Kids Collection</h2>
        <p>Discover our exclusive range of handcrafted jewelry designed specially for children</p>
      </div>

      <div className="kids-jewelry-filter-sort-container">
        <div className="kids-jewelry-filters">
          <span>Filter:</span>

          {/* Price Range Filter */}
          <div className="kids-jewelry-filter-dropdown">
            <button 
              className="kids-jewelry-filter-btn" 
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price Range
              <span className={`arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="kids-jewelry-dropdown-content">
                <div className="kids-jewelry-price-range">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  />
                  <div className="kids-jewelry-price-inputs">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Category Filter */}
          <div className="kids-jewelry-filter-dropdown">
            <button 
              className="kids-jewelry-filter-btn" 
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category
              <span className={`arrow ${categoryOpen ? 'open' : ''}`}>▼</span>
            </button>
            {categoryOpen && (
              <div className="kids-jewelry-dropdown-content">
                {[
                  { value: "", label: "All Categories" },
                  { value: "Anklet", label: "Anklet" },
                  { value: "Thanda", label: "Thanda" },
                  { value: "Bangle", label: "Bangle" },
                  { value: "Stud", label: "Stud" },
                  { value: "Chain", label: "Chain" },
                  { value: "Ring", label: "Ring" },
                  { value: "Pendant", label: "Pendant" },
                  { value: "Bracelets", label: "Bracelets" },
                  { value: "Ear-rings", label: "Ear-rings" },
                  { value: "Thayathu", label: "Thayathu" },
                  { value: "Kids-chain", label: "Kids Chain" },
                  { value: "Kada", label: "Kada" }
                ].map(category => (
                  <label key={category.value} className="kids-jewelry-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.productCategory === category.value}
                      onClick={() => setCategoryOpen(false)}
                      onChange={() => handleFilterChange('productCategory', category.value)}
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Product Type Filter */}
          <div className="kids-jewelry-filter-dropdown">
            <button 
              className="kids-jewelry-filter-btn" 
              onClick={() => setTypeOpen(!typeOpen)}
            >
              Material
              <span className={`arrow ${typeOpen ? 'open' : ''}`}>▼</span>
            </button>
            {typeOpen && (
              <div className="kids-jewelry-dropdown-content">
                {[
                  { value: "", label: "All Materials" },
                  { value: "Gold", label: "Gold" },
                  { value: "Silver", label: "Silver" }
                ].map(type => (
                  <label key={type.value} className="kids-jewelry-radio">
                    <input
                      type="radio"
                      name="type"
                      checked={filters.productType === type.value}
                       onClick={() => setTypeOpen(false)}
                      onChange={() => handleFilterChange('productType', type.value)}
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="kids-jewelry-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="kids-jewelry-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="kids-jewelry-product-count">
          {filteredProducts.length} products
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-fast"></div>
         
        </div>
      )}

      <div className="kids-jewelry-product-grid optimized-grid">
        {productGrid}
      </div>

      

     

      <div className="kids-jewelry-promotion-banner">
        <span className="sparkle">✨</span> AUTHENTIC GOLD & SILVER KIDS JEWELRY WITH HALLMARK CERTIFICATION <span className="sparkle">✨</span>
      </div>

      <div className="kids-jewelry-features">
        <div className="kids-jewelry-feature">
          <div className="kids-jewelry-feature-icon">💎</div>
          <div className="kids-jewelry-feature-text">Premium Quality Materials</div>
        </div>
        
        <div className="kids-jewelry-feature">
          <div className="kids-jewelry-feature-icon">🚚</div>
          <div className="kids-jewelry-feature-text">Fast Shipping</div>
        </div>
        
        <div className="kids-jewelry-feature">
          <div className="kids-jewelry-feature-icon">🎁</div>
          <div className="kids-jewelry-feature-text">Gift Packaging</div>
        </div>
      </div>

      <div className="kids-jewelry-testimonial">
        <div className="kids-jewelry-testimonial-text">
          "My daughter absolutely loves her new gold anklet. The quality is excellent and it's the perfect size for her tiny feet!"
        </div>
        <div className="kids-jewelry-testimonial-author">- Priya K.</div>
      </div>
    </div>
  );
};

export default KidsJewelry;