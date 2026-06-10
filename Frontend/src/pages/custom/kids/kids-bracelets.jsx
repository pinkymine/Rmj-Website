// In your frontend code, modify the KidsBraceletPage component to use the backend API

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios

// Main Product Listing component for Kids' Bracelets
const KidsBraceletPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    inStock: false,
    minPrice: 0,
    maxPrice: 2000,
    customizationType: "all"
  });
  const [sortBy, setSortBy] = useState('featured');
  const [priceOpen, setPriceOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Construct the API URL with query parameters
      const url = new URL('https://rmj-backend.onrender.com/api/kids-bracelets');
      url.searchParams.append('minPrice', filters.minPrice);
      url.searchParams.append('maxPrice', filters.maxPrice);
      url.searchParams.append('customizationType', filters.customizationType);
      url.searchParams.append('sortBy', sortBy);
      
      const response = await axios.get(url.toString());
      
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        console.error('API returned error:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load products when component mounts or filters/sort change
  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  // Handler for Add to Cart button click
  const handleAddToCartClick = (event, product) => {
    // Stop event propagation to prevent it from bubbling up to the parent div
    event.stopPropagation();
    const productWithCategory = {
      ...product,
      category: "bracelet" // Explicitly set category to pendant
    };
    
    // Navigate to product details page with the updated product data
    navigate(`/product/${product.id}`, { state: { productData: productWithCategory } });
  };



  return (
    <div className="bracelet-listing">
      <div className="bracelet-header">
        <h1>Enchanted Kids' Bracelets</h1>
        <p className="bracelet-subtitle">Sparkling treasures that wrap around little wrists</p>
      </div>

      <div className="bracelet-banner">
        <h2>Magical Wearable Adventures!</h2>
        <p>Each bracelet holds special charms that bring imagination to life. Which story will your child wear?</p>
      
      </div>

      <div className="bracelet-filter-sort-container">
        <div className="bracelet-filters">
          <span>Filter:</span>

          <div className="bracelet-filter-dropdown">
            <button 
              className="bracelet-filter-btn" 
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price Range
              <span className={`bracelet-arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="bracelet-dropdown-content">
                <div className="bracelet-price-range">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="200"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value, 10) })}
                  />
                  <div className="bracelet-price-inputs">
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

          <div className="bracelet-filter-dropdown">
            <button 
              className="bracelet-filter-btn" 
              onClick={() => setCustomizationOpen(!customizationOpen)}
            >
              Customization Type
              <span className={`bracelet-arrow ${customizationOpen ? 'open' : ''}`}>▼</span>
            </button>
            {customizationOpen && (
              <div className="bracelet-dropdown-content">
                <label className="bracelet-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "all"}
                    onChange={() => setFilters({ ...filters, customizationType: "all" })}
                  />
                  All Types
                </label>
                <label className="bracelet-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "fingerprint"}
                    onChange={() => setFilters({ ...filters, customizationType: "fingerprint" })}
                  />
                  Fingerprint
                </label>
                <label className="bracelet-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "engraving"}
                    onChange={() => setFilters({ ...filters, customizationType: "engraving" })}
                  />
                  Engraving
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="bracelet-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bracelet-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="bracelet-product-count">
          {filteredProducts.length} magical bracelets
        </div>
      </div>

      <div className="bracelet-product-grid">
        {filteredProducts.map(product => (
          <div 
            className="bracelet-product-card" 
            key={product.id}
          >
            <div className="bracelet-product-image">
            <img src={product.images ? product.images[0] : product.image} alt={product.name} />
            </div>
            <div className="bracelet-product-info">
              <h3>{product.name}</h3>
              <p className="bracelet-description">{product.description}</p>
              <p className="bracelet-price">₹ {product.price}{product.gram && `(${product.gram} gram)`}</p>
              <p className="bracelet-customization-type">
                Customization: {product.customizationType === "fingerprint" ? "Fingerprint" : 
                                 product.customizationType === "engraving" ? "Engraving" : 
                                 product.customizationType}
              </p>
              <button 
                className="bracelet-add-to-cart"
                onClick={(e) => handleAddToCartClick(e, product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bracelet-promotion-banner">
        ADJUSTABLE SIZES | CHILD-SAFE CLASPS | GIFT WRAPPED | HYPOALLERGENIC MATERIALS
      </div>

      <div className="bracelet-features">
        <div className="bracelet-feature">
          <div className="bracelet-feature-icon">✨</div>
          <div className="bracelet-feature-text">Sparkly Designs</div>
        </div>
        <div className="bracelet-feature">
          <div className="bracelet-feature-icon">🔒</div>
          <div className="bracelet-feature-text">Secure Clasp</div>
        </div>
        <div className="bracelet-feature">
          <div className="bracelet-feature-icon">🌈</div>
          <div className="bracelet-feature-text">Colorful Options</div>
        </div>
        <div className="bracelet-feature">
          <div className="bracelet-feature-icon">📏</div>
          <div className="bracelet-feature-text">Adjustable Size</div>
        </div>
      </div>

      <div className="bracelet-testimonial">
        <div className="bracelet-testimonial-text">
          "My son hasn't taken off his Space Bracelet since his birthday! It's comfortable enough for everyday wear and the charms are so well-made. The adjustable size means it will fit him as he grows!"
        </div>
        <div className="bracelet-testimonial-author">- Arjun Singh, Delhi</div>
      </div>
    </div>
  );
};


// CSS styles with playful theme for kids' bracelets
const styles = `
body {
  margin-top: 200px;
}

.bracelet-listing {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: #231942;
  background-color: #fff;
}

.bracelet-header {
  margin-bottom: 30px;
  text-align: center;
}

.bracelet-header h1 {
  font-size: 36px;
  color: #231942;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.bracelet-subtitle {
  font-size: 16px;
  color: #ffbdc4;
  margin-top: 10px;
}

.bracelet-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f9f3ff 100%);
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 189, 196, 0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.bracelet-banner h2 {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #231942;
}

.bracelet-banner p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #231942;
}

.bracelet-shop-now-btn {
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

.bracelet-shop-now-btn:hover {
  background: #ff9aad;
  transform: translateY(-2px);
}

.bracelet-filter-sort-container {
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

.bracelet-filters {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.bracelet-filters span,
.bracelet-sort span {
  color: #231942;
  font-size: 14px;
  font-weight: 500;
}

.bracelet-filter-dropdown {
  position: relative;
  display: inline-block;
}

.bracelet-filter-btn {
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

.bracelet-filter-btn:hover {
  border-color: #ff9aad;
  color: #ff9aad;
  background: #f9f3ff;
}

.bracelet-arrow {
  font-size: 10px;
  transition: transform 0.3s;
  color: #ffbdc4;
}

.bracelet-arrow.open {
  transform: rotate(180deg);
}

.bracelet-dropdown-content {
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

.bracelet-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  font-size: 14px;
  transition: color 0.3s;
  color: #231942;
}

.bracelet-radio:hover {
  color: #ff9aad;
}

.bracelet-radio input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #ffbdc4;
}

.bracelet-price-range {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bracelet-price-range input[type="range"] {
  width: 100%;
  accent-color: #ffbdc4;
}

.bracelet-price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bracelet-price-inputs input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ffbdc4;
  border-radius: 4px;
  font-size: 14px;
  color: #231942;
  background: #ffffff;
}

.bracelet-price-inputs span {
  color: #231942;
}

.bracelet-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bracelet-sort-dropdown {
  padding: 10px;
  border: 1px solid #ffbdc4;
  border-radius: 25px;
  background-color: #ffffff;
  min-width: 200px;
  font-size: 14px;
  outline: none;
  color: #231942;
}

.bracelet-product-count {
  color: #231942;
  font-size: 14px;
  font-weight: 500;
}

.bracelet-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.bracelet-product-card {
  background: #ffffff;
  border: 1px solid #f0e6ff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.bracelet-product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(255, 189, 196, 0.15);
  border-color: #ffbdc4;
}

.bracelet-product-image {
  position: relative;
  padding-top: 100%;
  background: #f9f3ff;
  overflow: hidden;
}

.bracelet-product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.bracelet-product-card:hover .bracelet-product-image img {
  transform: scale(1.05);
}

.bracelet-quick-view {
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

.bracelet-product-card:hover .bracelet-quick-view {
  bottom: 0;
}

.bracelet-product-info {
  padding: 20px;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff, #f9f3ff);
}

.bracelet-product-info h3 {
  margin: 0;
  font-size: 18px;
  color: #231942;
  margin-bottom: 8px;
}

.bracelet-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  min-height: 40px;
}

.bracelet-price {
  color: #231942;
  font-weight: bold;
  font-size: 18px;
  margin: 0 0 15px 0;
}

.bracelet-add-to-cart {
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

.bracelet-add-to-cart:hover {
  background: linear-gradient(135deg, #ffbdc4 0%, #ff9aad 100%);
  color: #fff;
  border-color: transparent;
}

.bracelet-promotion-banner {
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

.bracelet-features {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.bracelet-feature {
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

.bracelet-feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 189, 196, 0.2);
  border-color: #ffbdc4;
}

.bracelet-feature-icon {
  font-size: 30px;
  margin-bottom: 15px;
  color: #ffbdc4;
}

.bracelet-feature-text {
  font-size: 16px;
  color: #231942;
  font-weight: 500;
}

.bracelet-testimonial {
  background: linear-gradient(135deg, #f9f3ff 0%, #fff 100%);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 189, 196, 0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.bracelet-testimonial-text {
  font-size: 18px;
  font-style: italic;
  color: #231942;
  margin-bottom: 15px;
  line-height: 1.6;
}

.bracelet-testimonial-author {
  font-weight: bold;
  color: #ffbdc4;
}

.bracelet-loading {
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
  .bracelet-filter-sort-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bracelet-filters {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .bracelet-sort {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .bracelet-product-count {
    width: 100%;
  }
  
  .bracelet-banner {
    padding: 30px 20px;
  }
  
  .bracelet-product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  .bracelet-dropdown-content {
    position: absolute;
    width: 100%;
    min-width: 180px;
    left: 0;
    right: 0;
  }
  
  .bracelet-filter-dropdown {
    position: relative;
    width: 100%;
  }
  
  .bracelet-filter-btn {
    width: 100%;
    justify-content: space-between;
  }

  }`;

// Applying styles
const KidsBraceletListing = () => (
  <>
    <style>{styles}</style>
    <KidsBraceletPage />
  </>
);

export default KidsBraceletListing;