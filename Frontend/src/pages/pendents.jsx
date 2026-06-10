import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Main Product Listing component for Pendants with integrated CSS
const PendantsProductPage = () => {
  const navigate = useNavigate();
  
  // CSS styles with gold theme
  const styles = `
  body {
    margin-top: 200px;
  }
  .kids-listing {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    color: #333;
    background-color: #fffaf0;
  }

  .kids-header {
    margin-bottom: 30px;
    text-align: center;
  }

  .kids-header h1 {
    font-size: 36px;
    color: #8B4513;
    margin: 0;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .kids-subtitle {
    font-size: 16px;
    color: #a67c00;
    margin-top: 10px;
  }

  .kids-banner {
    background: linear-gradient(135deg, #f3e5ab 0%, #e6c456 100%);
    padding: 40px;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 40px;
    border: 1px solid rgba(205, 127, 50, 0.3);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .kids-banner h2 {
    font-size: 28px;
    margin: 0 0 10px 0;
    color: #8B4513;
  }

  .kids-banner p {
    font-size: 16px;
    margin-bottom: 20px;
    color: #8B4513;
  }

  .kids-shop-now-btn {
    background: #8B4513;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }

  .kids-shop-now-btn:hover {
    background: #704214;
    transform: translateY(-2px);
  }

  .kids-filter-sort-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
    background: #fff8e1;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #f0e6c5;
  }

  .kids-filters {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .kids-filters span,
  .kids-sort span {
    color: #8B4513;
    font-size: 14px;
    font-weight: 500;
  }

  .kids-filter-dropdown {
    position: relative;
    display: inline-block;
  }

  .kids-filter-btn {
    background: white;
    border: 1px solid #daa520;
    padding: 10px 18px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
    color: #8B4513;
  }

  .kids-filter-btn:hover {
    border-color: #8B4513;
    color: #8B4513;
    background: #fff8e1;
  }

  .kids-arrow {
    font-size: 10px;
    transition: transform 0.3s;
    color: #8B4513;
  }

  .kids-arrow.open {
    transform: rotate(180deg);
  }

  .kids-dropdown-content {
    position: absolute;
    z-index: 1;
    background: white;
    border: 1px solid #daa520;
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
    color: #8B4513;
  }

  .kids-radio:hover {
    color: #daa520;
  }

  .kids-radio input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: #daa520;
  }

  .kids-price-range {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .kids-price-range input[type="range"] {
    width: 100%;
    accent-color: #daa520;
  }

  .kids-price-inputs {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .kids-price-inputs input {
    width: 80px;
    padding: 8px;
    border: 1px solid #daa520;
    border-radius: 4px;
    font-size: 14px;
    color: #8B4513;
  }

  .kids-price-inputs span {
    color: #8B4513;
  }

  .kids-sort {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .kids-sort-dropdown {
    padding: 10px;
    border: 1px solid #daa520;
    border-radius: 25px;
    background-color: white;
    min-width: 200px;
    font-size: 14px;
    outline: none;
    color: #8B4513;
  }

  .kids-product-count {
    color: #8B4513;
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
    background: white;
    border: 1px solid #f0e6c5;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .kids-product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(218, 165, 32, 0.15);
    border-color: #daa520;
  }

  .kids-product-image {
    position: relative;
    padding-top: 100%;
    background: #f9f9f9;
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
    background: rgba(139, 69, 19, 0.8);
    color: white;
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
    background: linear-gradient(to bottom, white, #fff8e1);
  }

  .kids-product-info h3 {
    margin: 0;
    font-size: 18px;
    color: #8B4513;
    margin-bottom: 8px;
  }

  .kids-description {
    color: #ffb700;
    font-size: 14px;
    margin-bottom: 12px;
    min-height: 40px;
  }

  .kids-price {
    color: #8B4513;
    font-weight: bold;
    font-size: 18px;
    margin: 0 0 15px 0;
  }

  .kids-add-to-cart {
    background: transparent;
    border: 1px solid #daa520;
    color: #8B4513;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    font-weight: 500;
  }

  .kids-add-to-cart:hover {
    background: linear-gradient(135deg, #daa520 0%, #cd7f32 100%);
    color: white;
    border-color: transparent;
  }

  .kids-promotion-banner {
    background: linear-gradient(135deg, #8B4513 0%, #704214 100%);
    color: #f3e5ab;
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
    background: #fff8e1;
    border-radius: 8px;
    transition: transform 0.3s;
    border: 1px solid rgba(218, 165, 32, 0.3);
  }

  .kids-feature:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(139, 69, 19, 0.1);
    border-color: #daa520;
  }

  .kids-feature-icon {
    font-size: 30px;
    margin-bottom: 15px;
    color: #daa520;
  }

  .kids-feature-text {
    font-size: 16px;
    color: #8B4513;
    font-weight: 500;
  }

  .kids-testimonial {
    background: linear-gradient(135deg, #fff8e1 0%, #f3e5ab 100%);
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 40px;
    border: 1px solid rgba(218, 165, 32, 0.3);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .kids-testimonial-text {
    font-size: 18px;
    font-style: italic;
    color: #8B4513;
    margin-bottom: 15px;
    line-height: 1.6;
  }

  .kids-testimonial-author {
    font-weight: bold;
    color: #a67c00;
  }

  .kids-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 18px;
    color: #8B4513;
    background: #fff8e1;
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
  
  // Enhanced product data for pendants
  const initialProducts = [
    { 
      id: 501, 
      name: "Diamond Solitaire Pendant", 
      price: "18,500.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Diamond",
      description: "Classic 0.5 carat diamond solitaire pendant in 18K gold setting"
    },
    { 
      id: 502, 
      name: "Heart Locket Pendant", 
      price: "6,200.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Gold",
      description: "Gold heart locket pendant that opens to hold two small photos"
    },
    { 
      id: 503, 
      name: "Pearl Drop Pendant", 
      price: "8,900.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Pearl",
      description: "Elegant South Sea pearl with diamond accent on 18K gold chain"
    },
    { 
      id: 504, 
      name: "Initial Letter Pendant", 
      price: "4,500.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Personalized",
      description: "Customizable 14K gold initial pendant with delicate chain"
    },
    { 
      id: 505, 
      name: "Emerald Halo Pendant", 
      price: "15,800.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Gemstone",
      description: "Stunning emerald center stone surrounded by diamond halo"
    },
    { 
      id: 506, 
      name: "Vintage Filigree Pendant", 
      price: "7,200.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Vintage",
      description: "Intricate filigree design pendant with antique finish"
    },
    { 
      id: 507, 
      name: "Hamsa Protection Pendant", 
      price: "5,800.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Religious",
      description: "Symbolic Hamsa hand pendant with turquoise and diamond accents"
    },
    { 
      id: 508, 
      name: "Birthstone Pendant", 
      price: "6,900.00", 
      image: "/api/placeholder/400/400", 
      inStock: true,
      category: "Personalized",
      description: "Customizable pendant with your choice of birthstone in gold setting"
    }
  ];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    inStock: false,
    minPrice: 0,
    maxPrice: 20000,
    category: "all"
  });
  const [sortBy, setSortBy] = useState('featured');
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

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

    // Apply price range filter
    result = result.filter(product => {
      const price = parseFloat(product.price.replace(/,/g, ''));
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
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
    navigate(`/product/${product.id}`, { state: { productData: product } });
  };



  return (
    <>
      <style>{styles}</style>
      <div className="kids-listing">
        <div className="kids-header">
          <h1>Luxury Pendants Collection</h1>
          <p className="kids-subtitle">Adorn yourself with elegance that makes a statement</p>
        </div>

        <div className="kids-banner">
          <h2>Treasures to Cherish</h2>
          <p>Discover our exquisite collection of pendants crafted with the finest materials and artistry</p>
          <button className="kids-shop-now-btn">Shop Pendants</button>
        </div>

        <div className="kids-filter-sort-container">
          <div className="kids-filters">
            <span>Filter:</span>

            <div className="kids-filter-dropdown">
              <button 
                className="kids-filter-btn" 
                onClick={() => setPriceOpen(!priceOpen)}
              >
                Price Range
                <span className={`kids-arrow ${priceOpen ? 'open' : ''}`}>▼</span>
              </button>
              {priceOpen && (
                <div className="kids-dropdown-content">
                  <div className="kids-price-range">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
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

            <div className="kids-filter-dropdown">
              <button 
                className="kids-filter-btn" 
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                Category
                <span className={`kids-arrow ${categoryOpen ? 'open' : ''}`}>▼</span>
              </button>
              {categoryOpen && (
                <div className="kids-dropdown-content">
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "all"}
                      onChange={() => setFilters({ ...filters, category: "all" })}
                    />
                    All Categories
                  </label>
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "diamond"}
                      onChange={() => setFilters({ ...filters, category: "diamond" })}
                    />
                    Diamond
                  </label>
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "gold"}
                      onChange={() => setFilters({ ...filters, category: "gold" })}
                    />
                    Gold
                  </label>
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "gemstone"}
                      onChange={() => setFilters({ ...filters, category: "gemstone" })}
                    />
                    Gemstone
                  </label>
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "personalized"}
                      onChange={() => setFilters({ ...filters, category: "personalized" })}
                    />
                    Personalized
                  </label>
                  <label className="kids-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === "pearl"}
                      onChange={() => setFilters({ ...filters, category: "pearl" })}
                    />
                    Pearl
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
            {filteredProducts.length} pendants found
          </div>
        </div>

        <div className="kids-product-grid">
          {filteredProducts.map(product => (
            <div 
              className="kids-product-card" 
              key={product.id}
              onClick={() => handleProductClick(product)}
            >
              <div className="kids-product-image">
                <img src={product.image} alt={product.name} />
                <div className="kids-quick-view">Quick View</div>
              </div>
              <div className="kids-product-info">
                <h3>{product.name}</h3>
                <p className="kids-description">{product.description}</p>
                <p className="kids-price">₹ {product.price}</p>
                <button className="kids-add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        <div className="kids-promotion-banner">
          CERTIFIED AUTHENTIC |  GIFT BOX | COMPLIMENTARY CHAIN | LIFETIME WARRANTY
        </div>

        <div className="kids-features">
          <div className="kids-feature">
            <div className="kids-feature-icon">💎</div>
            <div className="kids-feature-text">Premium Quality</div>
          </div>
          <div className="kids-feature">
            <div className="kids-feature-icon">✨</div>
            <div className="kids-feature-text">Expert Craftsmanship</div>
          </div>
          <div className="kids-feature">
            <div className="kids-feature-icon">🎁</div>
            <div className="kids-feature-text">Perfect Gift</div>
          </div>
          <div className="kids-feature">
            <div className="kids-feature-icon">🔍</div>
            <div className="kids-feature-text">Certified Stones</div>
          </div>
        </div>

        <div className="kids-testimonial">
          <div className="kids-testimonial-text">
            "I received the Diamond Solitaire Pendant as an anniversary gift, and I'm absolutely in love with it. The quality is exceptional, and it catches the light beautifully. I've received so many compliments!"
          </div>
          <div className="kids-testimonial-author">- Priya Mehta, Mumbai</div>
        </div>
      </div>
    </>
  );
};

export default PendantsProductPage;