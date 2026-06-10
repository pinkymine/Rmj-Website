import React, { useState, useEffect } from 'react';
import { 
  FaBoxOpen, 
  FaShoppingCart, 
  FaUsers, 
  FaTachometerAlt, 
  FaComment, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import "./Styles/Sliderbar.css";

function Sidebar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size to determine mobile/tablet breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'contact', label: 'Contact', icon: <FaComment /> }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Burger menu toggle button for mobile */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li
                key={item.id}
                className={activePage === item.id ? 'active' : ''}
                onClick={() => {
                  setActivePage(item.id);
                  if (isMobile) {
                    setIsOpen(false);
                  }
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;