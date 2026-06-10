import React, { useState, useEffect } from 'react';

const FloatingWhatsAppIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [bounce, setBounce] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showRipple, setShowRipple] = useState(false);

  // Pulse animation effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Bounce animation effect
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(true);
      setTimeout(() => {
        setBounce(false);
      }, 500);
    }, 7000);

    return () => clearInterval(bounceInterval);
  }, []);

  // Rotation animation effect
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => prev + 360);
      setTimeout(() => {
        setRotation(prev => prev);
      }, 1000);
    }, 15000);

    return () => clearInterval(rotationInterval);
  }, []);

  // Ripple effect animation
  useEffect(() => {
    const rippleInterval = setInterval(() => {
      setShowRipple(true);
      setTimeout(() => {
        setShowRipple(false);
      }, 1500);
    }, 5000);

    return () => clearInterval(rippleInterval);
  }, []);

  const containerStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 9999,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    transform: bounce 
      ? 'translateY(-15px)' 
      : isAnimating 
        ? 'scale(1.1)' 
        : 'scale(1)',
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#25D366',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isHovered 
      ? '0 8px 20px rgba(37, 211, 102, 0.5), 0 0 15px rgba(37, 211, 102, 0.3)' 
      : '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: `${isHovered ? 'translateY(-8px) scale(1.1)' : 'translateY(0) scale(1)'} rotate(${rotation}deg)`,
  };

  const svgStyle = {
    transition: 'all 0.4s ease',
    transform: isHovered ? 'rotate(10deg)' : 'rotate(0deg)',
  };

  const pulseAnimationStyle = {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#25D366',
    opacity: isAnimating ? 0.4 : 0,
    transform: isAnimating ? 'scale(1.5)' : 'scale(1)',
    transition: 'all 0.6s ease-out',
  };

  const rippleStyles = [1, 2, 3].map(index => ({
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid #25D366',
    opacity: showRipple ? 0.8 - (index * 0.2) : 0,
    transform: showRipple ? `scale(${1 + (index * 0.4)})` : 'scale(1)',
    transition: `all ${0.8 + (index * 0.2)}s ease-out`,
    zIndex: -1,
  }));

  const tooltipStyle = {
    position: 'absolute',
    top: '-55px',
    right: '10px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.9)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const messageCountStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#FF4B4B',
    color: 'white',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    animation: 'heartbeat 1.5s ease-in-out infinite',
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open('https://api.whatsapp.com/send?phone=7604953346', '_blank')}
    >
      <style>
        {`
          @keyframes heartbeat {
            0% { transform: scale(1); }
            14% { transform: scale(1.3); }
            28% { transform: scale(1); }
            42% { transform: scale(1.3); }
            70% { transform: scale(1); }
          }
        `}
      </style>
      
      <div style={pulseAnimationStyle}></div>
      {rippleStyles.map((style, index) => (
        <div key={index} style={style}></div>
      ))}
      <div style={iconStyle}>
        <div style={messageCountStyle}>3</div>
        <svg 
          style={svgStyle}
          width="30" 
          height="30" 
          viewBox="0 0 24 24" 
          fill="white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.626-5.373-12-12-12zm.029 18.88a7.947 7.947 0 01-3.76-.945l-4.17 1.09 1.112-4.06A7.953 7.953 0 014.05 12.05c0-4.39 3.58-7.97 7.97-7.97 4.39 0 7.97 3.58 7.97 7.97 0 4.29-3.5 7.83-7.96 7.83z" fillRule="evenodd" clipRule="evenodd"/>
        </svg>
      </div>
    </div>
  );
};

export default FloatingWhatsAppIcon;