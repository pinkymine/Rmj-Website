import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/OrderManagement.css';

const API_URL = 'https://backend-ecommerce-1-zdfc.onrender.com/api';
// This should be at the component level, not nested inside other functions
const getImageSrc = (imagePath) => {
  if (!imagePath) return '/api/placeholder/400/400'; // Fallback image
  
  // If it's already a complete URL or base64 string, use it directly
  if (typeof imagePath === 'string' && (imagePath.startsWith('data:image') || imagePath.startsWith('http'))) {
    return imagePath;
  }
  
  // If it's a placeholder path, keep it as is
  if (typeof imagePath === 'string' && imagePath.startsWith('/api/placeholder')) {
    return imagePath;
  }
  
  // Handle case where imagePath might be an object
  if (typeof imagePath === 'object' && imagePath !== null) {
    // Try to extract image data from common properties
    if (imagePath.data) return imagePath.data;
    if (imagePath.url) return imagePath.url;
    if (imagePath.src) return imagePath.src;
    if (imagePath.path) return `/uploads/${imagePath.path}`;
  }
  
  // Otherwise assume it's a filename that needs the uploads prefix
  return `/uploads/${imagePath}`;
};

// New function to handle image download
const downloadImage = (imageSrc, fileName = 'customization-image') => {
  // Make sure we have a valid image source
  if (!imageSrc) return;
  
  // Create an anchor element
  const link = document.createElement('a');
  
  // Set the href to the image source
  link.href = imageSrc;
  
  // Set download attribute with filename
  link.download = fileName;
  
  // Append to the document
  document.body.appendChild(link);
  
  // Trigger click event
  link.click();
  
  // Remove the element
  document.body.removeChild(link);
};

