import React, { useState, useEffect } from 'react';
// import "../style/velkada.css";
import { useNavigate } from 'react-router-dom';

// Main Product Listing component
const VelKadaListingPage = () => {
  const navigate = useNavigate();
  
  // Hardcoded product data 
  const initialProducts = [
    { 
      id: 1, 
      name: "Murugu Vel Kada Gold polish", 
      price: "2,900.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Mens"
    },
    { 
      id: 2, 
      name: "Unisex Vel Kada DS1", 
      price: "3,000.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Unisex"
    },
    { 
      id: 3, 
      name: "Unisex Vel Kada DS2", 
      price: "2,990.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Unisex"
    },
    { 
      id: 4, 
      name: "Unisex Vel Kada Peacock", 
      price: "6,000.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Unisex"
    },
    { 
      id: 5, 
      name: "Silver Vel Kada Premium", 
      price: "4,500.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Womens"
    },
    { 
      id: 6, 
      name: "Vel Kada with Stones", 
      price: "5,200.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Womens"
    },
    { 
      id: 7, 
      name: "Classic Vel Kada", 
      price: "3,500.00", 
      image: "/api/placeholder/400/400", 
      inStock: false,
      category: "Mens"
    },
    { 
      id: 8, 
      name: "Pearl Vel Kada", 
      price: "7,200.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Womens"
    }
  ];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    inStock: false,
    minPrice: 0,
    maxPrice: 10000,
    category: "all"
  });
  const [sortBy, setSortBy] = useState('featured');
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Load products on component mount
  useEffect(() => {
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
    setLoading(false);
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Apply availability filter
    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }

    // Apply price range filter
    result = result.filter(product => {
      const price = parseFloat(product.price.replace(/,/g, ''));
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return a.id - b.id;
        case 'alpha-asc':
          return a.name.localeCompare(b.name);
        case 'alpha-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, ''));
        case 'price-desc':
          return parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, ''));
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, filters, sortBy]);

  // Handler for product click
  const handleProductClick = (product) => {
    // Navigate to product details page with product ID
    navigate(`/product/${product.id}`, { state: { productData: product } });
  };


  return (
    <div className="velkada-listing">
      <div className="velkada-listing-header">
        <h1>Vel Kada</h1>
      </div>

      <div className="velkada-filter-sort-container">
        <div className="velkada-filters">
          <span>Filter:</span>
          <div className="velkada-filter-dropdown">
            <button 
              className="velkada-filter-btn" 
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
            >
              Availability
              <span className={`arrow ${availabilityOpen ? 'open' : ''}`}>▼</span>
            </button>
            {availabilityOpen && (
              <div className="velkada-dropdown-content">
                <label className="velkada-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  />
                  In stock only
                </label>
              </div>
            )}
          </div>

          <div className="velkada-filter-dropdown">
            <button 
              className="velkada-filter-btn" 
              onClick={() => setPriceOpen(!priceOpen)}
            >
              Price
              <span className={`arrow ${priceOpen ? 'open' : ''}`}>▼</span>
            </button>
            {priceOpen && (
              <div className="velkada-dropdown-content">
                <div className="velkada-price-range">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value, 10) })}
                  />
                  <div className="velkada-price-inputs">
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

          <div className="velkada-filter-dropdown">
            <button 
              className="velkada-filter-btn" 
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category
              <span className={`arrow ${categoryOpen ? 'open' : ''}`}>▼</span>
            </button>
            {categoryOpen && (
              <div className="velkada-dropdown-content">
                <label className="velkada-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === "all"}
                    onChange={() => setFilters({ ...filters, category: "all" })}
                  />
                  All
                </label>
                <label className="velkada-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === "Mens"}
                    onChange={() => setFilters({ ...filters, category: "Mens" })}
                  />
                  Men's
                </label>
                <label className="velkada-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === "Womens"}
                    onChange={() => setFilters({ ...filters, category: "Womens" })}
                  />
                  Women's
                </label>
                <label className="velkada-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === "Unisex"}
                    onChange={() => setFilters({ ...filters, category: "Unisex" })}
                  />
                  Unisex
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="velkada-sort">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="velkada-sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>

        <div className="velkada-product-count">
          {filteredProducts.length} products
        </div>
      </div>

      <div className="velkada-product-grid">
        {filteredProducts.map(product => (
          <div 
            className="velkada-product-card" 
            key={product.id}
            onClick={() => handleProductClick(product)}
          >
            <div className="velkada-product-image">
              <img src={product.image} alt={product.name} />
              {!product.inStock && <span className="velkada-out-of-stock">Out of Stock</span>}
            </div>
            <div className="velkada-product-info">
              <h3>{product.name}</h3>
              <p className="velkada-price">From ₹ {product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="velkada-banner">
        ALL ITEMS SOLD BY US ARE GENUINE SILVER WITH RESALE VALUE ALL OVER INDIA
      </div>

      <div className="velkada-features">
        <div className="velkada-feature">
          <div className="velkada-feature-icon">📦</div>
          <div className="velkada-feature-text">COD Available</div>
        </div>
        <div className="velkada-feature">
          <div className="velkada-feature-icon">🔒</div>
          <div className="velkada-feature-text">Safe & Secure</div>
        </div>
        <div className="velkada-feature">
          <div className="velkada-feature-icon">🎁</div>
          <div className="velkada-feature-text">Perfect Gifts</div>
        </div>
        <div className="velkada-feature">
          <div className="velkada-feature-icon">⭐</div>
          <div className="velkada-feature-text">Assured Quality</div>
        </div>
      </div>
    </div>
  );
};

// CSS styles for all components
const styles = `
body {
  margin-top: 250px;
  color: #231942;
}

.velkada-listing {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}

.velkada-listing-header {
  margin-bottom: 30px;
}

.velkada-listing-header h1 {
  font-size: 32px;
  font-weight: 500;
  color: #231942;
  margin: 0;
}

.velkada-filter-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.velkada-filters {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.velkada-filters span,
.velkada-sort span {
  color: #666;
  font-size: 14px;
}

.velkada-filter-dropdown {
  position: relative;
  display: inline-block;
}

.velkada-filter-btn {
  background: white;
  border: 1px solid #f0e6ff;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.velkada-filter-btn:hover {
  border-color: #ffbdc4;
  box-shadow: 0 0 0 2px rgba(255, 189, 196, 0.2);
}

.arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(180deg);
}

.velkada-dropdown-content {
  position: absolute;
  z-index: 1;
  background: white;
  border: 1px solid #f0e6ff;
  border-radius: 8px;
  min-width: 200px;
  padding: 15px;
  margin-top: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.velkada-checkbox,
.velkada-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 14px;
}

.velkada-checkbox input[type="checkbox"],
.velkada-radio input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #ffbdc4;
}

.velkada-price-range {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.velkada-price-range input[type="range"] {
  width: 100%;
  accent-color: #ffbdc4;
}

.velkada-price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.velkada-price-inputs input {
  width: 70px;
  padding: 10px;
  border: 1px solid #f0e6ff;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.velkada-price-inputs input:focus {
  border-color: #ffbdc4;
  box-shadow: 0 0 0 2px rgba(255, 189, 196, 0.2);
  outline: none;
}

.velkada-price-inputs span {
  color: #666;
}

.velkada-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.velkada-sort-dropdown {
  padding: 10px;
  border: 1px solid #f0e6ff;
  border-radius: 25px;
  background-color: white;
  min-width: 200px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.velkada-sort-dropdown:focus {
  border-color: #ffbdc4;
  box-shadow: 0 0 0 2px rgba(255, 189, 196, 0.2);
  outline: none;
}

.velkada-product-count {
  color: #666;
  font-size: 14px;
}

.velkada-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.velkada-product-card {
  background: white;
  border: 1px solid #f0e6ff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.velkada-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.velkada-product-image {
  position: relative;
  padding-top: 100%;
  background: #f9f3ff;
}

.velkada-product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.velkada-out-of-stock {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.velkada-product-info {
  padding: 15px;
  text-align: center;
}

.velkada-product-info h3 {
  margin: 0;
  font-size: 16px;
  color: #231942;
  margin-bottom: 8px;
}

.velkada-price {
  color: #ffbdc4;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
}

.velkada-banner {
  background-color: #ffbdc4;
  color: #231942;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.velkada-features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 50px 0;
  padding: 20px 0;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(255, 189, 196, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.velkada-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
  width: 180px;
}

.velkada-feature-icon {
  width: 60px;
  height: 60px;
  background-color: #ffbdc4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: #231942;
  font-size: 24px;
}

.velkada-feature-text {
  font-weight: 500;
  color: #231942;
  font-size: 14px;
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
}

/* Add animations from the contact page */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.highlight {
  background: linear-gradient(90deg, #ffbdc4, #ff9aad, #ffbdc4);
  background-size: 200% 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shimmer 3s infinite;
  display: inline-block;
}

/* Media Queries */
@media (max-width: 768px) {
  .velkada-filter-sort-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .velkada-filters {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .velkada-sort {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .velkada-product-count {
    width: 100%;
  }
  
  .velkada-features {
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
  }
  
  .velkada-feature {
    width: 150px;
    margin: 10px;
  }
  
  .velkada-feature-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .velkada-listing-header h1 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .velkada-listing-header h1 {
    font-size: 24px;
  }
  
  .velkada-feature {
    width: 120px;
    margin: 5px;
  }
  
  .velkada-feature-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
`;

// Applying styles
const Velkada = () => (
  <>
    <style>{styles}</style>
    <VelKadaListingPage />
  </>
);

export default Velkada;