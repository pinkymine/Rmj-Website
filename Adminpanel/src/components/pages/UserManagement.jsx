import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/UserManagement.css";

// API base URL - make sure it matches your server port
const API_URL = 'https://backend-ecommerce-1-zdfc.onrender.com/api';

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Function to generate a custom user ID like UID-02GTRE1628
  const generateCustomUserId = (userId, index) => {
    // First check if we already have a stored ID for this user
    const storedIds = JSON.parse(localStorage.getItem('userDisplayIds') || '{}');
    
    // If we already have a display ID for this user, return it
    if (storedIds[userId]) {
      return storedIds[userId];
    }
    
    // Otherwise, generate a new display ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    
    // Format with UID prefix and 02 middle segment
    const newDisplayId = `UID-02${randomString}${index + 1}`;
    
    // Store this new ID
    storedIds[userId] = newDisplayId;
    localStorage.setItem('userDisplayIds', JSON.stringify(storedIds));
    
    return newDisplayId;
  };
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Make the API call to your actual endpoint
      const response = await axios.get(`${API_URL}/users`);
      
      console.log("API Response:", response.data); // Debug log
      
      // Get user data from the response
      let userData = [];
      if (Array.isArray(response.data)) {
        userData = response.data;
      } else if (response.data.users && Array.isArray(response.data.users)) {
        userData = response.data.users;
      } else if (response.data && typeof response.data === 'object') {
        // Handle case where response is an object with user data
        userData = [response.data];
      } else {
        throw new Error('Unexpected API response format');
      }
      
      // Transform the data to match your schema and add custom IDs
      const transformedUsers = userData.map((user, index) => {
        // Debug log each user to see its actual structure
        console.log("Raw user object:", JSON.stringify(user, null, 2));
        
        // Extract the real ID but don't display it
        let realId = '';
        if (user._id && user._id.$oid) {
          realId = user._id.$oid;
        } else if (user._id) {
          realId = user._id;
        } else if (user.id) {
          realId = user.id;
        }
        
        // Extract firstName and lastName directly as in your example
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        
        // Extract email directly as in your example
        const email = user.email || '';
        
        // Format the date exactly as in your example
        let registeredDate = 'Unknown';
        if (user.createdAt && user.createdAt.$date) {
          // Format date in a readable way
          const date = new Date(user.createdAt.$date);
          registeredDate = date.toLocaleDateString();
        } else if (user.createdAt) {
          const date = new Date(user.createdAt);
          registeredDate = date.toLocaleDateString();
        }
        
        // Generate a persistent display ID using the real user ID
        const displayId = generateCustomUserId(realId, index);
        
        return {
          realId,          // Store the actual MongoDB ID but don't display it
          displayId,       // This is what we'll show in the UI
          firstName,
          lastName,
          email,
          registeredDate
        };
      });
      
      console.log("Transformed users:", transformedUsers); // Debug log
      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Make the actual API call to delete the user using the real ID
        await axios.delete(`${API_URL}/users/${userId}`);
        
        // Remove the deleted user's displayId from localStorage
        const storedIds = JSON.parse(localStorage.getItem('userDisplayIds') || '{}');
        if (storedIds[userId]) {
          delete storedIds[userId];
          localStorage.setItem('userDisplayIds', JSON.stringify(storedIds));
        }
        
        // Refresh the user list after deletion
        fetchUsers();
        
        alert('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user. ' + err.message);
        console.error('Error deleting user:', err);
      }
    }
  };
  
  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="user-management">
      <h2>User Dashboard</h2>
      
      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Registered Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.realId || index}>
                  <td>{user.displayId}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.registeredDate}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleViewUser(user)} 
                      className="view-button"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.realId)} 
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>User Profile</h2>
            
            <div className="user-profile">
              <div className="user-avatar">
                {selectedUser.firstName && selectedUser.lastName ? 
                  `${selectedUser.firstName.charAt(0)}${selectedUser.lastName.charAt(0)}` : 'U'}
              </div>
              
              <div className="user-info">
                <h3>Account Information</h3>
                <p><strong>User ID:</strong> {selectedUser.displayId}</p>
                <p><strong>First Name:</strong> {selectedUser.firstName}</p>
                <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Registered:</strong> {selectedUser.registeredDate}</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="close-button" 
                onClick={() => setShowUserDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;