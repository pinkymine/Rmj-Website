
import React, { useRef, useEffect, useState } from 'react';
import '../style/cart.css';

// Component to render different types of customization data
const CustomizationPreview = ({ customization }) => {
  // If no customization exists, don't render anything
  if (!customization || !customization.type) {
    return null;
  }

  const { type } = customization;

  switch (type) {
    case 'engraving':
      return (
        <div className="customization-preview engraving-preview">
          <h4>Personalization:</h4>
          <p className={`custom-text ${customization.selectedFont || 'script'}`}>
            {customization.customName}
          </p>
          <p className="customization-detail">
            Font: {customization.selectedFont || 'Default'}
          </p>
        </div>
      );
    
    case 'fingerprint':
    case 'image':
      return (
        <div className="customization-preview image-preview">
          <h4>{type === 'fingerprint' ? 'Fingerprint:' : 'Custom Image:'}</h4>
          {customization.fileData ? (
            <div className="preview-image-container">
              <img 
                src={customization.fileData} 
                alt={`${type} preview`} 
                className="customization-image"
              />
            </div>
          ) : customization.fileId ? (
            <div className="preview-image-container">
              <img 
                src={`https://rmj-backend.onrender.com/api/files/${customization.fileId}`} 
                alt={`${type} preview`} 
                className="customization-image"
              />
            </div>
          ) : (
            <p>Image: {customization.uploadedFile || 'Custom design'}</p>
          )}
        </div>
      );
    
    case 'pdf':
      return (
        <div className="customization-preview pdf-preview">
          <h4>PDF Document:</h4>
          {customization.fileData ? (
            <div className="preview-pdf-container">
              <a 
                href={customization.fileData} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pdf-link"
              >
                View PDF: {customization.uploadedFile || 'Document'}
              </a>
            </div>
          ) : customization.fileId ? (
            <div className="preview-pdf-container">
              <a 
                href={`https://rmj-backend.onrender.com/api/files/${customization.fileId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pdf-link"
              >
                View PDF: {customization.uploadedFile || 'Document'}
              </a>
            </div>
          ) : (
            <p>Document: {customization.uploadedFile || 'PDF file'}</p>
          )}
        </div>
      );
    
    case 'text':
      return (
        <div className="customization-preview text-preview">
          <h4>Custom Text:</h4>
          <div className="text-content">
            {customization.text}
          </div>
          {customization.textOptions && (
            <p className="customization-detail">
              Format: {customization.textOptions.format || 'Standard'}, 
              Style: {customization.textOptions.style || 'Regular'}
            </p>
          )}
        </div>
      );
      case 'combined':
  return (
    <div className="customization-preview combined-preview">
      <h4>Combined Customization:</h4>
      {/* Text Customization Preview */}
      {customization.text && (
        <div className="text-preview">
          <p className={`custom-text ${customization.text.font || 'script'}`}>
            {customization.text.content}
          </p>
          <p className="customization-detail">
            Font: {customization.text.font || 'Default'}
          </p>
        </div>
      )}
      
      {/* File Customization Preview */}
      {customization.file && (
        <div className="file-preview">
          {customization.file.type?.startsWith('image/') ? (
            // Image preview
            customization.file.data ? (
              <div className="preview-image-container">
                <img 
                  src={customization.file.data} 
                  alt="Custom file preview" 
                  className="customization-image"
                />
              </div>
            ) : customization.file.fileId ? (
              <div className="preview-image-container">
                <img 
                  src={`https://rmj-backend.onrender.com/api/files/${customization.file.fileId}`} 
                  alt="Custom file preview" 
                  className="customization-image"
                />
              </div>
            ) : (
              <p>Image: {customization.file.name || 'Custom image'}</p>
            )
          ) : (
            // PDF preview
            <div className="preview-pdf-container">
              {customization.file.data ? (
                <a 
                  href={customization.file.data} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pdf-link"
                >
                  View PDF: {customization.file.name || 'Document'}
                </a>
              ) : customization.file.fileId ? (
                <a 
                  href={`https://rmj-backend.onrender.com/api/files/${customization.file.fileId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pdf-link"
                >
                  View PDF: {customization.file.name || 'Document'}
                </a>
              ) : (
                <p>Document: {customization.file.name || 'PDF file'}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
    default:
      return (
        <div className="customization-preview">
          <p>Custom {type}</p>
        </div>
      );
  }
};

// Function to parse customization data from string or object
const parseCustomization = (customizationData) => {
  if (!customizationData) return null;
  
  // If it's already an object, return it
  if (typeof customizationData === 'object') return customizationData;
  
  // If it's a string, try to parse it as JSON
  if (typeof customizationData === 'string') {
    try {
      return JSON.parse(customizationData);
    } catch (e) {
      // Improved image detection for base64 strings - check for all image formats
      if (
        // Check for base64 image data of any format
        customizationData.startsWith('data:image/') || 
        // Check for common image URLs
        customizationData.startsWith('http://') ||
        customizationData.startsWith('https://') ||
        // Check for file extensions with case insensitivity
        /\.(jpe?g|png|gif|bmp|webp|svg|avif|tiff|ico)$/i.test(customizationData)
      ) {
        // Handle all image types uniformly
        return {
          type: 'image',
          fileData: customizationData
        };
      }
      
      // For base64 images that might not have the proper prefix
      if (customizationData.startsWith('/9j/') || // JPEG signature in base64
          customizationData.startsWith('iVBOR') || // PNG signature in base64
          customizationData.startsWith('R0lGOD') || // GIF signature in base64
          customizationData.startsWith('Qk0') ||    // BMP signature in base64
          customizationData.startsWith('UEs') ||    // WEBP signature in base64
          customizationData.startsWith('PD94')) {   // SVG/XML signature in base64
        
        // Try to detect image type from base64 prefix
        let mimeType = 'image/jpeg'; // Default to JPEG
        if (customizationData.startsWith('iVBOR')) mimeType = 'image/png';
        if (customizationData.startsWith('R0lGOD')) mimeType = 'image/gif';
        if (customizationData.startsWith('Qk0')) mimeType = 'image/bmp';
        if (customizationData.startsWith('UEs')) mimeType = 'image/webp';
        if (customizationData.startsWith('PD94')) mimeType = 'image/svg+xml';
        
        // Properly format base64 data with mime type prefix if missing
        const base64Data = `data:${mimeType};base64,${customizationData}`;
        
        return {
          type: 'image',
          fileData: base64Data
        };
      }
      
      // If it's not valid JSON or an image, return it as a text customization
      return {
        type: 'text',
        text: customizationData
      };
    }
  }
  
  return null;
};

const OrderPreview = ({ orderData, orderSummary, customerDetails, paymentDetails, onClose }) => {
  const printRef = useRef();
  const [orderSaved, setOrderSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Function to save order to the backend
  const saveOrderToBackend = async () => {
    try {
      // Validate orderData before sending
      const validatedOrderData = (orderData || []).map(item => {
        const validatedItem = {
          'productName': item['Product Name'] || 'Unknown Product',
          'price': item['Price'] || '0',
          'quantity': item['Quantity'] || '1',
          'size': item['Size'] || 'Standard',
          // Fix Total field - add proper calculation if missing
          'total': item['Total'] || calculateTotal(item),
          // Fix Variant field
          'Variant': item['Variant'] || 'Standard',
          // Include product image if available
          'Image': item['Image'] || null
        };

        // If customization exists, include it in the validated data
        if (item['Customization']) {
          validatedItem['Customization'] = item['Customization'];
        }

        return validatedItem;
      });

      // Helper function to calculate total if missing
      function calculateTotal(item) {
        if (item['total']) return item['Total'];
        
        // Extract numeric value from Price string (removes ₹ and other non-numeric characters)
        const price = parseFloat(String(item['Price'])) || 0;
        const quantity = parseInt(item['Quantity']) || 1;
        
        return ` ${(price * quantity)}`;
      }

      // Validate orderSummary before sending
      const validatedOrderSummary = (orderSummary || []).map(item => ({
        'label': item['Order Summary'] || 'Other',
        'value': item['Value'] || '0'
      }));

      // Validate customer details including address information
      const validatedCustomerDetails = {
        name: customerDetails?.name || 'Guest',
        email: customerDetails?.email || 'guest@example.com',
        phone: customerDetails?.phone || 'N/A',
        // Include address details
        address: customerDetails?.address || 'N/A',
        city: customerDetails?.city || 'N/A',
        state: customerDetails?.state || 'N/A',
        zipCode: customerDetails?.zipCode || 'N/A',
        country: customerDetails?.country || 'India'
      };

      // Validate payment details
      const validatedPaymentDetails = {
        paymentId: paymentDetails?.paymentId || 'Unknown',
        status: 'Successful',
        method: 'Razorpay'
      };

      console.log("Sending validated data:", {
        orderData: validatedOrderData,
        orderSummary: validatedOrderSummary,
        customerDetails: validatedCustomerDetails,
        paymentDetails: validatedPaymentDetails
      });

      const response = await fetch('https://rmj-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: validatedOrderData,
          orderSummary: validatedOrderSummary,
          customerDetails: validatedCustomerDetails,
          paymentDetails: validatedPaymentDetails
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Order saved successfully:', data);
        setOrderSaved(true);
        setSaveError(null);
        // Optionally store the order ID for reference
        localStorage.setItem('lastOrderId', data.orderId);
      } else {
        console.error('Failed to save order:', data.message);
        setSaveError(data.message || 'Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setSaveError(error.message || 'Error saving order');
    }
  };

  // Save order when component mounts
  useEffect(() => {
    saveOrderToBackend();
  }, []); // Empty dependency array means this runs once on mount

  // Function to process order items for display
  const processOrderItems = (items) => {
    return (items || []).map(item => {
      const price = item['Price'] || ' 0';
      const quantity = parseInt(item['Quantity']) || 1;
      const size = item['Size'] || 'Standard';
    
      // Calculate total with full precision
      const numericPrice = parseFloat(String(price).replace(/[^\d.-]/g, '')) || 0;
      const total = ` ${(numericPrice * quantity).toFixed(2)}`;
      
      // Ensure variant has a value
      const variant = item['Variant'] || 'Standard';
      
      return {
        ...item,
        'Total': total,
        'Variant': variant,
        'Size': size
      };
    });
  };

  // Format address for display
  const formatAddress = () => {
    const details = customerDetails || {};
    const addressParts = [];
    
    if (details.address) addressParts.push(details.address);
    if (details.city) addressParts.push(details.city);
    if (details.state) addressParts.push(details.state);
    if (details.zipCode) addressParts.push(details.zipCode);
    if (details.country) addressParts.push(details.country);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    
    const style = document.createElement('style');
    style.innerHTML = `
      /* Add these styles to your cart.css file */

      .order-save-status {
        margin: 10px 0;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
        font-weight: 500;
      }

      .order-save-status.success {
        background-color: #e6f7e6;
        color: #2e7d32;
        border: 1px solid #c8e6c9;
      }

      .order-save-status.error {
        background-color: #fdecea;
        color: #d32f2f;
        border: 1px solid #ffcdd2;
      }

      @media print {
        .order-actions, .close-button, .order-save-status {
          display: none !important;
        }
        .order-viewer-content {
          box-shadow: none !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
        }
        body {
          padding: 20px !important;
        }
        .order-viewer-header {
          text-align: center !important;
        }
        .customization-container {
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    document.body.innerHTML = originalContents;
    
    window.location.reload();
  };

  // Process the order items for display
  const processedOrderData = processOrderItems(orderData);

  return (
    <div className="order-viewer-overlay">
      <div className="order-viewer-content" ref={printRef}>
        <div className="order-viewer-header">
          <h2>Order Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {/* Order Save Status */}
        {orderSaved && (
          <div className="order-save-status success">
            Order has been saved successfully
          </div>
        )}
        {saveError && (
          <div className="order-save-status error">
            Error saving order: {saveError}
          </div>
        )}
        
        {/* Customer Information Section */}
        <div className="customer-info-section">
          <h3>Customer Information</h3>
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{customerDetails?.name || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{customerDetails?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{customerDetails?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Shipping/Billing Address Section */}
        <div className="address-info-section">
          <h3>Shipping Address</h3>
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{formatAddress()}</span>
            </div>
            {customerDetails?.address && (
              <div className="full-address">
                <p>{customerDetails.address}</p>
                <p>{customerDetails.city}, {customerDetails.state} {customerDetails.zipCode}</p>
                <p>{customerDetails.country}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Details Section */}
        <div className="payment-info-section">
          <h3>Payment Information</h3>
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Transaction ID:</span>
              <span className="info-value">{paymentDetails?.paymentId || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Status:</span>
              <span className="info-value success">Successful</span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">Razorpay</span>
            </div>
          </div>
        </div>
        
        {/* Order Items Section */}
        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="order-items-table">
            <div className="table-header">
              <div className="header-cell">Product</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Quantity</div>
              <div className="header-cell">Size</div> {/* Add this line */}
              <div className="header-cell">Total</div>
              <div className="header-cell">Variant</div>
            </div>
            {processedOrderData.map((item, index) => (
              <div key={index} className="table-row">
                <div className="table-cell product-cell">
                  {/* Display product image if available */}
                  {item['Image'] && (
                    <div className="product-image-container">
                      <img 
                        src={item['Image']} 
                        alt={item['Product Name'] || 'Product'} 
                        className="product-image"
                      />
                    </div>
                  )}
                  <div className="product-name">{item['Product Name'] || 'N/A'}</div>
                </div>
                <div className="table-cell">{item['Price'] || ' 0'}</div>
                <div className="table-cell">{item['Quantity'] || '0'}</div>
                <div className="table-cell">{item['Size'] || 'Standard'}</div> 
                <div className="table-cell">{item['Total'] || ' 0'}</div>
                <div className="table-cell">{item['Variant'] || 'Standard'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customization Details Section */}
        <div className="customization-details-section">
          <h3>Customization Details</h3>
          {processedOrderData.some(item => item['Customization']) ? (
            <div className="customization-container">
              {processedOrderData.map((item, index) => {
                if (!item['Customization']) return null;
                
                const customizationData = parseCustomization(item['Customization']);
                
                return (
                  <div key={index} className="item-customization-details">
                    <h4>{item['Product Name']} Customization:</h4>
                    {customizationData ? (
                      <CustomizationPreview customization={customizationData} />
                    ) : (
                      <p className="simple-customization">{String(item['Customization'])}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-customization">No customization for this order</p>
          )}
        </div>
        
        {/* Order Summary Section */}
        <div className="order-summary-section">
          <h3>Order Summary</h3>
          <div className="summary-table">
            {(orderSummary || []).map((item, index) => (
              <div key={index} className="summary-row">
                <span className="summary-label">{item['Order Summary'] || 'N/A'}</span>
                <span className="summary-value">{item['Value'] || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-actions">
          <button className="print-button" onClick={handlePrint}>Print Order</button>
          <button className="close-view-button" onClick={onClose}>Continue Shopping</button>
        </div>
      </div>
  
      {/* Additional CSS styles */}
      <style jsx="true">{`
        /* Product image styles */
        .product-cell {
          display: flex;
          align-items: center;
        }
        
        .product-image-container {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 10px;
          border: 1px solid #eee;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-name {
          flex: 1;
        }

        /* Address section styles */
        .address-info-section {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        
        .full-address {
          margin-top: 10px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 4px;
          line-height: 1.5;
        }
        
        .full-address p {
          margin: 5px 0;
        }

        /* Customization preview styles */
        .customization-details-section {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        
        .customization-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .item-customization-details {
          background-color: #f9f9f9;
          border-radius: 6px;
          padding: 12px;
          border-left: 3px solid #3399cc;
        }
        
        .item-customization-details h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #333;
          font-size: 14px;
        }
        
        .no-customization {
          color: #888;
          font-style: italic;
        }
        
        /* Specific customization type styles */
        .customization-preview {
          padding: 8px;
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        
        .engraving-preview .custom-text {
          padding: 10px;
          margin: 8px 0;
          border: 1px dashed #ddd;
          background: #fff;
          border-radius: 4px;
          min-height: 24px;
        }
        
        .engraving-preview .script {
          font-family: 'Brush Script MT', cursive;
        }
        
        .engraving-preview .serif {
          font-family: 'Times New Roman', serif;
        }
        
        .engraving-preview .modern {
          font-family: 'Arial', sans-serif;
        }
        
        .engraving-preview .handwritten {
          font-family: 'Comic Sans MS', cursive;
        }
        
        .preview-image-container {
          max-width: 150px;
          max-height: 150px;
          overflow: hidden;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin: 8px 0;
        }
        
        .customization-image {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
        
        .pdf-preview .pdf-link {
          display: inline-block;
          padding: 8px 12px;
          background-color: #f1f1f1;
          color: #0066cc;
          text-decoration: none;
          border-radius: 4px;
          margin: 8px 0;
          border: 1px solid #ddd;
        }
        
        .pdf-preview .pdf-link:hover {
          background-color: #e6e6e6;
        }
        
        .text-preview .text-content {
          padding: 10px;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 4px;
          margin: 8px 0;
          white-space: pre-wrap;
          min-height: 40px;
        }
        
        .customization-detail {
          font-size: 12px;
          color: #777;
          margin: 5px 0 0 0;
        }
        
        .simple-customization {
          padding: 8px;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 4px;
        }

/* Media Queries for Customer Details Form and Related Elements */

/* Small screens (mobile phones) */
@media screen and (max-width: 480px) {
  .customer-details-form {
    max-width: 90%;
    padding: 15px;
    margin: 10px;
  }
  
  .form-header h2 {
    font-size: 1.2rem;
  }
  
  .form-group label {
    font-size: 0.9rem;
  }
  
  .form-group input {
    padding: 8px;
    font-size: 0.9rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .submit-button, 
  .cancel-button {
    width: 100%;
    padding: 10px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label,
  .info-value {
    width: 100%;
    padding: 8px;
  }
  
  .customization-details {
    padding: 6px 10px;
  }

  .customization-image-preview img {
    max-width: 100%;
    height: auto;
  }
}

/* Medium screens (tablets) */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .customer-details-form {
    max-width: 80%;
    padding: 18px;
  }
  
  .form-header h2 {
    font-size: 1.3rem;
  }
  
  .form-group input {
    padding: 9px;
  }
  
  .info-label {
    width: 35%;
  }
  
  .info-value {
    width: 65%;
  }
  
  .customization-image-preview img {
    max-width: 80%;
  }
}

/* Landscape orientation for mobile devices */
@media screen and (max-height: 480px) and (orientation: landscape) {
  .customer-details-overlay {
    align-items: flex-start;
    overflow-y: auto;
    padding: 10px 0;
  }
  
  .customer-details-form {
    margin: 10px auto;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .form-actions {
    position: sticky;
    bottom: 0;
    background-color: white;
    padding-top: 10px;
    margin-bottom: 0;
  }
}

/* Dark mode considerations if needed */
@media (prefers-color-scheme: dark) {
  .customer-details-form {
    background-color: #222;
    color: #f0f0f0;
  }
  
  .form-group label {
    color: #e0e0e0;
  }
  
  .form-group input {
    background-color: #333;
    color: #f0f0f0;
    border-color: #444;
  }
  
  .cancel-button {
    background-color: #333;
    color: #f0f0f0;
    border-color: #555;
  }
  
  .info-label {
    background-color: #333;
    color: #e0e0e0;
  }
  
  .info-table {
    border-color: #444;
  }
  
  .info-row {
    border-color: #444;
  }
  
  .customization-details {
    background-color: #333;
    border-left-color: #3399cc;
    color: #e0e0e0;
  }
}

/* Print media query for order details */
@media print {
  .customer-details-overlay {
    position: relative;
    background: none;
  }
  
  .customer-details-form {
    box-shadow: none;
    border: none;
    max-width: 100%;
  }
  
  .form-actions,
  .cancel-button {
    display: none;
  }
  
  .info-table {
    border: 1px solid #ddd;
  }
  
  .info-label,
  .info-value {
    padding: 6px;
  }
  
  .customization-details {
    border-left: 2px solid #3399cc;
    padding: 5px 10px;
    page-break-inside: avoid;
  }
}

        
      `}</style>
    </div>
  );
};

export default OrderPreview;