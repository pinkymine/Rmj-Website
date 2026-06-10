import React, { useState, useRef, useEffect } from 'react';
import {  UserCircle, LogOut, User, Building2, Copy } from 'lucide-react';
import "./Styles/Header.css";

function Header({ title }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('admin@example.com');
  };

  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <div className="header-actions">
      
        

        <div
          ref={profileRef}
          className="user-profile"
          onClick={handleProfileToggle}
        >
          <UserCircle />
          <span className="username">Admin</span>
        </div>

        {isProfileOpen && (
          <div className="profile-details-card">
            <div className="profile-details-header">
              <UserCircle className="profile-details-icon" />
              <div className="profile-details-info">
                <div className="profile-details-name">Admin</div>
                <div className="profile-details-role">System Administrator</div>
              </div>
            </div>

            <div className="profile-details-content">
              <div className="profile-detail-item">
                <User />
                <div className="profile-detail-text">
                  <span>Name</span>
                  <strong>Rmj</strong>
                </div>
              </div>

              <div className="profile-detail-item">
                <Copy />
                <div className="profile-detail-text">
                  <span>Email</span>
                  <div>
                    <strong>rajamanijewellery35@gmail.com</strong>
                    <button className="copy-btn" onClick={handleCopyEmail}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-detail-item">
                <Building2 />
                <div className="profile-detail-text">
                  <span>Company</span>
                  <strong>Rajamani Jewellery</strong>
                </div>
              </div>

              
              <div className="profile-actions">
                <button className="profile-action-btn logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  <a href="login.jsx">Logout</a>
                
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;