const OrderManagementDashboard = () => {
  // Date filtering function (moved to the top)
  const filterByDate = (orderDate, filter) => {
    if (!filter) return true;
    
    const today = new Date();
    const parseDate = (dateString) => {
      // Handle potential undefined or invalid date strings
      if (!dateString) return null;
      
      try {
        // Try parsing different date formats
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        
        // Fallback to standard date parsing
        return new Date(dateString);
      } catch (error) {
        console.error('Invalid date format:', dateString);
        return null;
      }
    };
    
    const orderDateObj = parseDate(orderDate);
    // If date parsing fails, return false
    if (!orderDateObj) return false;
    switch (filter) {
      case 'today':
        return orderDateObj.toDateString() === today.toDateString();
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return orderDateObj.toDateString() === yesterday.toDateString();
      case 'last7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return orderDateObj >= sevenDaysAgo;
      case 'last30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDateObj >= thirtyDaysAgo;
      default:
        return true;
    }
  };

  // State for orders and loading
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  
  // State for handling the currently selected order for detailed view
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State for handling status updates
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState('update');

  // Define shipping cost constant
  const SHIPPING_COST = 100;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Clear any previous errors
      setError(null);

      // Fetch orders
      const response = await axios.get(`${API_URL}/orders`);
      
      // Process orders to ensure consistent structure and add shipping cost
      const processedOrders = response.data.map(order => {
        // Calculate the subtotal (original total)
        const subtotal = parseFloat(order.total || 0);
        
        // Calculate total including shipping
        const totalWithShipping = subtotal + SHIPPING_COST;
        
        return {
          ...order,
          status: order.status || 'Pending',
          payment: order.payment || { method: 'Unknown', status: 'Unknown' },
          subtotal: subtotal.toFixed(2), // Original total as subtotal
          shippingCost: SHIPPING_COST.toFixed(2), // Add shipping cost
          total: totalWithShipping.toFixed(2) // Update total with shipping included
        };
      });
      
      // Update states
      setOrders(processedOrders);
      
      // Reset filters
      setSearchTerm('');
      setStatusFilter('');
      setDateFilter('');
      
      // Reset to first page
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      // Optionally, set orders to an empty array
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
    
    
  useEffect(() => {
    fetchOrders();
  }, []);

  
  // Order Status Update Hook/Function
  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Successful update
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: response.data.order.status } : order
      );
  
      setOrders(updatedOrders);
      
      // Optional: Update selected order if applicable
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: response.data.order.status
        });
      }
  
      // User-friendly success message
      alert(`Order #${orderId} status successfully updated to ${response.data.order.status}`);
  
    } catch (err) {
      // Detailed error handling
      console.error('Status Update Error:', err);
      
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           'Failed to update order status';
      
      alert(errorMessage);
      
      // Optionally log more details or perform error-specific actions
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Error Details:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request
        alert('An unexpected error occurred');
      }
    }
  };

    // Handle delete order function - moved to parent component
    const handleDeleteOrder = async (orderId) => {
      if (!orderId) return;
      
      // Confirm before deletion
      if (!window.confirm('Are you sure you want to delete this order?')) {
        return;
      }
      
      try {
        // Use axios instead of fetch for consistency
        const response = await axios.delete(`${API_URL}/orders/${orderId}`);
        
        // Update orders state to remove the deleted order
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        // If the deleted order is currently selected, go back to the list
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
        
        // Show success message
        alert('Order deleted successfully');
      } catch (err) {
        console.error('Error deleting order:', err);
        alert(err.response?.data?.message || 'Failed to delete order');
      }
    };
    
  // Function to handle payment status update
  const handlePaymentStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/payment`, { status });
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, payment: { ...order.payment, status } } 
          : order
      );
      
      setOrders(updatedOrders);
      
      if (selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          payment: {
            ...selectedOrder.payment,
            status
          }
        });
      }
      
      alert(`Payment status for Order #${orderId} updated to ${status}`);
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status. Please try again.');
    }
  };

  // Filter orders based on search, status, and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || 
      (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());
    
    const matchesDate = filterByDate(order.date, dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render methods for status and currency
  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded',
      'successful': 'status-delivered',
      'failed': 'status-cancelled'
    };
    return `status-badge ${statusMap[status?.toLowerCase()] || ''}`;
  };

  const formatCurrency = (amount) => {
    return `₹ ${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Render loading or error states
  if (loading) {
    return <div className="container fade-in"><p>Loading orders...</p></div>;
  }

  if (error) {
    return <div className="container fade-in"><p className="error">{error}</p></div>;
  }
  const formatAddress = (order) => {
    // Try multiple ways to extract address
    const customerDetails = order.rawData?.customerDetails;
    
    if (customerDetails?.address) {
      // If address is an object with structured fields
      const { address, city, state, zipCode, country } = customerDetails.address;
      
      // Filter out empty parts and join
      const addressParts = [
        address,
        city,
        state,
        zipCode,
        country
      ].filter(part => part && part.trim() !== '');
      
      return addressParts.join(', ');
    }
  };

  
  // Render selected order details or order list
  return (
    <div className="container fade-in">
      {selectedOrder ? (
      <OrderDetails 
      order={selectedOrder}
      onBack={() => setSelectedOrder(null)}
      onStatusUpdate={handleStatusUpdate}
      onPaymentStatusUpdate={handlePaymentStatusUpdate}
      onDeleteOrder={handleDeleteOrder}
      getStatusClass={getStatusClass}
      formatCurrency={formatCurrency}
      formatAddress={formatAddress} 
      getImageSrc={getImageSrc}
      downloadImage={downloadImage}
      shippingCost={SHIPPING_COST} // Pass shipping cost to OrderDetails
    />
      ) : (
        <OrderList 
          orders={currentOrders}
          filteredOrders={filteredOrders}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          fetchOrders={fetchOrders}
          onSelectOrder={setSelectedOrder}
          onDeleteOrder={handleDeleteOrder}
          getStatusClass={getStatusClass}
          formatCurrency={formatCurrency}
          currentPage={currentPage}
          ordersPerPage={ordersPerPage}
          totalOrders={filteredOrders.length}
          paginate={paginate}
        />
      )}
    </div>
  );
};

// Separate component for Order Details
const OrderDetails = ({ 
  order, 
  onBack, 
  onStatusUpdate, 
  onPaymentStatusUpdate, 
  getStatusClass, 
  onDeleteOrder,
  formatCurrency,
  formatAddress,
  getImageSrc,
  downloadImage,
  shippingCost
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState('update');

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState(null);
  const [customizationType, setCustomizationType] = useState(null);
  
  // Function to open image modal
  const openImageModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setImageModalOpen(true);
  };

  // Enhanced function to open customization modal with type
  const openCustomizationModal = (customizationDetails, type) => {
    setCurrentCustomization(customizationDetails);
    setCustomizationType(type);
    setCustomizationModalOpen(true);
  };

  // This function needs to be updated to access the Customization field correctly
  const getCustomizationButton = (item) => {
    if (!item.Customization && !item.customization) return null;
    
    // Use either Customization or customization based on what's available
    const customizationData = item.Customization || item.customization;
    
    if (!customizationData) return null; // Additional check for empty objects
    
    // Determine customization type based on content or use the type directly if available
    let type = customizationData.type || "text";
    
    // Try to infer type if not explicitly set
    if (!customizationData.type) {
      if (customizationData.text && (customizationData.file || customizationData.image || customizationData.uploadedFile || customizationData.fileData)) {
        type = "combined";
      } else if (customizationData.uploadedFile || customizationData.fileData) {
        type = "fingerprint";
      } 
      else if (customizationData.uploadedFile || customizationData.fileData) {
        type = "image";
      } 
      else {
        type = "text";
      }
    }

    
    let buttonText = "View Customization";
    let buttonClass = "button-standard";
    
    if (type === "combined") {
      buttonText = "View Combined";
      buttonClass = "button-combined";
    } else if (type === "fingerprint") {
      buttonText = "View Fingerprint";
      buttonClass = "button-fingerprint";
    }else if (type === "image") {
      buttonText = "View image";
      buttonClass = "button-image";
    }
     else if (type === "text") {
      buttonText = "View Engraving";
      buttonClass = "button-engraving";
    }
    
    return (
      <button 
        className={`button button-small ${buttonClass}`}
        onClick={() => openCustomizationModal(customizationData, type)}
      >
        {buttonText}
      </button>
    );
  };
  
  // Added handleStatusUpdateClick function
  const handleStatusUpdateClick = () => {
    if (!newStatus || newStatus.trim() === '') {
      alert('Please select a status before updating');
      return;
    }
    onStatusUpdate(order.id, newStatus);
  };

  // Helper function to generate a proper filename for download
  const generateFileName = (type, orderId) => {
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const orderPrefix = orderId ? `order-${orderId}` : 'order';
    
    switch (type) {
      case 'fingerprint':
        return `${orderPrefix}-fingerprint-${dateStr}.png`;
      case 'image':
        return `${orderPrefix}-image-${dateStr}.png`;
      case 'combined':
        return `${orderPrefix}-customization-${dateStr}.png`;
      default:
        return `${orderPrefix}-customization-${dateStr}.png`;
    }
  };

  const renderCustomizationContent = () => {
    if (!currentCustomization) return <p>No customization details available</p>;
    
    switch (customizationType) {
      case "fingerprint":
        // Direct access to the actual base64 data which is in the fileData field
        // based on your sample data structure
        let fingerprintImage = null;
        
        // First try the fileData which contains the actual base64 string in your example
        if (currentCustomization.fileData && currentCustomization.fileData.startsWith('data:')) {
          fingerprintImage = currentCustomization.fileData;
        } 
        // If no direct base64, try the uploadedFile (which might be a filename)
        else if (currentCustomization.uploadedFile) {
          fingerprintImage = currentCustomization.uploadedFile;
        }
        // Try other possible fields
        else if (currentCustomization.image) {
          fingerprintImage = currentCustomization.image;
        }
        else if (currentCustomization.file) {
          fingerprintImage = currentCustomization.file;
        }
        
        const fingerprintImgSrc = getImageSrc(fingerprintImage);
        
        return (
          <div className="fingerprint-customization">
            <h3>Fingerprint Customization</h3>
            <div className="customization-image-container">
              {fingerprintImgSrc ? (
                <>
                  <img 
                    src={fingerprintImgSrc} 
                    alt="Fingerprint Customization" 
                    className="customization-image"
                    onClick={() => {
                      // Add click to enlarge functionality
                      setCurrentImage(fingerprintImgSrc);
                      setImageModalOpen(true);
                    }}
                  />
                  <div className="download-button-container">
                    <button 
                      className="button button-download"
                      onClick={() => downloadImage(
                        fingerprintImgSrc, 
                        generateFileName('fingerprint', order.id)
                      )}
                    >
                      Download Image
                    </button>
                  </div>
                </>
              ) : (
                <p>No fingerprint image available</p>
              )}
            </div>
            {currentCustomization.notes && (
              <div className="customization-notes">
                <p><strong>Notes:</strong> {currentCustomization.notes}</p>
              </div>
            )}
          </div>
        );
        
      case "image":
        // Direct access to the actual base64 data which is in the fileData field
        // based on your sample data structure
        let imageImage = null;
        
        // First try the fileData which contains the actual base64 string in your example
        if (currentCustomization.fileData && currentCustomization.fileData.startsWith('data:')) {
          imageImage = currentCustomization.fileData;
        } 
        // If no direct base64, try the uploadedFile (which might be a filename)
        else if (currentCustomization.uploadedFile) {
          imageImage = currentCustomization.uploadedFile;
        }
        // Try other possible fields
        else if (currentCustomization.image) {
          imageImage = currentCustomization.image;
        }
        else if (currentCustomization.file) {
          imageImage = currentCustomization.file;
        }
        
        const imageImgSrc = getImageSrc(imageImage);
        
        return (
          <div className="fingerprint-customization">
            <h3>Image Customization</h3>
            <div className="customization-image-container">
              {imageImgSrc ? (
                <>
                  <img 
                    src={imageImgSrc} 
                    alt="Image Customization" 
                    className="customization-image"
                    onClick={() => {
                      // Add click to enlarge functionality
                      setCurrentImage(imageImgSrc);
                      setImageModalOpen(true);
                    }}
                  />
                  <div className="download-button-container">
                    <button 
                      className="button button-download"
                      onClick={() => downloadImage(
                        imageImgSrc, 
                        generateFileName('image', order.id)
                      )}
                    >
                      Download Image
                    </button>
                  </div>
                </>
              ) : (
                <p>No image available</p>
              )}
            </div>
            {currentCustomization.notes && (
              <div className="customization-notes">
                <p><strong>Notes:</strong> {currentCustomization.notes}</p>
              </div>
            )}
          </div>
        );

      case "combined":
        // Handle combined type with both text and image
        const textContent = currentCustomization.text?.content || 
                            currentCustomization.text || 
                            "No text available";
        
        const fontStyle = currentCustomization.text?.font || 
                          currentCustomization.font || 
                          "Standard";
        
        const combinedImage = currentCustomization.file?.data || 
                             currentCustomization.file?.name || 
                             currentCustomization.image || 
                             currentCustomization.uploadedFile ||
                             currentCustomization.fileData;
        
        const combinedImgSrc = getImageSrc(combinedImage);
        
        return (
          <div className="combined-customization">
            <h3>Combined Customization</h3>
            <div className="customization-text-container">
              <p><strong>Text:</strong> {textContent}</p>
              <p><strong>Font Style:</strong> {fontStyle}</p>
            </div>
            {combinedImage && (
              <div className="customization-image-container">
                <img 
                  src={combinedImgSrc}
                  alt="Customization Image" 
                  className="customization-image"
                  onClick={() => {
                    setCurrentImage(combinedImgSrc);
                    setImageModalOpen(true);
                  }}
                />
                <div className="download-button-container">
                  <button 
                    className="button button-download"
                    onClick={() => downloadImage(
                      combinedImgSrc, 
                      generateFileName('combined', order.id)
                    )}
                  >
                    Download Image
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case "text":
      default:
        // Handle text customization (engraving)
        const engravingText = currentCustomization.text?.content || 
                             currentCustomization.text || 
                             currentCustomization.message || 
                             (typeof currentCustomization === 'string' ? currentCustomization : "");
          
        const engravingFont = currentCustomization.text?.font || 
                             currentCustomization.font || 
                             currentCustomization.style || 
                             "Standard";
          
        return (
          <div className="text-customization">
            <h3>Engraving Customization</h3>
            <p className={`engraved-text font-${currentCustomization.selectedFont?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
              {currentCustomization.customName || engravingText || "No text available"}
            </p>
            <p><strong>Font Style:</strong> {currentCustomization.selectedFont || engravingFont || "Default"}</p>
          </div>
        );
    }
  };

  // Calculate subtotal
  const subtotal = parseFloat(order.subtotal || 0);
  
  // Get or use default shipping cost
  const shipping = parseFloat(order.shippingCost || shippingCost || 0);
  
  // Get total (should already include shipping from the parent component)
  const total = parseFloat(order.total || 0);

  return (
    <div>
      <button className="button" onClick={onBack}>
        Back to All Orders
      </button>
      
      <button className="button" onClick={() => onDeleteOrder(order.id)}>
        Delete Order
      </button>
      
      <div className="details-container">
        <center>
        <h2 className="hover-text" style={{paddingBottom:"30px"}}>{order.id} - Details</h2>
        </center>
        <div  style={{display:"flex",justifyContent:"space-between"}}>
        {/* Customer Information */}
        <div className="customer-info ">
          <h3 className="hover-text">Customer Information</h3>
          <p><strong>Name:</strong> {order.customer || 'N/A'}</p>
          
          {order.rawData?.customerDetails && (
            <>
              <p><strong>Email:</strong> {order.rawData.customerDetails.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {order.rawData.customerDetails.phone || 'N/A'}</p>
            </>
          )}
          
          <p><strong>Date:</strong> {order.date || 'N/A'}</p>
          <p>
            <strong>Status:</strong> 
            <span className={getStatusClass(order.status)}>
              {order.status || 'Pending'}
            </span>
          </p>
        </div>
        
        {/* Order Details */}
        <div className="order-details">
         
          
          {/* Payment Information */}
          <div className="payment-info">
            <h3 className="hover-text">Payment Details</h3>
            {order.payment && (
              <>
                <p><strong>Payment Method:</strong> {order.payment.method || 'N/A'}</p>
                <p>
                  <strong>Payment Status:</strong> 
                  <span className={getStatusClass(order.payment.status)}>
                    {order.payment.status || 'Unknown'}
                  </span>
                </p>
              </>
            )}
            
            {order.rawData?.paymentDetails && (
              <p><strong>Payment ID:</strong> {order.rawData.paymentDetails.paymentId || 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Address Details*/}
        <div className="additional-address-details">
          <h3 className="hover-text">Detailed Address Information</h3>
          {order.rawData?.customerDetails.address && (
            <>
              <p><strong>Full Address:</strong>{order.rawData.customerDetails.address || 'N/A'}</p>
              <p><strong>City:</strong> {order.rawData.customerDetails.city || 'N/A'}</p>
              <p><strong>State:</strong> {order.rawData.customerDetails.state || 'N/A'}</p>
              <p><strong>ZIP Code:</strong> {order.rawData.customerDetails.zipCode || 'N/A'}</p>
              <p><strong>Country:</strong> {order.rawData.customerDetails.country || 'N/A'}</p>
            </>
          )}
        </div>
</div>

        {/* Order Items */}
        <h3 className="hover-text">Items</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Size</th>
              <th>Subtotal</th>
              <th>Image/Customization</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, index) => (
              <tr key={item.id || index}>
                <td>{item.name || item.productName || 'Unknown Item'}</td>
                <td>{item.quantity || 0}</td>
                <td>{(item.price)}</td>
                <td>{(item.size)}</td>
                <td>{(item.total)}</td>
                <td className="customization-column">
                  {(item.customization || item.Customization) && getCustomizationButton(item)}
                </td>
              </tr>
            ))}
         
            <tr className="shipping-row">
              <td colSpan="4" style={{textAlign: 'right'}}><strong>Shipping:</strong></td>
              <td><strong>{formatCurrency(shipping)}</strong></td>
              <td></td>
            </tr>
            <tr className="total-row">
              <td colSpan="4" style={{textAlign: 'right'}}><strong>Total Amount:</strong></td>
              <td><strong>{formatCurrency(total )}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {imageModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span 
                className="close" 
                onClick={() => setImageModalOpen(false)}
              >
                &times;
              </span>
              <h2>Product Image</h2>
              <img 
                src={currentImage} 
                alt="Product Image" 
                className="modal-image"
              />
              <div className="download-button-container">
                <button 
                  className="button button-download"
                  onClick={() => downloadImage(
                    currentImage, 
                    generateFileName('product', order.id)
                  )}
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Customization Modal */}
        {customizationModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span 
                className="close" 
                onClick={() => setCustomizationModalOpen(false)}
              >
                &times;
              </span>
              <h2>Customization Details</h2>
              <div className="customization-container">
                {renderCustomizationContent()}
              </div>
            </div>
          </div>
        )}

        

       
        {/* Status Update Tabs */}
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'update' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('update')}
          >
            Update Order
          </div>
        </div>


        <div className="glass-card">
        {activeTab === 'update' && (
          <>
            <h3 className="hover-text">Update Status</h3>
            <div className="flex-row">
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                className="select"
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
              <button 
                className="button"
                onClick={handleStatusUpdateClick}
                disabled={!newStatus}
              >
                Update Status
              </button>
            </div>

            <h3 className="hover-text">Update Payment Status</h3>
            <div className="flex-row">
              <button 
                className="button"
                onClick={() => onPaymentStatusUpdate(order.id, 'Successful')}
              >
                Mark as Paid
              </button>
              <button 
                className="button button-secondary"
                onClick={() => onPaymentStatusUpdate(order.id, 'Pending')}
              >
                Mark as Pending
              </button>
              <button 
                className="button button-cancel"
                onClick={() => onPaymentStatusUpdate(order.id, 'Failed')}
              >
                Mark as Failed
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

// Separate component for Order List
const OrderList = ({ 
  orders, 
  filteredOrders,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  fetchOrders,
  onSelectOrder,
  onDeleteOrder,
  getStatusClass,
  formatCurrency,
  currentPage,
  ordersPerPage,
  totalOrders,
  paginate
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="header">
        <h1 className="hover-text">Order Management</h1>
        <div>
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-row">
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select 
          className="filter-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">Filter by Date</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
        </select>
        <button className="button" onClick={fetchOrders}>Refresh</button>
      </div>

      {orders.length === 0 ? (
        <div className="no-data">
          <p>No orders found matching your criteria.</p>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id || index}>
                  <td>{order.id || `Unknown-${index}`}</td>
                  <td>{order.customer || 'N/A'}</td>
                  <td>{order.date || 'N/A'}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {order.payment ? (
                      <span className={getStatusClass(order.payment.status)}>
                        {order.payment.status || 'Unknown'}
                      </span>
                    ) : (
                      <span className="status-badge">Unknown</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="button"
                      onClick={() => onSelectOrder(order)}
                    >
                      View Details
                    </button>
                    <button 
                      className="button"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <div>
              Showing {((currentPage - 1) * ordersPerPage) + 1}-
              {Math.min(currentPage * ordersPerPage, totalOrders)} 
              {' '}of {totalOrders} orders
            </div>
            <div className="flex-row">
              <button 
                className="pagination-button" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
              <button 
                className="pagination-button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagementDashboard;