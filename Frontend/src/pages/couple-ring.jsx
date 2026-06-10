import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// Main Product Listing component for Couple Rings
const Coupleringlist = () => {
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
  
  // Animation states
  const [pageLoaded, setPageLoaded] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
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
      const response = await axios.get(`https://rmj-backend.onrender.com/api/products/category/couples?${params}`);
      // console.log('API Response:', response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later. Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount with staggered animations
  useEffect(() => {
    // Test API connection first - FIXED PORT HERE from 5000 to 5043
    const testConnection = async () => {
      try {
        const response = await axios.get('https://rmj-backend.onrender.com/api/test');
        // console.log('API Test Response:', response.data);
        // If test is successful, fetch products
        fetchProducts();
      } catch (err) {
        console.error('API connection test failed:', err);
        setError('Cannot connect to server. Please ensure the backend is running.');
        setLoading(false);
      }
    };
    
    testConnection();
    
    // Staggered animation timing
    setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    
    setTimeout(() => {
      setProductsVisible(true);
    }, 600);
    
    setTimeout(() => {
      setFeaturesVisible(true);
    }, 1200);
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [filters, sortBy]);

  // Handler for product click (no redirection now)
  const handleProductClick = (product) => {
    // No redirection happens when clicking on the product card
    console.log('Product clicked:', product);
  };

  // Add to cart functionality (modified to redirect to product details)
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent bubbling up to parent elements
    
    // Navigate to product details page when Add to Cart is clicked
    navigate(`/product/${product._id}`, { state: { productData: product } });
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


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
    <div className={`kids-listing ${pageLoaded ? 'fade-in' : ''}`}>
      <div className="kids-header">
        <h1 className="slide-in-top">Couple Rings Collection</h1>
        <p className="kids-subtitle slide-in-top-delay">Celebrate your love with our matching couple rings</p>
      </div>

      <div className="kids-banner fade-in-delay">
        <h2>Love & Commitment</h2>
        <p>Discover our exclusive range of handcrafted couple rings to symbolize your journey together</p>
      </div>

      <div className="kids-filter-sort-container fade-in-delay-2">
        <div className="kids-filters">
          <span>Filter:</span>

          {/* Price Range Filter */}
          <div className="kids-filter-dropdown">
            <button 
              className="kids-filter-btn" 
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price Range
              <span className={`arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="kids-dropdown-content dropdown-fade-in">
                <div className="kids-price-range">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value, 10) })}
                  />
                  <div className="kids-price-inputs">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value, 10) || 0 })}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Category Filter */}
          <div className="kids-filter-dropdown">
            <button 
              className="kids-filter-btn" 
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category
              <span className={`arrow ${categoryOpen ? 'open' : ''}`}>▼</span>
            </button>
            {categoryOpen && (
              <div className="kids-dropdown-content dropdown-fade-in">
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === ""}
                    onChange={() => setFilters({ ...filters, productCategory: "" })}
                  />
                  All Categories
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Promise"}
                    onChange={() => setFilters({ ...filters, productCategory: "Promise" })}
                  />
                  Promise
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Engagement"}
                    onChange={() => setFilters({ ...filters, productCategory: "Engagement" })}
                  />
                  Engagement
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Wedding"}
                    onChange={() => setFilters({ ...filters, productCategory: "Wedding" })}
                  />
                  Wedding
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.productCategory === "Anniversary"}
                    onChange={() => setFilters({ ...filters, productCategory: "Anniversary" })}
                  />
                  Anniversary
                </label>
              </div>
            )}
          </div>

          {/* Product Type Filter */}
          <div className="kids-filter-dropdown">
            <button 
              className="kids-filter-btn" 
              onClick={() => setTypeOpen(!typeOpen)}
            >
              Material
              <span className={`arrow ${typeOpen ? 'open' : ''}`}>▼</span>
            </button>
            {typeOpen && (
              <div className="kids-dropdown-content dropdown-fade-in">
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.productType === ""}
                    onChange={() => setFilters({ ...filters, productType: "" })}
                  />
                  All Materials
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.productType === "Gold"}
                    onChange={() => setFilters({ ...filters, productType: "Gold" })}
                  />
                  Gold
                </label>
                <label className="kids-radio">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.productType === "Silver"}
                    onChange={() => setFilters({ ...filters, productType: "Silver" })}
                  />
                  Silver
                </label>
              
              </div>
            )}
          </div>
        </div>

        <div className="kids-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="kids-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="kids-product-count">
          {filteredProducts.length} products
        </div>
      </div>



      <div className={`kids-product-grid ${productsVisible ? 'grid-fade-in' : ''}`}>
        {filteredProducts.map((product, index) => (
          <div 
            className="kids-product-card product-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            key={product._id || index}
            onClick={() => handleProductClick(product)}
          >
            <div className="kids-product-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <img src="/api/placeholder/400/400" alt={product.name} />
              )}
            </div>
            <div className="kids-product-info">
              <h3>{product.name}</h3>
              <p className="kids-description">
                {product.productType} {product.productCategory}
              </p>
              <p className="kids-price">₹ {formatPrice(product.price)} {product.gram && `(${product.gram} gram)`}</p>
              <button 
                className="kids-add-to-cart pulse-animation"
                onClick={(e) => handleAddToCart(e, product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>



      <div className="kids-promotion-banner slide-in-left">
        AUTHENTIC COUPLE RINGS WITH HALLMARK CERTIFICATION & LIFETIME WARRANTY
      </div>

      <div className={`kids-features ${featuresVisible ? 'features-fade-in' : ''}`}>
        <div className="kids-feature bounce-in">
          <div className="kids-feature-icon">💍</div>
          <div className="kids-feature-text">Perfect Matching Sets</div>
        </div>
       
        <div className="kids-feature bounce-in" style={{ animationDelay: "300ms" }}>
          <div className="kids-feature-icon">🚚</div>
          <div className="kids-feature-text">Fast Shipping</div>
        </div>
        <div className="kids-feature bounce-in" style={{ animationDelay: "450ms" }}>
          <div className="kids-feature-icon">📦</div>
          <div className="kids-feature-text">Elegant Gift Packaging</div>
        </div>
      </div>

      <div className="kids-testimonial fade-in-up">
        <div className="kids-testimonial-text">
          "These matching rings are perfect! The craftsmanship is outstanding and they symbolize our commitment beautifully. Couldn't be happier with our purchase."
        </div>
        <div className="kids-testimonial-author">- Priya & Arun</div>
      </div>
    </div>
  );
};



const styles = `
body {
margin-top: 200px;
}

.kids-listing {
padding: 20px;
max-width: 1200px;
margin: 0 auto;
color: #231942;
background-color: #fff;
}

.kids-header {
margin-bottom: 30px;
text-align: center;
}

.kids-header h1 {
font-size: 36px;
color: #231942;
margin: 0;
letter-spacing: 1px;
text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.kids-subtitle {
font-size: 16px;
color: #ffbdc4;
margin-top: 10px;
}

.kids-banner {
background: linear-gradient(135deg, #ffffff 0%, #f9f3ff 100%);
padding: 40px;
text-align: center;
border-radius: 8px;
margin-bottom: 40px;
border: 1px solid rgba(255, 189, 196, 0.3);
box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.kids-banner h2 {
font-size: 28px;
margin: 0 0 10px 0;
color: #231942;
}

.kids-banner p {
font-size: 16px;
margin-bottom: 20px;
color: #231942;
}

.kids-shop-now-btn {
background: #ffbdc4;
color: #231942;
border: none;
padding: 12px 30px;
border-radius: 30px;
font-size: 16px;
cursor: pointer;
transition: background 0.3s;
box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.kids-shop-now-btn:hover {
background: #ff9aad;
transform: translateY(-2px);
}

.kids-filter-sort-container {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
flex-wrap: wrap;
gap: 15px;
background: #ffffff;
padding: 15px;
border-radius: 8px;
border: 1px solid #f0e6ff;
box-shadow: 0 2px 8px rgba(35, 25, 66, 0.05);
}

.kids-filters {
display: flex;
align-items: center;
gap: 15px;
flex-wrap: wrap;
}

.kids-filters span,
.kids-sort span {
color: #231942;
font-size: 14px;
font-weight: 500;
}

.kids-filter-dropdown {
position: relative;
display: inline-block;
}

.kids-filter-btn {
background: #ffffff;
border: 1px solid #ffbdc4;
padding: 10px 18px;
border-radius: 25px;
cursor: pointer;
font-size: 14px;
display: flex;
align-items: center;
gap: 10px;
transition: all 0.3s;
color: #231942;
}

.kids-filter-btn:hover {
border-color: #ff9aad;
color: #ff9aad;
background: #f9f3ff;
}

.kids-arrow {
font-size: 10px;
transition: transform 0.3s;
color: #ffbdc4;
}

.kids-arrow.open {
transform: rotate(180deg);
}

.kids-dropdown-content {
position: absolute;
z-index: 1;
background: #ffffff;
border: 1px solid #ffbdc4;
border-radius: 8px;
min-width: 220px;
padding: 15px;
margin-top: 10px;
box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.kids-radio {
display: flex;
align-items: center;
gap: 8px;
cursor: pointer;
margin-bottom: 12px;
font-size: 14px;
transition: color 0.3s;
color: #231942;
}

.kids-radio:hover {
color: #ff9aad;
}

.kids-radio input[type="radio"] {
width: 16px;
height: 16px;
accent-color: #ffbdc4;
}

.kids-price-range {
display: flex;
flex-direction: column;
gap: 15px;
}

.kids-price-range input[type="range"] {
width: 100%;
accent-color: #ffbdc4;
}

.kids-price-inputs {
display: flex;
align-items: center;
gap: 10px;
}

.kids-price-inputs input {
width: 80px;
padding: 8px;
border: 1px solid #ffbdc4;
border-radius: 4px;
font-size: 14px;
color: #231942;
background: #ffffff;
}

.kids-price-inputs span {
color: #231942;
}

.kids-sort {
display: flex;
align-items: center;
gap: 10px;
}

.kids-sort-dropdown {
padding: 10px;
border: 1px solid #ffbdc4;
border-radius: 25px;
background-color: #ffffff;
min-width: 200px;
font-size: 14px;
outline: none;
color: #231942;
}

.kids-product-count {
color: #231942;
font-size: 14px;
font-weight: 500;
}

.kids-product-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 30px;
margin-bottom: 40px;
}

.kids-product-card {
background: #ffffff;
border: 1px solid #f0e6ff;
border-radius: 12px;
overflow: hidden;
transition: transform 0.3s, box-shadow 0.3s;
cursor: pointer;
box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.kids-product-card:hover {
transform: translateY(-6px);
box-shadow: 0 12px 30px rgba(255, 189, 196, 0.15);
border-color: #ffbdc4;
}

.kids-product-image {
position: relative;
padding-top: 100%;
background: #f9f3ff;
overflow: hidden;
}

.kids-product-image img {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
object-fit: cover;
transition: transform 0.5s;
}

.kids-product-card:hover .kids-product-image img {
transform: scale(1.05);
}

.kids-quick-view {
position: absolute;
bottom: -40px;
left: 0;
right: 0;
background: rgba(255, 189, 196, 0.8);
color: #231942;
text-align: center;
padding: 10px;
transition: bottom 0.3s;
}

.kids-product-card:hover .kids-quick-view {
bottom: 0;
}

.kids-product-info {
padding: 20px;
text-align: center;
background: linear-gradient(to bottom, #ffffff, #f9f3ff);
}

.kids-product-info h3 {
margin: 0;
font-size: 18px;
color: #231942;
margin-bottom: 8px;
}

.kids-description {
color: #666;
font-size: 14px;
margin-bottom: 12px;
min-height: 40px;
}

.kids-price {
color: #231942;
font-weight: bold;
font-size: 18px;
margin: 0 0 15px 0;
}

.kids-add-to-cart {
background: transparent;
border: 1px solid #ffbdc4;
color: #231942;
padding: 10px 20px;
border-radius: 25px;
font-size: 14px;
cursor: pointer;
transition: all 0.3s;
width: 100%;
font-weight: 500;
}

.kids-add-to-cart:hover {
background: linear-gradient(135deg, #ffbdc4 0%, #ff9aad 100%);
color: #fff;
border-color: transparent;
}

.kids-promotion-banner {
background: linear-gradient(135deg, #231942 0%, #342056 100%);
color: #fff;
padding: 18px;
text-align: center;
font-weight: bold;
margin-bottom: 40px;
border-radius: 8px;
letter-spacing: 1px;
box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.kids-features {
display: flex;
justify-content: space-between;
margin-bottom: 40px;
flex-wrap: wrap;
gap: 20px;
}

.kids-feature {
flex: 1;
min-width: 200px;
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
padding: 20px;
background: #fff;
border-radius: 8px;
transition: transform 0.3s;
border: 1px solid rgba(255, 189, 196, 0.3);
box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.kids-feature:hover {
transform: translateY(-5px);
box-shadow: 0 10px 20px rgba(255, 189, 196, 0.2);
border-color: #ffbdc4;
}

.kids-feature-icon {
font-size: 30px;
margin-bottom: 15px;
color: #ffbdc4;
}

.kids-feature-text {
font-size: 16px;
color: #231942;
font-weight: 500;
}

.kids-testimonial {
background: linear-gradient(135deg, #f9f3ff 0%, #fff 100%);
padding: 30px;
border-radius: 8px;
text-align: center;
margin-bottom: 40px;
border: 1px solid rgba(255, 189, 196, 0.3);
box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.kids-testimonial-text {
font-size: 18px;
font-style: italic;
color: #231942;
margin-bottom: 15px;
line-height: 1.6;
}

.kids-testimonial-author {
font-weight: bold;
color: #ffbdc4;
}

.kids-loading {
display: flex;
justify-content: center;
align-items: center;
height: 300px;
font-size: 18px;
color: #231942;
background: #f9f3ff;
border-radius: 8px;
}

@media (max-width: 768px) {
.kids-filter-sort-container {
  flex-direction: column;
  align-items: flex-start;
}

.kids-filters {
  width: 100%;
  margin-bottom: 15px;
}

.kids-sort {
  width: 100%;
  margin-bottom: 15px;
}

.kids-product-count {
  width: 100%;
}

.kids-banner {
  padding: 30px 20px;
}

.kids-product-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.kids-dropdown-content {
  position: absolute;
  width: 100%;
  min-width: 180px;
  left: 0;
  right: 0;
}

.kids-filter-dropdown {
  position: relative;
  width: 100%;
}

.kids-filter-btn {
  width: 100%;
  justify-content: space-between;
}
}
`;


const Couplering = () => (
  <>
    <style>{styles}</style>
    <Coupleringlist />
  </>
);

export default Couplering;