import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  User, 
  ChevronDown, 
  X 
} from "lucide-react";
import styles from "./home-style/Header.module.css";
import { useCart } from "../../pages/CartContext";
// Import image with proper Vite syntax
import logo from '/src/component/home-component/jwellery2.PNG';

const announcements = [
  "Click to shop Fashion Jewelry",
  "limitless possibilities with our custom jewelry",
  "New Collection Launch - Shop Now"
];

export default function Header() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Handle navigation clicks
  const handleNavClick = (e, path) => {
    e.preventDefault();
    closeAll();
    navigate(path);
    // Force a page refresh if needed
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Handle dropdown link clicks with screen refresh
  const handleDropdownLinkClick = (e, path) => {
    e.preventDefault();
    closeAll();
    navigate(path);
    // Force a page refresh
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Toggle main menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // When closing menu, reset any open dropdowns
    if (isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  // Toggle search input visibility
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    // Focus the search input when it becomes visible
    if (!searchVisible) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with the query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Close the search box after submission
      setSearchVisible(false);
      setSearchQuery("");
    }
  };

  // Handle dropdown navigation
  const handleDropdownToggle = (dropdown, e) => {
    if (e) {
      e.stopPropagation(); // Prevent event from bubbling up
    }
    
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  // Go back function - completely isolated from other event handlers
  const handleBackClick = (e) => {
    // Completely isolate this event handler from any propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Force active dropdown to null
    setActiveDropdown(null);
  };

  // Close everything
  const closeAll = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  // Auto-rotate announcements
  useEffect(() => {
    const timer = setInterval(nextAnnouncement, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle clicks outside of menu and search
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If menu is open and click is outside menu and not on menu toggle
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          !event.target.closest(`.${styles.mobileMenu}`)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
      
      // Close search if clicked outside search area
      if (searchVisible && 
          !event.target.closest(`.${styles.searchContainer}`) && 
          !event.target.closest(`.${styles.searchIcon}`)) {
        setSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, searchVisible]);

  // Close search on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && searchVisible) {
        setSearchVisible(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [searchVisible]);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <button
          onClick={() =>
            setCurrentAnnouncement((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))
          }
          className={styles.announcementNav}
        >
          ‹
        </button>
        <div className={styles.announcement} onClick={nextAnnouncement}>
          {announcements[currentAnnouncement]}
        </div>
        <button onClick={nextAnnouncement} className={styles.announcementNav}>
          ›
        </button>
      </div>

      <div className={styles.mainHeader}>
        <div className={styles.searchIcon} onClick={toggleSearch}>
          <Search />
        </div>

        {/* Changed Link to anchor tag with onClick handler */}
        <a href="/" className={styles.logo} onClick={(e) => handleNavClick(e, '/')}>
          <div className={styles.logoWrapper}>
            {/* Replace the text with your image */}
            <img 
              src={logo} 
              alt="RMJ Logo" 
              className={styles.logoImage} 
            />
          </div>
          <p className={styles.logoTagline}>RAJAMANI JEWELLERY </p>
        </a>

        <div className={styles.userActions}>
          {/* Changed Link to anchor tag with onClick handler */}
          <a href="/account" onClick={(e) => handleNavClick(e, '/account')}>
            <User className={styles.icon} />
          </a>
          {/* Changed Link to anchor tag with onClick handler */}
          <a href="/cart" className={styles.cartIcon} onClick={(e) => handleNavClick(e, '/cart')}>
            <ShoppingCart className={styles.icon} />
            <span className={styles.cartCount}>{cartCount}</span>
          </a>
          <div className={styles.mobileMenu} onClick={toggleMenu}>
            {isMenuOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <div className={`${styles.searchContainer} ${searchVisible ? styles.active : ""}`}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search />
          </button>
          <button type="button" className={styles.closeSearch} onClick={toggleSearch}>
            <X />
          </button>
        </form>
      </div>

      <nav className={`${styles.navbar} ${isMenuOpen ? styles.active : ""}`}>
        <div 
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
          ref={menuRef}
        >
          {/* Mobile dropdown header - only shows on mobile */}
          <div className={styles.mobileDropdownHeader}>
            <span>Menu</span>
            <X className={styles.closeIcon} onClick={toggleMenu} />
          </div>
          
          <a href="/" onClick={(e) => handleNavClick(e, '/')}>Home</a>
          
          <div className={styles.dropdownContainer}>
            <div 
              className={styles.dropdownTrigger}
              onClick={(e) => handleDropdownToggle('category', e)}
            >
              Shop by category <ChevronDown className={`${styles.dropdownIcon} ${activeDropdown === 'category' ? styles.rotate : ""}`} />
            </div>
            
            {/* Important: Render dropdown conditionally to ensure clean mounting/unmounting */}
            {activeDropdown === 'category' && (
              <div 
                className={`${styles.dropdownMenu} ${styles.active}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Category dropdown header with back button */}
                <div className={styles.mobileDropdownHeader}>
                  <button 
                    type="button"
                    className={styles.backButton} 
                    onClick={handleBackClick}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f5b5b5',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    ← Back
                  </button>
                  <span>Shop by category</span>
                  <X className={styles.closeIcon} onClick={closeAll} />
                </div>
                
                <a 
                  href="/category/women" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/category/women')}
                >
                  Women's
                </a>
                
                <a 
                  href="/category/men" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/category/men')}
                >
                  Men's
                </a>
                
                <a 
                  href="/category/kids" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/category/kids')}
                >
                  Kid's
                </a>
                
              </div>
            )}
          </div>
          
          <div className={styles.dropdownContainer}>
            <div 
              className={styles.dropdownTrigger}
              onClick={(e) => handleDropdownToggle('custom', e)}
            >
              Customised Jewellery <ChevronDown className={`${styles.dropdownIcon} ${activeDropdown === 'custom' ? styles.rotate : ""}`} />
            </div>
            
            {activeDropdown === 'custom' && (
              <div 
                className={`${styles.dropdownMenu} ${styles.active}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.mobileDropdownHeader}>
                  <button 
                    type="button"
                    className={styles.backButton} 
                    onClick={handleBackClick}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f5b5b5',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    ← Back
                  </button>
                  <span>Customised Jewellery</span>
                  <X className={styles.closeIcon} onClick={closeAll} />
                </div>
                
                <h4 className={styles.dropdownHeader}>Women</h4>
                <a 
                  href="/custom/women/rings" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/women/rings')}
                >
                  Rings
                </a>
                <a 
                  href="/custom/women/bracelets" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/women/bracelets')}
                >
                  Bracelets
                </a>
                <a 
                  href="/custom/women/pendants" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/women/pendants')}
                >
                  Pendants
                </a>
                
                <h4 className={styles.dropdownHeader}>Men</h4>
                <a 
                  href="/custom/men/rings" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/men/rings')}
                >
                  Rings
                </a>
                <a 
                  href="/custom/men/bracelets" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/men/bracelets')}
                >
                  Bracelets
                </a>
                <a 
                  href="/custom/men/pendants" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/men/pendants')}
                >
                  Pendants
                </a>
                
                <h4 className={styles.dropdownHeader}>Kids</h4>
                <a 
                  href="/custom/kids/rings" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/kids/rings')}
                >
                  Rings
                </a>
                <a 
                  href="/custom/kids/bracelets" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/kids/bracelets')}
                >
                  Bracelets
                </a>
                <a 
                  href="/custom/kids/pendants" 
                  className={styles.dropdownLink} 
                  onClick={(e) => handleDropdownLinkClick(e, '/custom/kids/pendants')}
                >
                  Pendants
                </a>
              </div>
            )}
          </div>
          
          <a href="/contact" onClick={(e) => handleNavClick(e, '/contact')}>Contact Us</a>
          <a href="/track-order" onClick={(e) => handleNavClick(e, '/track-order')}>Track Order</a>
        </div>
      </nav>
    </header>
  );
}