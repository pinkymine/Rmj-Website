import React, { useState } from 'react';
import axios from 'axios';
import '../style/OrderTrackingForm.css';

const OrderTrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState('order');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setOrderDetails(null);

    try {
      const response = await axios.get(`https://rmj-backend.onrender.com/api/track-order/${trackingNumber}`);
      setOrderDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while tracking the order');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailsTabs = () => {
    if (!orderDetails) return null;

    const tabStyle = (tab) => ({
      padding: '12px 20px',
      cursor: 'pointer',
      backgroundColor: activeDetailsTab === tab ? '#ffbdc4' : '#f9f3ff',
      color: activeDetailsTab === tab ? 'white' : '#231942',
      border: '1px solid #ffbdc4',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontWeight: activeDetailsTab === tab ? '600' : '500',
      boxShadow: activeDetailsTab === tab 
        ? '0 4px 6px rgba(255,189,196,0.2)' 
        : 'none',
      transform: activeDetailsTab === tab 
        ? 'translateY(-2px)' 
        : 'translateY(0)'
    });

    const contentStyle = {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
      animation: 'fadeIn 0.5s ease-out',
      border: '1px solid #f0e6ff'
    };

    return (
      <div style={{ marginTop: '30px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px',
          borderBottom: '1px solid #f0e6ff',
          paddingBottom: '15px'
        }}>
          {[
            { key: 'order', label: 'Order Info' },
            { key: 'customer', label: 'Customer Details' },
            { key: 'products', label: 'Products' }
          ].map((tab) => (
            <div 
              key={tab.key}
              style={tabStyle(tab.key)}
              onClick={() => setActiveDetailsTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div style={contentStyle}>
          {activeDetailsTab === 'order' && (
            <div>
              <h2 style={{ 
                color: '#231942', 
                borderBottom: '2px solid #ffbdc4', 
                paddingBottom: '15px',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Order Information
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px',
                color: '#231942'
              }}>
                {[
                  { label: 'Order ID', value: orderDetails.orderId },
                  { label: 'Order Date', value: orderDetails.orderDate },
                  { label: 'Total Amount', value: orderDetails.totalAmount },
                  { 
                    label: 'Payment Status', 
                    value: orderDetails.paymentStatus,
                    valueStyle: { 
                      color: orderDetails.paymentStatus === 'Paid' ? '#4CAF50' : '#FF5722',
                      fontWeight: '600'
                    }
                  },
                  { 
                    label: 'Order Status', 
                    value: orderDetails.status,
                    valueStyle: { 
                      color: orderDetails.status === 'Shipped' ? '#2196F3' : '#FF9800',
                      fontWeight: '600'
                    }
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: '#f9f3ff',
                      padding: '15px',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px' 
                    }}>
                      {item.label}
                    </span>
                    <span style={item.valueStyle || {}}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDetailsTab === 'customer' && (
            <div>
              <h2 style={{ 
                color: '#231942', 
                borderBottom: '2px solid #ffbdc4', 
                paddingBottom: '15px',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Customer Information
              </h2>
              <div 
                style={{ 
                  backgroundColor: '#f9f3ff', 
                  padding: '20px', 
                  borderRadius: '8px',
                  color: '#231942' 
                }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px' 
                }}>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Name
                    </span>
                    <strong>{orderDetails.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Email
                    </span>
                    {orderDetails.customerEmail}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Phone
                    </span>
                    {orderDetails.customerNumber}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Shipping Address
                    </span>
                    {orderDetails.customerAddress}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      City
                    </span>
                    {orderDetails.customerCity}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                     State
                    </span>
                    {orderDetails.customerState}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Pincode
                    </span>
                    {orderDetails. customerPincode}
                  </div>
                  <div>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Country
                    </span>
                    {orderDetails.customerCountry}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDetailsTab === 'products' && (
            <div>
              <h2 style={{ 
                color: '#231942', 
                borderBottom: '2px solid #ffbdc4', 
                paddingBottom: '15px',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Order Products
              </h2>
              {orderDetails.products.map((product, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f3ff',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ flex: 2 }}>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      display: 'block' 
                    }}>
                      Product Name
                    </span>
                    <strong style={{ fontSize: '1rem' }}>{product.name}</strong>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '30px', 
                    flex: 1, 
                    justifyContent: 'flex-end' 
                  }}>
                    <div>
                      <span style={{ 
                        color: '#666', 
                        fontSize: '0.9rem', 
                        marginBottom: '5px',
                        display: 'block' 
                      }}>
                        Quantity
                      </span>
                      <strong>{product.quantity}</strong>
                    </div>
                    <div>
                      <span style={{ 
                        color: '#666', 
                        fontSize: '0.9rem', 
                        marginBottom: '5px',
                        display: 'block' 
                      }}>
                        Price
                      </span>
                      <strong>{product.price}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tracking-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="tracking-title" style={{ 
        marginBottom: '30px', 
        color: '#231942',
        fontSize: '2rem',
        fontWeight: '600'
      }}>
        Track Your Order
      </h1>

      <form 
        onSubmit={handleSubmit} 
        className="tracking-form"
        style={{ marginBottom: '30px' }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Order Number"
            className="input-field"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
            style={{ 
              fontSize: '1rem',
              padding: '15px',
              borderRadius: '8px'
            }}
          />
        </div>

        <button
          type="submit"
          className="track-button"
          disabled={isLoading}
          style={{ 
            marginTop: '15px',
            fontSize: '1rem',
            padding: '15px 30px'
          }}
        >
          {isLoading ? 'TRACKING...' : 'TRACK ORDER'}
        </button>

        {error && (
          <div style={{
            color: '#ff0000',
            textAlign: 'center',
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'rgba(255,0,0,0.05)',
            borderRadius: '8px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {error}
          </div>
        )}
      </form>

      {orderDetails && renderDetailsTabs()}
    </div>
  );
};

export default OrderTrackingForm;