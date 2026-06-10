import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Contact.css';

const ITEMS_PER_PAGE = 10;

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://backend-ecommerce-1-zdfc.onrender.com/api/contactsview');
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch contacts: ${err.message}`);
      setLoading(false);
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentContacts = contacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="contact-container">
      <h1>Contact Messages</h1>

      {loading && <div className="loading">Loading contacts...</div>}

      {error && (
        <div className="error-container">
          <div className="error">{error}</div>
          <button
            className="retry-button"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchContacts();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="contact-grid">
            <div className="contact-header">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Message</div>
              <div>Date</div>
            </div>
            {currentContacts.length > 0 ? (
              currentContacts.map((contact, index) => (
                <div className="contact-row" key={contact._id || index}>
                  <div>{contact.name || 'N/A'}</div>
                  <div>{contact.email || 'N/A'}</div>
                  <div>{contact.phone || 'N/A'}</div>
                  <div className="message-cell">{contact.message || 'N/A'}</div>
                  <div>{contact.createdAt ? formatDate(contact.createdAt) : 'N/A'}</div>
                </div>
              ))
            ) : (
              <div className="no-contacts">No contact messages found</div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Contact;
