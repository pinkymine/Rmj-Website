import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/welcome.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem('firstName') || 'User';
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    
    // Navigate back to login page
    navigate('/account');
  };
  
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>Welcome, {firstName}!</h1>
          <p>You have successfully logged in to your account.</p>
        </div>
        
        <div className="welcome-content">
          <div className="welcome-icon">
            <span className="icon-success">✓</span>
          </div>
          <p className="welcome-message">
            Thank you for signing in. You now have access to all features of our application.
          </p>
        </div>
        
        <div className="welcome-actions">
          <button onClick={() => navigate('/all-procuct')} className="btn-primary">
            Go to purchase
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
