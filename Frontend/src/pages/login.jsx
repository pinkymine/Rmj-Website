import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/login.css';

const API_URL = 'https://rmj-backend.onrender.com/api';

const AuthForms = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    verificationCode: '',
    tempFirstName: '',
    tempLastName: '',
    tempEmail: '',
    tempPassword: '',
    tempPhoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    verificationCode: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      navigate('/welcome');
    }
  }, [navigate]);

  // Regex validation patterns
  const validationPatterns = {
    firstName: /^[A-Za-z]{2,30}$/,
    lastName: /^[A-Za-z]{2,30}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    phoneNumber: /^[0-9]{10}$/,
    verificationCode: /^[0-9]{6}$/,
    newPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  };

  const validationMessages = {
    firstName: 'First name should be 2-30 characters, letters only.',
    lastName: 'Last name should be 2-30 characters, letters only.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters with at least one letter and one number.',
    phoneNumber: 'Please enter a valid 10-digit phone number.',
    verificationCode: 'Please enter the 6-digit verification code sent to your email.',
    newPassword: 'Password must be at least 8 characters with at least one letter and one number.'
  };

  const validateField = (name, value) => {
    if (!validationPatterns[name]) return true;
    return validationPatterns[name].test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when typing
    setFormErrors({
      ...formErrors,
      [name]: ''
    });
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (value && !validateField(name, value)) {
      setFormErrors({
        ...formErrors,
        [name]: validationMessages[name]
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      // Only validate fields that are relevant to the current view
      if (
        (currentView === 'login' && (field === 'email' || field === 'password')) ||
        (currentView === 'create' && formData[field] && field !== 'verificationCode') ||
        (currentView === 'verifyRegister' && field === 'verificationCode') ||
        (currentView === 'reset' && field === 'email') ||
        (currentView === 'verifyReset' && 
          ((field === 'verificationCode' && formData[field]) || 
           (field === 'newPassword' && formData[field])))
      ) {
        if (!validateField(field, formData[field])) {
          newErrors[field] = validationMessages[field];
          isValid = false;
        }
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCurrentView('login');
    setMessage('');
    setFormErrors({});
    // Reset form data, keeping temp data intact
    setFormData(prevData => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      verificationCode: '',
      tempFirstName: prevData.tempFirstName,
      tempLastName: prevData.tempLastName,
      tempEmail: prevData.tempEmail,
      tempPassword: prevData.tempPassword,
      tempPhoneNumber: prevData.tempPhoneNumber
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('firstName', response.data.firstName);
      
      setMessage(`Login successful. Welcome, ${response.data.firstName}!`);
      
      setTimeout(() => {
        navigate('/welcome');
      }, 1000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post(`${API_URL}/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      // Store temporary data for verification
      setFormData(prevData => ({
        ...prevData,
        tempFirstName: formData.firstName,
        tempLastName: formData.lastName,
        tempEmail: formData.email,
        tempPassword: formData.password,
        tempPhoneNumber: formData.phoneNumber,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        verificationCode: ''
      }));
      
      setMessage('Verification code sent to your email!');
      setCurrentView('verifyRegister');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration request failed. Please try again.');
      console.error('Registration request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegistration = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: formData.tempEmail,
        verificationCode: formData.verificationCode,
        firstName: formData.tempFirstName,
        lastName: formData.tempLastName,
        password: formData.tempPassword,
        phoneNumber: formData.tempPhoneNumber
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('firstName', formData.tempFirstName);
      
      setMessage('Account created successfully!');
      
      setTimeout(() => {
        navigate('/welcome');
      }, 1000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed. Please check the code and try again.');
      console.error('Registration verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setCurrentView('reset');
    setMessage('');
    setFormErrors({});
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post(`${API_URL}/reset-password-request`, {
        email: formData.email
      });
      
      setMessage('Verification code sent to your email!');
      setCurrentView('verifyReset');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password reset request failed. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post(`${API_URL}/reset-password-verify`, {
        email: formData.email,
        verificationCode: formData.verificationCode,
        newPassword: formData.newPassword
      });
      
      setMessage('Password has been reset successfully!');
      
      setTimeout(() => {
        setCurrentView('login');
        setFormData({
          ...formData,
          password: '',
          newPassword: '',
          verificationCode: ''
        });
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed. Please check the code and try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setCurrentView('create');
    setMessage('');
    setFormErrors({});
  };

  return (
    <div className="auth-container">
      {/* Message display component */}
      {message && (
        <div className={`message ${message.includes('failed') || message.includes('error') ? 'error' : 'success'}`}>
          <div className="message-content">
            <div className="message-icon">
              {message.includes('failed') || message.includes('error') ? 
                <span className="icon-error">✕</span> : 
                <span className="icon-success">✓</span>
              }
            </div>
            <div className="message-text">{message}</div>
          </div>
        </div>
      )}
      
      {/* Login View */}
      {currentView === 'login' && (
        <div className="form-container">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.email ? 'input-error' : ''}
                required 
              />
              {formErrors.email && <div className="error-text">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <input 
                type="password" 
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.password ? 'input-error' : ''}
                required 
              />
              {formErrors.password && <div className="error-text">{formErrors.password}</div>}
            </div>
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
            </div>
            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <div className="create-account">
              <a href="#" onClick={handleCreateAccount}>Create account</a>
            </div>
          </form>
        </div>
      )}
      
      {/* Create Account View */}
      {currentView === 'create' && (
        <div className="form-container">
          <h1>Create account</h1>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input 
                type="text" 
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.firstName ? 'input-error' : ''}
                required 
              />
              {formErrors.firstName && <div className="error-text">{formErrors.firstName}</div>}
            </div>
            <div className="form-group">
              <input 
                type="text" 
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.lastName ? 'input-error' : ''}
                required 
              />
              {formErrors.lastName && <div className="error-text">{formErrors.lastName}</div>}
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.email ? 'input-error' : ''}
                required 
              />
              {formErrors.email && <div className="error-text">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <input 
                type="tel" 
                name="phoneNumber"
                placeholder="Phone number (10 digits)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.phoneNumber ? 'input-error' : ''}
                required 
              />
              {formErrors.phoneNumber && <div className="error-text">{formErrors.phoneNumber}</div>}
            </div>
            <div className="form-group">
              <input 
                type="password" 
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.password ? 'input-error' : ''}
                required 
              />
              {formErrors.password && <div className="error-text">{formErrors.password}</div>}
            </div>
            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending verification code...' : 'Send verification code'}
              </button>
            </div>
            <div className="email-verification-message">
              We will send a verification code to your email to complete account creation.
            </div>
            <div className="cancel">
              <a href="#" onClick={handleCancel}>Cancel</a>
            </div>
          </form>
        </div>
      )}
      
      {/* Verify Registration View */}
      {currentView === 'verifyRegister' && (
        <div className="form-container">
          <h1>Verify your email</h1>
          <p className="reset-description">Enter the verification code sent to {formData.tempEmail}</p>
          <form onSubmit={handleVerifyRegistration}>
            <div className="form-group">
              <input 
                type="text" 
                name="verificationCode"
                placeholder="6-digit verification code"
                value={formData.verificationCode}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.verificationCode ? 'input-error' : ''}
                required 
              />
              {formErrors.verificationCode && <div className="error-text">{formErrors.verificationCode}</div>}
            </div>
            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Create Account'}
              </button>
            </div>
            <div className="cancel">
              <a href="#" onClick={handleCancel}>Cancel</a>
            </div>
          </form>
        </div>
      )}
      
      {/* Reset Password Request View */}
      {currentView === 'reset' && (
        <div className="form-container">
          <h1>Reset your password</h1>
          <p className="reset-description">We will send a verification code to your email</p>
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.email ? 'input-error' : ''}
                required 
              />
              {formErrors.email && <div className="error-text">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending code...' : 'Send verification code'}
              </button>
            </div>
            <div className="cancel">
              <a href="#" onClick={handleCancel}>Cancel</a>
            </div>
          </form>
        </div>
      )}
      
      {/* Verify Reset Password View */}
      {currentView === 'verifyReset' && (
        <div className="form-container">
          <h1>Verify code & set new password</h1>
          <p className="reset-description">Enter the verification code sent to {formData.email}</p>
          <form onSubmit={handleVerifyAndReset}>
            <div className="form-group">
              <input 
                type="text" 
                name="verificationCode"
                placeholder="6-digit verification code"
                value={formData.verificationCode}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.verificationCode ? 'input-error' : ''}
                required 
              />
              {formErrors.verificationCode && <div className="error-text">{formErrors.verificationCode}</div>}
            </div>
            <div className="form-group">
              <input 
                type="password" 
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={formErrors.newPassword ? 'input-error' : ''}
                required 
              />
              {formErrors.newPassword && <div className="error-text">{formErrors.newPassword}</div>}
            </div>
            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Reset Password'}
              </button>
            </div>
            <div className="cancel">
              <a href="#" onClick={handleCancel}>Cancel</a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthForms;