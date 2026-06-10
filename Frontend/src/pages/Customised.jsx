import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/customized.css";

const CustomizationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productData } = location.state || {};
  const [customizationType, setCustomizationType] = useState('');
  const [customText, setCustomText] = useState('');
  const [fontStyle, setFontStyle] = useState('script');
  const [fingerprint, setFingerprint] = useState(null);
  const [fingerprintPreview, setFingerprintPreview] = useState('/api/placeholder/200/200');
  const [customizationComplete, setCustomizationComplete] = useState(false);
  
  // Set default customization type based on URL parameters if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'fingerprint' || type === 'engraving') {
      setCustomizationType(type);
    }
  }, [location]);

  // Handle fingerprint upload
  const handleFingerprintUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFingerprint(file);
      // Create a preview URL for the uploaded fingerprint
      const reader = new FileReader();
      reader.onload = (e) => {
        setFingerprintPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle customization type selection
  const handleTypeSelection = (type) => {
    setCustomizationType(type);
    // Reset fields when switching types
    setCustomText('');
    setFontStyle('script');
    setFingerprint(null);
    setFingerprintPreview('/api/placeholder/200/200');
    setCustomizationComplete(false);
  };

  // Handle adding customization to cart
  const handleAddToCart = () => {
    // Validate inputs before proceeding
    let isValid = false;
    
    if (customizationType === 'engraving' && customText.trim()) {
      isValid = true;
    } else if (customizationType === 'fingerprint' && fingerprint) {
      isValid = true;
    }
    
    if (isValid) {
      setCustomizationComplete(true);
      // Here you would typically dispatch to your cart state or API
      console.log('Added to cart:', {
        product: productData,
        customizationType,
        customization: customizationType === 'engraving' 
          ? { text: customText, fontStyle } 
          : { fingerprint: fingerprintPreview }
      });
    } else {
      alert('Please complete the customization before adding to cart');
    }
  };

  // Return to product listing
  const handleBackToProducts = () => {
    navigate('/womens-rings');
  };

  // If no product data was passed, show error
  if (!productData) {
    return (
      <div className="customize-error">
        <h2>Product information missing</h2>
        <p>Please select a product from our collection first.</p>
        <button onClick={handleBackToProducts} className="customize-back-btn">
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div className="customize-container">
      <div className="customize-header">
        <h1>Customize Your Ring</h1>
        <button onClick={handleBackToProducts} className="customize-back-btn">
          ← Back to Collection
        </button>
      </div>

      <div className="customize-product-summary">
        <div className="customize-product-image">
          <img src={productData.image} alt={productData.name} />
        </div>
        <div className="customize-product-details">
          <h2>{productData.name}</h2>
          <p className="customize-product-description">{productData.description}</p>
          <p className="customize-product-price">₹ {productData.price}</p>
        </div>
      </div>

      {!customizationComplete ? (
        <>
          <div className="customize-options">
            <h3>Select Customization Type</h3>
            <div className="customize-type-selector">
              <button 
                onClick={() => handleTypeSelection('engraving')}
                className={`customize-type-btn ${customizationType === 'engraving' ? 'active' : ''}`}
              >
                Engraved Ring
              </button>
              <button 
                onClick={() => handleTypeSelection('fingerprint')}
                className={`customize-type-btn ${customizationType === 'fingerprint' ? 'active' : ''}`}
              >
                Fingerprint Ring
              </button>
            </div>
          </div>

          {customizationType === 'engraving' && (
            <div className="customize-engraving">
              <h3>Engraving Customization</h3>
              <div className="customize-form">
                <div className="customize-field">
                  <label>Your Message (up to 20 characters)</label>
                  <input 
                    type="text" 
                    maxLength={20} 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter your special message"
                    className="customize-text-input"
                  />
                </div>
                
                <div className="customize-field">
                  <label>Font Style</label>
                  <div className="customize-font-options">
                    <label className="customize-font-option">
                      <input 
                        type="radio" 
                        name="fontStyle" 
                        value="script" 
                        checked={fontStyle === 'script'}
                        onChange={() => setFontStyle('script')} 
                      />
                      <span className="font-script">Script</span>
                    </label>
                    <label className="customize-font-option">
                      <input 
                        type="radio" 
                        name="fontStyle" 
                        value="block" 
                        checked={fontStyle === 'block'}
                        onChange={() => setFontStyle('block')} 
                      />
                      <span className="font-block">Block</span>
                    </label>
                    <label className="customize-font-option">
                      <input 
                        type="radio" 
                        name="fontStyle" 
                        value="roman" 
                        checked={fontStyle === 'roman'}
                        onChange={() => setFontStyle('roman')} 
                      />
                      <span className="font-roman">Roman</span>
                    </label>
                  </div>
                </div>
                
                <div className="customize-preview">
                  <h4>Engraving Preview</h4>
                  <div className={`customize-text-preview font-${fontStyle}`}>
                    {customText || 'Your message here'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {customizationType === 'fingerprint' && (
            <div className="customize-fingerprint">
              <h3>Fingerprint Customization</h3>
              <div className="customize-form">
                <div className="customize-field">
                  <label>Upload Your Fingerprint Image</label>
                  <p className="customize-hint">For best results, use a clear black and white image of your fingerprint</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFingerprintUpload}
                    className="customize-file-input"
                  />
                </div>
                
                <div className="customize-preview">
                  <h4>Fingerprint Preview</h4>
                  <div className="customize-fingerprint-preview">
                    <img src={fingerprintPreview} alt="Fingerprint preview" />
                  </div>
                  <p className="customize-preview-note">
                    Our artisans will carefully engrave your fingerprint onto the ring
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="customize-actions">
            <button 
              onClick={handleAddToCart}
              className="customize-add-btn"
              disabled={!customizationType}
            >
              Add Customized Ring to Cart
            </button>
          </div>
        </>
      ) : (
        <div className="customize-confirmation">
          <div className="customize-success">
            <div className="customize-success-icon">✓</div>
            <h3>Customization Complete!</h3>
            <p>Your beautifully customized {productData.name} has been added to your cart.</p>
          </div>
          
          <div className="customize-summary">
            <h4>Customization Summary</h4>
            <div className="customize-summary-details">
              {customizationType === 'engraving' ? (
                <>
                  <p><strong>Type:</strong> Engraved Ring</p>
                  <p><strong>Engraved Text:</strong> {customText}</p>
                  <p><strong>Font Style:</strong> {fontStyle.charAt(0).toUpperCase() + fontStyle.slice(1)}</p>
                </>
              ) : (
                <>
                  <p><strong>Type:</strong> Fingerprint Ring</p>
                  <p><strong>Personalization:</strong> Custom Fingerprint</p>
                </>
              )}
            </div>
          </div>
          
          <div className="customize-next-steps">
            <button className="customize-continue-btn" onClick={handleBackToProducts}>
              Continue Shopping
            </button>
            <button className="customize-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      <div className="customize-info-panels">
        <div className="customize-info-panel">
          <h3>About Our Customization</h3>
          <p>Each customized ring is carefully crafted by our master artisans using precise techniques to ensure the highest quality engraving or fingerprint reproduction. Please allow 5-7 additional business days for customized pieces.</p>
        </div>
        
        <div className="customize-info-panel">
          <h3>Care Instructions</h3>
          <p>To preserve the beauty of your customized ring, avoid exposure to harsh chemicals and remove when swimming or bathing. Clean gently with a soft cloth and mild soap solution.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;