import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaShoppingCart, FaUsers, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import axios from 'axios';
import "../Styles/Dashboard.css";

function Dashboard() {
  // State for data from API with default values
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    monthlyRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({
    summary: false,
    orders: false,
    // products: false,
    // categories: false,
    monthlyRevenue: false
  });

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-ecommerce-1-zdfc.onrender.com/api';

  
  // Fetch data function - separated to allow retrying
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiErrors({
        summary: false,
        orders: false,
        // products: false,
        // categories: false,
        monthlyRevenue: false
      });
      
      // Use Promise.allSettled to handle multiple API calls more gracefully
      const [summaryResult, ordersResult] = await Promise.allSettled([
        axios.get(`${API_URL}/dashboard/summary`),
        axios.get(`${API_URL}/dashboard/orders/recent`)
      ]);
      
      // Handle summary data
      if (summaryResult.status === 'fulfilled' && summaryResult.value.data) {
        const data = summaryResult.value.data;
        setSummaryData({
          totalRevenue: data.totalSales || 0,
          monthlyRevenue: data.monthlySales || 0,
          totalOrders: data.totalOrders || 0,
          totalCustomers: data.totalCustomers || 0,
          revenueGrowth: data.revenueGrowth || 0,
          ordersGrowth: data.ordersGrowth || 0,
          customersGrowth: data.customersGrowth || 0
        });
        console.log("Summary data loaded successfully:", data);
      } else {
        console.error('Error fetching summary data:', summaryResult.reason);
        setApiErrors(prev => ({ ...prev, summary: true, monthlyRevenue: true }));
      }
      
      // Handle orders data with direct field mapping
      if (ordersResult.status === 'fulfilled') {
        const ordersData = ordersResult.value.data;
        
        // Debug logging to help diagnose issues
        console.log("Raw orders data received:", ordersData);
        
        if (ordersData && Array.isArray(ordersData)) {
          // Direct field mapping from backend response
          const formattedOrders = ordersData.map(order => ({
            id: order._id || order.id || 'N/A',
            customer: order.customer || 'Unknown Customer',
            date: new Date(order.date || Date.now()).toLocaleDateString(),
            total: order.total || '0.00',
            status: order.status || 'Unknown'
          }));
          
          console.log("Processed orders:", formattedOrders);
          setRecentOrders(formattedOrders);
          
          
        } else {
          console.error('Invalid orders data format:', ordersData);
          setApiErrors(prev => ({ ...prev, orders: true, products: true, categories: true }));
        }
      } else {
        console.error('Error fetching orders data:', ordersResult.reason);
        setApiErrors(prev => ({ ...prev, orders: true, products: true, categories: true }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('General error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check your connection and try again.');
      setLoading(false);
    }
  };
  
  // Fetch data on component mount with debounce to prevent multiple calls
  useEffect(() => {
    // Add a simple debounce mechanism
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, []);

  // Handle retry
  const handleRetry = () => {
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Full error state - only show if ALL APIs failed
  if (error && Object.values(apiErrors).every(value => value === true)) {
    return (
      <div className="error-container">
        <div className="error">
          <FaExclamationTriangle className="error-icon" />
          <p>{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            <FaSync /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Function to format currency based on locale
  const formatCurrency = (amount, useCurrencySymbol = true) => {
    // Check if amount is a string that starts with a currency symbol
    if (typeof amount === 'string' && amount.match(/^[₹$€£¥]/)) {
      return amount; // Return as is if it's already formatted
    }
    
    // Get the numeric value
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount || '0');
    
    // Format the amount
    if (useCurrencySymbol) {
      // Use ₹ symbol for Indian Rupees
      return `₹ ${numericAmount.toFixed(2)}`;
    } else {
      return numericAmount.toFixed(2);
    }
  };

  return (
    <div className="page-content">
      <div className="stats-cards">
        <div className={`stat-card primary ${apiErrors.summary ? 'error-card' : ''}`}>
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-title">Total Revenue</div>
          {apiErrors.summary ? (
            <div className="stat-error">Data unavailable</div>
          ) : (
            <>
              <div className="stat-value">{formatCurrency(summaryData.totalRevenue)}</div>
              <div className={`stat-trend ${(summaryData.revenueGrowth || 0) >= 0 ? 'up' : 'down'}`}>
                {(summaryData.revenueGrowth || 0) >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
                {Math.abs(summaryData.revenueGrowth || 0).toFixed(1)}% since last month
              </div>
            </>
          )}
        </div>
        
        <div className={`stat-card success ${apiErrors.monthlyRevenue ? 'error-card' : ''}`}>
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-title">Monthly Revenue</div>
          {apiErrors.monthlyRevenue ? (
            <div className="stat-error">Data unavailable</div>
          ) : (
            <>
              <div className="stat-value">{formatCurrency(summaryData.monthlyRevenue)}</div>
              <div className="stat-trend info">
                For current month
              </div>
            </>
          )}
        </div>
        
        <div className={`stat-card success ${apiErrors.summary ? 'error-card' : ''}`}>
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-title">Total Orders</div>
          {apiErrors.summary ? (
            <div className="stat-error">Data unavailable</div>
          ) : (
            <>
              <div className="stat-value">{summaryData.totalOrders || 0}</div>
              <div className={`stat-trend ${(summaryData.ordersGrowth || 0) >= 0 ? 'up' : 'down'}`}>
                {(summaryData.ordersGrowth || 0) >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
                {Math.abs(summaryData.ordersGrowth || 0).toFixed(1)}% since last month
              </div>
            </>
          )}
        </div>
        
        <div className={`stat-card warning ${apiErrors.summary ? 'error-card' : ''}`}>
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-title">Total Customers</div>
          {apiErrors.summary ? (
            <div className="stat-error">Data unavailable</div>
          ) : (
            <>
              <div className="stat-value">{summaryData.totalCustomers || 0}</div>
              <div className={`stat-trend ${(summaryData.customersGrowth || 0) >= 0 ? 'up' : 'down'}`}>
                {(summaryData.customersGrowth || 0) >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
                {Math.abs(summaryData.customersGrowth || 0).toFixed(1)}% since last month
              </div>
            </>
          )}
        </div>
      </div>
      
      <div>
        <div className={`card ${apiErrors.orders ? 'error-card' : ''}`}>
          <h2>Top 10 Recent Orders</h2>
          {apiErrors.orders ? (
            <div className="section-error">
              <FaExclamationTriangle className="error-icon" />
              <p>Could not load order data</p>
              <button className="retry-button" onClick={handleRetry}>
                <FaSync /> Retry
              </button>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={`order-${order.id || index}`}>
                          <td>#{typeof order.id === 'string' ? order.id.substring(0, 8) : index}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>
                            <span className={`status-badge status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                              {order.status || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No recent orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;