import React, { useState } from 'react';
import './App.css';
import ProductManagementDashboard from './components/pages/ProductManagement';
import OrderManagementDashboard from './components/pages/OrderManagement';
import Sidebar from './components/Sliderbar';
import Header from './components/Header';
import UserManagement from './components/pages/UserManagement';
import Dashboard from './components/pages/Dashboard';
import Contact from './components/pages/Contact';
import Login from './components/pages/login';


function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    // Reset authentication state
    setIsAuthenticated(false);
    setUser(null);
    
    // Optional: You might want to add additional logout logic here
    // For example, clearing tokens, calling a logout API, etc.
    console.log('Logging out user');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagementDashboard />;
      case 'orders':
        return <OrderManagementDashboard/>;
      case 'users':
        return <UserManagement />;
      case 'contact':
        return  <Contact />
      default:
        return <Dashboard />;
    }
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    
    <div className="admin-dashboard">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        user={user}
      />
      <div className="main-content">
        <Header 
          title={getPageTitle(activePage)} 
          user={user}
          onLogout={handleLogout}
        />
        <div className="content-wrapper">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function getPageTitle(page) {
  switch (page) {
    case 'dashboard':
      return 'Dashboard';
    case 'products':
      return 'Product Management';
    case 'orders':
      return 'Order Management';
    case 'users':
      return 'User Management';
    case 'contact':
        return 'Contact' ;
    default:
      return 'Dashboard';
  }
}

export default App;