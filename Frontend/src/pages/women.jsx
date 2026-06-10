import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/mens.css";
import  "../style/women.css";

// Main Product Listing component for Men's Jewelry
const MensJewelry = () => {
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
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Memoized API call to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Building query parameters
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
      
      // Make API request
      const response = await axios.get(`https://rmj-backend.onrender.com/api/products/category/women?${params}`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later. Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  // Load products on component mount with minimal animations
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('https://rmj-backend.onrender.com/api/test');
        fetchProducts();
      } catch (err) {
        console.error('API connection test failed:', err);
        setError('Cannot connect to server. Please ensure the backend is running.');
        setLoading(false);
      }
    };
    
    testConnection();
    
    // Immediate page load animation
    setTimeout(() => setPageLoaded(true), 100);
  }, [fetchProducts]);

  // Debounced filter application
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        fetchProducts();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters, sortBy, loading, fetchProducts]);

  // Optimized product click handler
  const handleProductClick = useCallback((productId) => {
    setHoveredProduct(productId);
  }, []);

  // Optimized add to cart handler
  const handleAddToCart = useCallback((e, product) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`, { state: { productData: product } });
  }, [navigate]);

  // Memoized price formatter
  const formatPrice = useCallback((price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // Memoized filter handlers
  const handlePriceChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: parseInt(value, 10) || 0 }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setFilters(prev => ({ ...prev, productCategory: category }));
  }, []);

  const handleTypeChange = useCallback((type) => {
    setFilters(prev => ({ ...prev, productType: type }));
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
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
        className={`mens-jewelry-product-card ${hoveredProduct === product._id ? 'card-highlight' : ''}`}
        key={product._id || index}
        onClick={() => handleProductClick(product._id)}
        onMouseEnter={() => setHoveredProduct(product._id)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        <div className="mens-jewelry-product-image">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease'
              }}
            />
          ) : (
            <img 
              src="/api/placeholder/400/400" 
              alt={product.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease'
              }}
            />
          )}
          <div className="image-overlay">
            
          </div>
        </div>
        <div className="mens-jewelry-product-info">
          <h3>{product.name}</h3>
          <p className="mens-jewelry-description">
            {product.productType} {product.productCategory}
          </p>
          <p className="mens-jewelry-price">₹ {formatPrice(product.price)} {product.gram && `(${product.gram} gram)`}</p>
          <button 
            className="mens-jewelry-add-to-cart"
            onClick={(e) => handleAddToCart(e, product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    ));
  }, [filteredProducts, hoveredProduct, handleProductClick, handleAddToCart, formatPrice]);


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
    <div className={`mens-jewelry-listing ${pageLoaded ? 'fade-in' : ''}`}>
      <div className="mens-jewelry-header">
        <h1>women's Jewelry Collection</h1>
        <p className="mens-jewelry-subtitle">Sophisticated designs for the modern man</p>
      </div>

      <div className="mens-jewelry-banner">
        <h2>Premium Collection</h2>
        <p>Discover our exclusive range of handcrafted women's jewelry</p>
      </div>

      <div className="mens-jewelry-filter-sort-container">
        <div className="mens-jewelry-filters">
          <span>Filter:</span>

          {/* Price Range Filter */}
          <div className="mens-jewelry-filter-dropdown">
            <button 
              className={`mens-jewelry-filter-btn ${priceOpen ? 'active-filter' : ''}`}
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price Range
              <span className={`arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="mens-jewelry-dropdown-content">
                <div className="mens-jewelry-price-range">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  />
                  <div className="mens-jewelry-price-inputs">
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
          <div className="womens-jewelry-filter-dropdown">
            <button 
              className="womens-jewelry-filter-btn" 
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category
              <span className={`arrow ${categoryOpen ? 'open' : ''}`}>▼</span>
            </button>
            {categoryOpen && (
              <div className="womens-jewelry-dropdown-content dropdown-fade-in-fast">
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === ""}
                    onChange={() => setFilters({ ...filters, productCategory: "" })}
                  />
                  All Categories
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Chain"}
                    onClick={() => setCategoryOpen(false)}
                    onChange={() => setFilters({ ...filters, productCategory: "Chain" })}
                  />
                  Chain
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Ring"}
                    onClick={() => setCategoryOpen(false)}
                    onChange={() => setFilters({ ...filters, productCategory: "Ring" })}
                  />
                  Rings
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Bracelets"}
                    onClick={() => setCategoryOpen(false)}
                    onChange={() => setFilters({ ...filters, productCategory: "Bracelets" })}
                  />
                  Bracelets
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Pendants"}
                    onClick={() => setCategoryOpen(false)}
                    onChange={() => setFilters({ ...filters, productCategory: "Pendants" })}
                  />
                  Pendants
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "metti"}
                    onChange={() => setFilters({ ...filters, productCategory: "metti" })}
                  />
                  metti
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Anklet"}
                    onChange={() => setFilters({ ...filters, productCategory: "Anklet" })}
                  />
                  Anklet
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Haaram"}
                    onChange={() => setFilters({ ...filters, productCategory: "Haaram" })}
                  />
                  Haaram
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Neckles"}
                    onChange={() => setFilters({ ...filters, productCategory: "Neckles" })}
                  />
                  Neckles
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Dolar with Earings"}
                    onChange={() => setFilters({ ...filters, productCategory: "Dolar with Earings" })}
                  />
                  Dolar with Earings
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Matil"}
                    onChange={() => setFilters({ ...filters, productCategory: "Matil" })}
                  />
                  Matil
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Earings"}
                    onChange={() => setFilters({ ...filters, productCategory: "Earings" })}
                  />
                  Earings
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Nose-pin"}
                    onChange={() => setFilters({ ...filters, productCategory: "Nose-pin" })}
                  />
                  Nose-pin
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Side-studs"}
                    onChange={() => setFilters({ ...filters, productCategory: "Side-studs" })}
                  />
                  Side-studs
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Ear-Rings"}
                    onChange={() => setFilters({ ...filters, productCategory: "Ear-Rings" })}
                  />
                  Ear-Rings
                </label>
                <label className="womens-jewelry-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Bangles"}
                    onChange={() => setFilters({ ...filters, productCategory: "Bangles" })}
                  />
                  Bangles
                </label>
              </div>
            )}
          </div>

          {/* Product Type Filter */}
          <div className="mens-jewelry-filter-dropdown">
            <button 
              className={`mens-jewelry-filter-btn ${typeOpen ? 'active-filter' : ''}`}
              onClick={() => setTypeOpen(!typeOpen)}
            >
              Material
              <span className={`arrow ${typeOpen ? 'open' : ''}`}>▼</span>
            </button>
            {typeOpen && (
              <div className="mens-jewelry-dropdown-content">
                {['', 'Gold', 'Silver'].map((type) => (
                  <label className="mens-jewelry-radio" key={type}>
                    <input
                      type="radio"
                      name="type"
                      checked={filters.productType === type}
                      onClick={() => setTypeOpen(false)}
                      onChange={() => handleTypeChange(type)}
                    />
                    {type === '' ? 'All Materials' : type}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mens-jewelry-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={handleSortChange}
            className="mens-jewelry-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="mens-jewelry-product-count">
          {filteredProducts.length} products
        </div>
      </div>

      

      <div className="mens-jewelry-product-grid">
        {productGrid}
      </div>



 

      <div className="mens-jewelry-promotion-banner">
        AUTHENTIC GOLD & SILVER JEWELRY WITH HALLMARK CERTIFICATION
      </div>

      <div className="mens-jewelry-features">
        <div className="mens-jewelry-feature">
          <div className="mens-jewelry-feature-icon">💎</div>
          <div className="mens-jewelry-feature-text">Premium Quality Materials</div>
        </div>
        
        <div className="mens-jewelry-feature">
          <div className="mens-jewelry-feature-icon">🚚</div>
          <div className="mens-jewelry-feature-text">Fast Shipping</div>
        </div>
        <div className="mens-jewelry-feature">
          <div className="mens-jewelry-feature-icon">📦</div>
          <div className="mens-jewelry-feature-text">Gift Packaging</div>
        </div>
      </div>

      <div className="mens-jewelry-testimonial">
        <div className="mens-jewelry-testimonial-text">
          "The craftsmanship of these pieces is exceptional. My gold bracelet has become part of my daily style statement."
        </div>
        <div className="mens-jewelry-testimonial-author">- Rajesh M.</div>
      </div>
    </div>
  );
};

export default MensJewelry;