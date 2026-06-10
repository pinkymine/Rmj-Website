import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// Main Product Listing component for Kids' Rings
const KidsRingPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    inStock: false,
    minPrice: 0,
    maxPrice: 5000,
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
      const url = new URL('https://rmj-backend.onrender.com/api/kids-rings');
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
   // Ensure product has the 'pendant' category set
   const productWithCategory = {
    ...product,
    category: "ring" // Explicitly set category to pendant
  };
  
  // Navigate to product details page with the updated product data
  navigate(`/product/${product.id}`, { state: { productData: productWithCategory } });
  };

  // Function to handle image errors
  const handleImageError = (e) => {
    e.target.src = "/api/placeholder/400/400"; // Fallback to placeholder
    e.target.onerror = null; // Prevent infinite callbacks
  };


  return (
    <div className="kids-ring-listing">
      <div className="kids-ring-header">
        <h1>Magical Kids' Rings</h1>
        <p className="kids-ring-subtitle">Fun and colorful rings for little adventurers</p>
      </div>

      <div className="kids-ring-banner">
        <h2>Magic for Little Fingers</h2>
        <p>Safe, durable, and wonderfully playful rings for children of all ages</p>
      </div>

      <div className="kids-ring-filter-sort-container">
        <div className="kids-ring-filters">
          <span>Filter:</span>

          <div className="kids-ring-filter-dropdown">
            <button 
              className="kids-ring-filter-btn" 
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price Range
              <span className={`kids-ring-arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="kids-ring-dropdown-content">
                <div className="kids-ring-price-range">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="500"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value, 10) })}
                  />
                  <div className="kids-ring-price-inputs">
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

          <div className="kids-ring-filter-dropdown">
            <button 
              className="kids-ring-filter-btn" 
              onClick={() => setCustomizationOpen(!customizationOpen)}
            >
              Customization Type
              <span className={`kids-ring-arrow ${customizationOpen ? 'open' : ''}`}>▼</span>
            </button>
            {customizationOpen && (
              <div className="kids-ring-dropdown-content">
                <label className="kids-ring-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "all"}
                    onChange={() => setFilters({ ...filters, customizationType: "all" })}
                  />
                  All Types
                </label>
                <label className="kids-ring-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "Fingerprint"}
                    onChange={() => setFilters({ ...filters, customizationType: "Fingerprint" })}
                  />
                  Fingerprint
                </label>
                <label className="kids-ring-radio">
                  <input
                    type="radio"
                    name="customizationType"
                    checked={filters.customizationType === "Combined"}
                    onChange={() => setFilters({ ...filters, customizationType: "Combined" })}
                  />
                  Combined
                </label>
                <label className="kids-ring-radio">
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

        <div className="kids-ring-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="kids-ring-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="kids-ring-product-count">
          {filteredProducts.length} fun rings
        </div>
      </div>

      <div className="kids-ring-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div 
              className="kids-ring-product-card" 
              key={product.id}
            >
              <div className="kids-ring-product-image">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={handleImageError}
                />
              </div>
              <div className="kids-ring-product-info">
                <h3>{product.name}</h3>
                <p className="kids-ring-description">{product.description}</p>
                <p className="kids-ring-price">₹ {product.price} {product.gram && `(${product.gram} gram)`}</p>
                <p className="kids-ring-customization-type">
                  Customization: {
                    product.customizationType === "Fingerprint" ? "Fingerprint" : 
                    product.customizationType === "Engraving" ? "Engraving" : 
                    product.customizationType === "combined" ? "Combined (Fingerprint & Engraving)" : 
                    product.customizationType
                  }
                </p>
                <button 
                  className="kids-ring-add-to-cart"
                  onClick={(event) => handleAddToCartClick(event, product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="kids-ring-no-products">
            No rings found matching your filters. Try adjusting your criteria.
          </div>
        )}
      </div>

      <div className="kids-ring-promotion-banner">
        HYPOALLERGENIC MATERIALS | ADJUSTABLE SIZES | KID-FRIENDLY DESIGNS | SAFETY TESTED
      </div>

      <div className="kids-ring-features">
        <div className="kids-ring-feature">
          <div className="kids-ring-feature-icon">🛡️</div>
          <div className="kids-ring-feature-text">Child-Safe Materials</div>
        </div>
        <div className="kids-ring-feature">
          <div className="kids-ring-feature-icon">✨</div>
          <div className="kids-ring-feature-text">Colorful & Fun</div>
        </div>
        <div className="kids-ring-feature">
          <div className="kids-ring-feature-icon">🧩</div>
          <div className="kids-ring-feature-text">Durable Design</div>
        </div>
        <div className="kids-ring-feature">
          <div className="kids-ring-feature-icon">🎁</div>
          <div className="kids-ring-feature-text">Gift Ready</div>
        </div>
      </div>

      <div className="kids-ring-testimonial">
        <div className="kids-ring-testimonial-text">
          "My daughter absolutely loves her ring! The quality is excellent, and it's held up wonderfully during playtime. She says it gives her 'special powers' and refuses to take it off!"
        </div>
        <div className="kids-ring-testimonial-author">- Ananya Patel, Mumbai</div>
      </div>
    </div>
  );
};

// export default KidsRingPage;


// CSS styles with playful theme for kids' rings
const styles = `
body {
  margin-top: 200px;
}

 .kids-ring-listing {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: #231942;
  background-color: #fff;
}

 .kids-ring-header {
  margin-bottom: 30px;
  text-align: center;
}

 .kids-ring-header h1 {
  font-size: 36px;
  color: #231942;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

 .kids-ring-subtitle {
  font-size: 16px;
  color: #ffbdc4;
  margin-top: 10px;
}

 .kids-ring-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f9f3ff 100%);
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 189, 196, 0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

 .kids-ring-banner h2 {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #231942;
}

 .kids-ring-banner p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #231942;
}

 .kids-ring-shop-now-btn {
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

 .kids-ring-shop-now-btn:hover {
  background: #ff9aad;
  transform: translateY(-2px);
}

 .kids-ring-filter-sort-container {
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

 .kids-ring-filters {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

 .kids-ring-filters span,
 .kids-ring-sort span {
  color: #231942;
  font-size: 14px;
  font-weight: 500;
}

 .kids-ring-filter-dropdown {
  position: relative;
  display: inline-block;
}

 .kids-ring-filter-btn {
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

 .kids-ring-filter-btn:hover {
  border-color: #ff9aad;
  color: #ff9aad;
  background: #f9f3ff;
}

 .kids-ring-arrow {
  font-size: 10px;
  transition: transform 0.3s;
  color: #ffbdc4;
}

 .kids-ring-arrow.open {
  transform: rotate(180deg);
}

 .kids-ring-dropdown-content {
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

 .kids-ring-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  font-size: 14px;
  transition: color 0.3s;
  color: #231942;
}

 .kids-ring-radio:hover {
  color: #ff9aad;
}

 .kids-ring-radio input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #ffbdc4;
}

 .kids-ring-price-range {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

 .kids-ring-price-range input[type="range"] {
  width: 100%;
  accent-color: #ffbdc4;
}

 .kids-ring-price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

 .kids-ring-price-inputs input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ffbdc4;
  border-radius: 4px;
  font-size: 14px;
  color: #231942;
  background: #ffffff;
}

 .kids-ring-price-inputs span {
  color: #231942;
}

 .kids-ring-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

 .kids-ring-sort-dropdown {
  padding: 10px;
  border: 1px solid #ffbdc4;
  border-radius: 25px;
  background-color: #ffffff;
  min-width: 200px;
  font-size: 14px;
  outline: none;
  color: #231942;
}

 .kids-ring-product-count {
  color: #231942;
  font-size: 14px;
  font-weight: 500;
}

 .kids-ring-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

 .kids-ring-product-card {
  background: #ffffff;
  border: 1px solid #f0e6ff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

 .kids-ring-product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(255, 189, 196, 0.15);
  border-color: #ffbdc4;
}

 .kids-ring-product-image {
  position: relative;
  padding-top: 100%;
  background: #f9f3ff;
  overflow: hidden;
}

 .kids-ring-product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

 .kids-ring-product-card:hover  .kids-ring-product-image img {
  transform: scale(1.05);
}

 .kids-ring-quick-view {
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

 .kids-ring-product-card:hover  .kids-ring-quick-view {
  bottom: 0;
}

 .kids-ring-product-info {
  padding: 20px;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff, #f9f3ff);
}

 .kids-ring-product-info h3 {
  margin: 0;
  font-size: 18px;
  color: #231942;
  margin-bottom: 8px;
}

 .kids-ring-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  min-height: 40px;
}

 .kids-ring-price {
  color: #231942;
  font-weight: bold;
  font-size: 18px;
  margin: 0 0 15px 0;
}

 .kids-ring-add-to-cart {
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

 .kids-ring-add-to-cart:hover {
  background: linear-gradient(135deg, #ffbdc4 0%, #ff9aad 100%);
  color: #fff;
  border-color: transparent;
}

 .kids-ring-promotion-banner {
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

 .kids-ring-features {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

 .kids-ring-feature {
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

 .kids-ring-feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 189, 196, 0.2);
  border-color: #ffbdc4;
}

 .kids-ring-feature-icon {
  font-size: 30px;
  margin-bottom: 15px;
  color: #ffbdc4;
}

 .kids-ring-feature-text {
  font-size: 16px;
  color: #231942;
  font-weight: 500;
}

 .kids-ring-testimonial {
  background: linear-gradient(135deg, #f9f3ff 0%, #fff 100%);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 189, 196, 0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

 .kids-ring-testimonial-text {
  font-size: 18px;
  font-style: italic;
  color: #231942;
  margin-bottom: 15px;
  line-height: 1.6;
}

 .kids-ring-testimonial-author {
  font-weight: bold;
  color: #ffbdc4;
}

 .kids-ring-loading {
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
   .kids-ring-filter-sort-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
   .kids-ring-filters {
    width: 100%;
    margin-bottom: 15px;
  }
  
   .kids-ring-sort {
    width: 100%;
    margin-bottom: 15px;
  }
  
   .kids-ring-product-count {
    width: 100%;
  }
  
   .kids-ring-banner {
    padding: 30px 20px;
  }
  
   .kids-ring-product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
   .kids-ring-dropdown-content {
    position: absolute;
    width: 100%;
    min-width: 180px;
    left: 0;
    right: 0;
  }
  
   .kids-ring-filter-dropdown {
    position: relative;
    width: 100%;
  }
  
   .kids-ring-filter-btn {
    width: 100%;
    justify-content: space-between;
  }
}
`;


const additionalStyles = `
.kids-ring-out-of-stock {
  background: #e0e0e0;
  border: 1px solid #ccc;
  color: #666;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  width: 100%;
  font-weight: 500;
  cursor: not-allowed;
}

.kids-ring-error {
  padding: 30px;
  text-align: center;
  background: #fff0f0;
  color: #d32f2f;
  border-radius: 8px;
  margin: 20px;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.kids-ring-no-products {
  grid-column: 1 / -1;
  padding: 40px;
  text-align: center;
  background: #f9f3ff;
  border-radius: 8px;
  color: #231942;
  font-size: 16px;
}

.kids-ring-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #231942;
  padding: 10px 18px;
  border: 1px solid #ffbdc4;
  border-radius: 25px;
  transition: all 0.3s;
}

.kids-ring-checkbox:hover {
  border-color: #ff9aad;
  color: #ff9aad;
  background: #f9f3ff;
}

.kids-ring-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #ffbdc4;
}
`;


// Applying styles
const KidsRingListing = () => (
  <>
    <style>{styles}</style>
    <style>{additionalStyles}</style>

    <KidsRingPage />
  </>
);

export default KidsRingListing;