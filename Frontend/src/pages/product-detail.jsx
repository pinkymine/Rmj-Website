import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import "../style/product-detail.css"

import ring from "./custom-image/ring-custom.jpeg"
import bracelet from "./custom-image/bracelet-custom.jpg"
import pendent from "./custom-image/pendant-custom.jpeg"

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [Size, setSize] = useState('');
  const [isSizeRequired, setIsSizeRequired] = useState(false);
  
  // Customization states
  const [customName, setCustomName] = useState('');
  const [selectedFont, setSelectedFont] = useState('script');
  const [fontSize, setFontSize] = useState(40); // Default font size
  const [showCustomizationOptions, setShowCustomizationOptions] = useState(false);
  const [customizationType, setCustomizationType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Combined customization states
  const [combinedCustomName, setCombinedCustomName] = useState('');
  const [combinedSelectedFont, setCombinedSelectedFont] = useState('script');
  const [combinedFontSize, setCombinedFontSize] = useState(40); // Default font size for combined
  const [combinedUploadedFile, setCombinedUploadedFile] = useState(null);
  const [combinedFileDataUrl, setCombinedFileDataUrl] = useState(null);
  const [combinedIsDragging, setCombinedIsDragging] = useState(false);
  
  // New state to handle multiple images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // New state for image dimensions
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
    aspectRatio: 1
  });
  
  // Get product data from location state or fetch it based on ID
  const product = location.state?.productData || {
    id: id || '1',
    name: 'Hug Kada _Unisex',
    price: '1,767.00',
    originalPrice: '2,120.00',
    images: [
      '/images/hug-cada-unisex.jpg',
      '/images/hug-cada-unisex-2.jpg',
      '/images/hug-cada-unisex-3.jpg',
      '/images/hug-cada-unisex-4.jpg'
    ],
    category: 'ring', // Default category is ring, could be 'pendant' or 'bracelet'
    rating: 0,
    reviews: 0,
    customizationType: '',
    customizationTypes: [
      { id: 'engraving', name: 'Engraving' },
      { id: 'fingerprint', name: 'Fingerprint' },
      { id: 'image', name: 'Custom Image' },
      { id: 'combined', name: 'Text & Image/PDF' }
    ]
  };

  // Customization preview images for different product categories
  const customizationPreviewImages = {
    ring: ring,
    pendant: pendent,
    bracelet: bracelet
  };

  // Get the appropriate preview image based on product category
  const getCustomizationPreviewImage = () => {
    return customizationPreviewImages[product.category] || customizationPreviewImages.ring;
  };

  // Define display images based on customization type
  const getDisplayImages = () => {
    // For engraving and combined customization types, add the preview image at the beginning
    if ((customizationType === 'engraving' || customizationType === 'combined') && 
        product.images && product.images.length > 0) {
      return [getCustomizationPreviewImage(), ...product.images];
    }
    
    // For other customization types or no customization, return original images
    return product.images || [product.image];
  };

  // Update image list when customization type changes
  useEffect(() => {
    // Reset to the first image when changing customization type
    setCurrentImageIndex(0);
  }, [customizationType]);

  // Define static positioning and sizes based on product category
  const getTextStyleByCategory = (category) => {
    // Add a null check before calling toLowerCase()
    const categoryLower = category?.toLowerCase() || 'ring'; // Default to 'ring' if undefined
    
    // Get the font size based on which customization type is active
    const activeFontSize = customizationType === 'combined' ? combinedFontSize : fontSize;
    
    switch(categoryLower) {
      case 'pendant':
        return {
          top: '66%',
          left: '60%',
          fontSize: `${activeFontSize}px`, // Use the active font size
          transform: 'rotate(15deg)' // change the degree as needed
        };
      case 'bracelet':
        return {
          top: '69%',
          left: '50%',
          fontSize: `${activeFontSize}px` // Use the active font size
        };
      case 'ring':
      default:
        return {
          top: '58%',
          left: '50%',
          fontSize: `${activeFontSize}px` // Use the active font size
        };
    }
  };

  // Get the text overlay style based on product category
  const [textOverlayStyle, setTextOverlayStyle] = useState(getTextStyleByCategory(product?.category || 'ring'));

  // Update text overlay style when category changes or font size changes
  useEffect(() => {
    setTextOverlayStyle(getTextStyleByCategory(product?.category || 'ring'));
  }, [product?.category, fontSize, combinedFontSize, customizationType]);

  // Sample font options
  const fontOptions = [
    { id: 'script', name: 'Script', sample: 'Abcdefg' },
    { id: 'serif', name: 'Elegant Serif', sample: 'Abcdefg' },
    { id: 'modern', name: 'Modern Sans', sample: 'Abcdefg' },
    { id: 'handwritten', name: 'Handwritten', sample: 'Abcdefg' }
  ];

  // Check if product has customization options when component mounts
  useEffect(() => {
    if (product && product.customizationType) {
      setCustomizationType(product.customizationType);
      setShowCustomizationOptions(true);
    }
  }, [product]);

  // Get category-specific text preview message
  const getCategorySpecificPreviewMessage = () => {
    switch(product.category?.toLowerCase()) {
      case 'pendant':
        return "Text will appear slightly angled on the pendant";
      case 'bracelet':
        return "Text will be centered on the bracelet band";
      case 'ring':
      default:
        return "Text will be centered on the ring band";
    }
  };

  // Get category-specific customization instructions
  const getCategorySpecificInstructions = () => {
    switch(product.category?.toLowerCase()) {
      case 'pendant':
        return "For pendants, shorter text works best (5-10 characters)";
      case 'bracelet':
        return "For bracelets, you can use longer text (up to 15 characters)";
      case 'ring':
      default:
        return "For rings, keep text short (3-8 characters) for best results";
    }
  };

  // Load and set image dimensions when main image changes
  useEffect(() => {
    const displayImages = getDisplayImages();
    if (displayImages && displayImages.length > 0 && currentImageIndex < displayImages.length) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
      };
      img.src = displayImages[currentImageIndex];
    }
  }, [customizationType, currentImageIndex, product.category]);

  // Convert file to data URL when file is uploaded for different customization types
  useEffect(() => {
    if (customizationType === 'combined') {
      if (combinedUploadedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCombinedFileDataUrl(reader.result);
        };
        reader.readAsDataURL(combinedUploadedFile);
      } else {
        setCombinedFileDataUrl(null);
      }
    } else {
      if (uploadedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileDataUrl(reader.result);
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        setFileDataUrl(null);
      }
    }
  }, [uploadedFile, combinedUploadedFile, customizationType]);

  // Review submission handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log({
      rating,
      reviewTitle,
      reviewContent,
      productId: id
    });
    
    setReviewSubmitted(true);
    setRating(0);
    setReviewTitle('');
    setReviewContent('');
  };

  // File handling functions
  const handleFileDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type based on customization type
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const pdfTypes = ['application/pdf'];
    
    if (customizationType === 'image' && imageTypes.includes(file.type)) {
      setUploadedFile(file);
    } else if (customizationType === 'fingerprint' && imageTypes.includes(file.type)) {
      setUploadedFile(file);
    } else if (customizationType === 'combined' && 
               [...imageTypes, ...pdfTypes].includes(file.type)) {
      setCombinedUploadedFile(file);
    } else {
      alert('Please upload a valid file type for this customization');
    }
  };

  // Combined customization file handling
  const handleCombinedFileDragOver = (e) => {
    e.preventDefault();
    setCombinedIsDragging(true);
  };

  const handleCombinedFileDragLeave = () => {
    setCombinedIsDragging(false);
  };

  const handleCombinedFileDrop = (e) => {
    e.preventDefault();
    setCombinedIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleCombinedFileSelection(file);
    }
  };

  const handleCombinedFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleCombinedFileSelection(file);
    }
  };

  const handleCombinedFileSelection = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.type)) {
      setCombinedUploadedFile(file);
    } else {
      alert('Please upload an image (JPEG, PNG, GIF)');
    }
  };

  // Function to get CSS class for font style preview
  const getStylePreviewClass = (fontId) => {
    switch(fontId) {
      case 'script': return 'font-script';
      case 'serif': return 'font-serif';
      case 'modern': return 'font-modern';
      case 'handwritten': return 'font-handwritten';
      default: return '';
    }
  };

  // Get maximum text length based on product category
  const getMaxTextLength = () => {
    switch(product.category?.toLowerCase()) {
      case 'pendant':
        return 10;
      case 'bracelet':
        return 15;
      case 'ring':
      default:
        return 8;
    }
  };

  // Render customization options
  const renderCustomizationOptions = () => {
    if (!showCustomizationOptions) return null;
    
    if (customizationType === "engraving") {
      const previewText = customName || "Your Text Here";
      const maxLength = getMaxTextLength();
      const categorySpecificMessage = getCategorySpecificPreviewMessage();
      const categorySpecificInstructions = getCategorySpecificInstructions();
      
      return (
        <div className="customization-options">
          <h3>Personalize Your {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Item'}</h3>
          <p className="category-specific-instructions">{categorySpecificInstructions}</p>
          
          <div className="text-customization">
            <div className="form-group">
              <label htmlFor="custom-name">Enter Name or Message:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="custom-name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={`Enter text (max ${maxLength} characters)`}
                  maxLength={maxLength}
                  className="custom-text-input"
                />
                <small className="char-count">{customName.length}/{maxLength} characters</small>
              </div>
            </div>
            
            <div className="form-group font-selection">
              <label>Select Font Style:</label>
              <div className="font-options">
                {fontOptions.map(font => (
                  <div 
                    key={font.id}
                    className={`font-option ${selectedFont === font.id ? 'selected' : ''}`}
                    onClick={() => setSelectedFont(font.id)}
                  >
                    <span className={`font-sample ${font.id}`}>{font.sample}</span>
                    <span className="font-name">{font.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* New Font Size Slider */}
            <div className="form-group font-size-control">
              <label htmlFor="font-size-slider">Font Size: {fontSize}px</label>
              <input
                type="range"
                id="font-size-slider"
                min="20"
                max="60"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="font-size-slider"
              />
              <div className="font-size-labels">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>
            
            <div className="text-preview-section">
              <h4>Preview:</h4>
              <div className="text-preview-container">
                <div className="preview-ring">
                  <span 
                    className={`text-preview ${getStylePreviewClass(selectedFont)}`}
                    style={textOverlayStyle}
                  >
                    {previewText}
                  </span>
                </div>
                <p className="preview-note">
                  {categorySpecificMessage}
                  <br />
                  <small>Position and size are optimized for {product.category || 'item'} type</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (customizationType === "fingerprint" || customizationType === "image") {
      const title = customizationType === "fingerprint" 
        ? "Upload Your Fingerprint" 
        : "Upload Your Custom Image";
      const placeholder = customizationType === "fingerprint" 
        ? "Drag & drop your fingerprint image here or click to select" 
        : "Drag & drop your custom image here or click to select";
      
      return (
        <div className="customization-options">
          <h3>{title}</h3>
          
          <div 
            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📤</div>
              <p>{placeholder}</p>
              <span className="upload-note">Accepts JPG, PNG files (max 5MB)</span>
            </label>
          </div>
          
          {uploadedFile && (
            <div className="fingerprint-preview">
              <p>Selected File: {uploadedFile.name}</p>
              <div className="file-preview">
                <img 
                  src={fileDataUrl || URL.createObjectURL(uploadedFile)} 
                  alt="Design preview" 
                />
              </div>
              <button 
                className="remove-file"
                onClick={() => {
                  setUploadedFile(null);
                  setFileDataUrl(null);
                }}
              >
                Remove File
              </button>
              <div className="preview-note">
                <p>This is how your {customizationType === "fingerprint" ? "fingerprint" : "custom image"} will appear on the product</p>
              </div>
            </div>
          )}
        </div>
      );
    } else if (customizationType === "combined") {
      const previewText = combinedCustomName || "Your Text Here";
      const maxLength = getMaxTextLength();
      const categorySpecificMessage = getCategorySpecificPreviewMessage();
      const categorySpecificInstructions = getCategorySpecificInstructions();
      
      return (
        <div className="customization-options">
          <h3>Combined Customization for {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Item'}</h3>
          <p className="category-specific-instructions">{categorySpecificInstructions}</p>
          
          <div className="combined-customization">
            {/* Text Customization Section */}
            <div className="text-customization">
              <div className="form-group">
                <label htmlFor="combined-custom-name">Enter Text:</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="combined-custom-name"
                    value={combinedCustomName}
                    onChange={(e) => setCombinedCustomName(e.target.value)}
                    placeholder={`Enter text (max ${maxLength} characters)`}
                    maxLength={maxLength}
                    className="custom-text-input"
                  />
                  <small className="char-count">{combinedCustomName.length}/{maxLength} characters</small>
                </div>
              </div>
              
              <div className="form-group font-selection">
                <label>Select Font Style:</label>
                <div className="font-options">
                  {fontOptions.map(font => (
                    <div 
                      key={font.id}
                      className={`font-option ${combinedSelectedFont === font.id ? 'selected' : ''}`}
                      onClick={() => setCombinedSelectedFont(font.id)}
                    >
                      <span className={`font-sample ${font.id}`}>{font.sample}</span>
                      <span className="font-name">{font.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* New Font Size Slider for Combined Mode */}
              <div className="form-group font-size-control">
                <label htmlFor="combined-font-size-slider">Font Size: {combinedFontSize}px</label>
                <input
                  type="range"
                  id="combined-font-size-slider"
                  min="20"
                  max="60"
                  step="1"
                  value={combinedFontSize}
                  onChange={(e) => setCombinedFontSize(parseInt(e.target.value))}
                  className="font-size-slider"
                />
                <div className="font-size-labels">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
              
              {/* Text Preview */}
              <div className="text-preview-section">
                <h4>Text Preview:</h4>
                <div className="text-preview-container">
                  <div className="preview-ring">
                    <span 
                      className={`text-preview ${getStylePreviewClass(combinedSelectedFont)}`}
                      style={textOverlayStyle}
                    >
                      {previewText}
                    </span>
                  </div>
                  <p className="preview-note">
                    {categorySpecificMessage}
                    <br />
                    <small>Text position and size optimized for {product.category || 'item'} type</small>
                  </p>
                </div>
              </div>
            </div>
            
            {/* File Upload Section */}
            <div className="file-upload-section">
              <h4>Upload Image</h4>
              <div 
                className={`file-upload-area ${combinedIsDragging ? 'dragging' : ''}`}
                onDragOver={handleCombinedFileDragOver}
                onDragLeave={handleCombinedFileDragLeave}
                onDrop={handleCombinedFileDrop}
              >
                <input
                  type="file"
                  id="combined-file-upload"
                  accept="image/jpeg,image/png,image/gif,application"
                  onChange={handleCombinedFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="combined-file-upload" className="upload-label">
                  <div className="upload-icon">📤</div>
                  <p>Drag & drop image here or click to select</p>
                  <span className="upload-note">Accepts JPG, PNG, GIF (max 5MB)</span>
                </label>
              </div>
              
              {combinedUploadedFile && (
                <div className="combined-file-preview">
                  <p>Selected File: {combinedUploadedFile.name}</p>
                  {combinedUploadedFile.type.startsWith('image/') ? (
                    <div className="file-preview">
                      <img 
                        src={combinedFileDataUrl || URL.createObjectURL(combinedUploadedFile)} 
                        alt="Design preview" 
                      />
                    </div>
                  ) : (
                    <div className="pdf-preview">
                      <p>📄 PDF File Uploaded</p>
                    </div>
                  )}
                  <button 
                    className="remove-file"
                    onClick={() => {
                      setCombinedUploadedFile(null);
                      setCombinedFileDataUrl(null);
                    }}
                  >
                    Remove File
                  </button>
                  <div className="preview-note">
                    <p>This is how your text and file will appear on the product</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Handle Add to Cart functionality
  const handleAddToCart = () => {
    const displayImages = getDisplayImages();
    const currentImage = displayImages ? displayImages[currentImageIndex] : product.image;
    
    const productWithCustomization = {
      ...product,
      image: currentImage,
      customization: {
        type: customizationType,
        ...(customizationType === 'engraving' && { 
          customName,
          selectedFont,
          fontSize, // Add font size to customization data
          textOverlayStyle
        }),
        ...(customizationType === 'fingerprint' && {
          uploadedFile: uploadedFile ? uploadedFile.name : null,
          fileData: fileDataUrl
        }),
        ...(customizationType === 'image' && {
          uploadedFile: uploadedFile ? uploadedFile.name : null,
          fileData: fileDataUrl
        }),
        ...(customizationType === 'combined' && {
          text: {
            content: combinedCustomName,
            font: combinedSelectedFont,
            fontSize: combinedFontSize, // Add font size to combined text data
            style: textOverlayStyle
          },
          file: {
            name: combinedUploadedFile ? combinedUploadedFile.name : null,
            type: combinedUploadedFile ? combinedUploadedFile.type : null,
            data: combinedFileDataUrl
          }
        }),
        ...(isSizeRequired && Size && { Size })
      }
    };
    
    addToCart(productWithCustomization, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Handle Buy Now functionality
  const handleBuyNow = () => {
    const displayImages = getDisplayImages();
    const currentImage = displayImages ? displayImages[currentImageIndex] : product.image;
    
    const productWithCustomization = {
      ...product,
      image: currentImage,
      customization: {
        type: customizationType,
        ...(customizationType === 'engraving' && { 
          customName,
          selectedFont,
          fontSize, // Add font size to customization data
          textOverlayStyle
        }),
        ...(customizationType === 'fingerprint' && {
          uploadedFile: uploadedFile ? uploadedFile.name : null,
          fileData: fileDataUrl
        }),
        ...(customizationType === 'image' && {
          uploadedFile: uploadedFile ? uploadedFile.name : null,
          fileData: fileDataUrl
        }),
        ...(customizationType === 'combined' && {
          text: {
            content: combinedCustomName,
            font: combinedSelectedFont,
            fontSize: combinedFontSize, // Add font size to combined text data
            style: textOverlayStyle
          },
          file: {
            name: combinedUploadedFile ? combinedUploadedFile.name : null,
            type: combinedUploadedFile ? combinedUploadedFile.type : null,
            data: combinedFileDataUrl
          }
        }),
        ...(isSizeRequired && Size && { Size })
      }
    };
    
    addToCart(productWithCustomization, quantity);
    navigate('/cart');
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Get the display images based on customization type
  const displayImages = getDisplayImages();
  
  // Get the main image to display
  const mainImage = displayImages[currentImageIndex];
  
  // Calculate image container style based on aspect ratio
  const getImageContainerStyle = () => {
    // Default aspect ratio for a container if there's no image yet
    const defaultAspectRatio = 1; // 1:1 square
    
    // Use the loaded aspect ratio or the default
    const aspectRatio = imageDimensions.aspectRatio || defaultAspectRatio;
    
    // Calculate styles based on aspect ratio
    // This maintains image proportions while allowing responsive sizing
    return {
      position: 'relative',
      width: '100%',
      paddingBottom: `${(1 / aspectRatio) * 100}%`, // Set height proportionally 
      overflow: 'hidden'
    };
  };

  // Style for the actual image inside the container
  const mainImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain' // This will make sure the image maintains its aspect ratio
  };

  // Function to determine if we should show text overlay
  const shouldShowTextOverlay = () => {
    // Only show overlay on the first image (customization preview image)
    // and only for engraving or combined customization types
    return (
      (customizationType === "engraving" || customizationType === "combined") &&
      (customName || combinedCustomName) &&
      currentImageIndex === 0 &&
      (customizationType === "engraving" || customizationType === "combined")
    );
  };

  return (
    <div className="product-details-container">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}
      >
        ← Back to Products
      </button>
      
      <div className="product-details">
        <div className="product-image-container">
          {/* Main product image with responsive container */}
          <div className="main-image-wrapper" style={getImageContainerStyle()}>
            <img 
              src={mainImage} 
              alt={product.name} 
              className="main-product-image" 
              style={mainImageStyle}
              onLoad={(e) => {
                // Update image dimensions on load for accuracy
                setImageDimensions({
                  width: e.target.naturalWidth,
                  height: e.target.naturalHeight,
                  aspectRatio: e.target.naturalWidth / e.target.naturalHeight
                });
              }}
            />

            {/* Text Overlay - only shown on first image for engraving/combined */}
            {shouldShowTextOverlay() && (
              <div 
                className={`text-overlay ${getStylePreviewClass(
                  customizationType=== "combined" ? combinedSelectedFont : selectedFont
                )}`}
                style={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  ...textOverlayStyle
                }}
              >
                {customizationType === "combined" ? combinedCustomName : customName}
              </div>
            )}
          </div>
          {/* Product thumbnails with responsive sizing */}
          <div className="product-thumbnails">
            {displayImages.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail-img ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                {/* Adding onLoad handler to thumbnails too for better visual consistency */}
                <img 
                  src={image} 
                  alt={`${product.name} - view ${index + 1}`} 
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
                {index === 0 && (customizationType === 'engraving' || customizationType === 'combined') && (
                  <span className="preview-badge">Preview</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <p className="store-name">Rajamani store</p>
          <h1>{product.name}</h1>
          
          <div className="rating">
            <span className="stars">☆☆☆☆☆</span>
            <span className="review-count">({product.reviews})</span>
          </div>
          
          <div className="pricing">
            <span className="original-price">₹ {product.originalPrice}</span>
            <span className="current-price">₹ {product.price}</span>
            <span className="sale-badge">Sale</span>
          </div>
          
          <p className="taxes-included">Taxes included. <span className="shipping-text">Shipping</span> +100</p>
          
          {/* Customization Type Selection */}
          {product.customizationTypes && (
            <div className="customization-type-selector">
              <label>Select Customization Type:</label>
              <select 
                value={customizationType}
                onChange={(e) => {
                  setCustomizationType(e.target.value);
                  setShowCustomizationOptions(true);
                }}
              >
                <option value="">Choose Customization</option>
                {product.customizationTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Category selector (for demo purposes) */}
          {/* <div className="category-selector">
            <label>Product Category:</label>
            <select 
              value={product.category || 'ring'}
              onChange={(e) => {
                // Update product category
                product.category = e.target.value;
                // Update text overlay style based on the new category
                setTextOverlayStyle(getTextStyleByCategory(e.target.value));
              }}
            >
              <option value="ring">Ring</option>
              <option value="pendant">Pendant</option>
              <option value="bracelet">Bracelet</option>
            </select>
            <small>Text position and size will be optimized for the selected category</small>
          </div> */}
          
          {/* Render customization options */}
          {renderCustomizationOptions()}
          
          {/* Size input (optional) */}
          <div className="size-selector">
            <div className="size-header">
              <label htmlFor="size-input">Size (Optional):</label>
              <div className="size-required-toggle">
                <input
                  type="checkbox"
                  id="size-required"
                  checked={isSizeRequired}
                  onChange={(e) => setIsSizeRequired(e.target.checked)}
                />
                <label htmlFor="size-required">Add size</label>
              </div>
            </div>
            
            {isSizeRequired && (
              <div className="size-input-container">
                <input
                  type="text"
                  id="size-input"
                  value={Size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size (e.g., 7, 8, 9)"
                  className="size-input"
                />
      <div className="size-help">
        <small className="size-note">Please provide your size in mm or standard ring size</small>
        <a 
          href="https://play.google.com/store/apps/details?id=ru.cherrydesign.ringsizer&hl=en_IN&pli=1" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="size-app-link"
        >
          Not sure of your size? Download Ring Sizer App
        </a>
      </div>
    </div>
  )}
</div>
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >-</button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
              >+</button>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? 'Added to cart ✓' : 'Add to cart'}
            </button>
            <button 
              className="buy-now-button"
              onClick={handleBuyNow}
            >
              Buy it now
            </button>
          </div>
          {/* Customer Reviews Section */}
       
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;