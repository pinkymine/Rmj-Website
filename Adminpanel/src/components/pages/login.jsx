// src/components/Login.jsx
import React, { useState } from 'react';
import '../Styles/login.css';
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded users for demonstration (in a real app, this would come from a backend)
  const users = [
    { username: 'rmj', password: 'rmj123', role: 'admin' },
    { username: 'manager', password: 'manager123', role: 'manager' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication check
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Clear any previous errors
      setError('');
      
      // Call the onLogin prop with the authenticated user
      onLogin({
        username: user.username,
        role: user.role
      });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
