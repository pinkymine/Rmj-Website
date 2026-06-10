import { useState, useEffect } from 'react';
import styles from './home-style/Hero.module.css';
import image1 from "./hero-image/1.jpg";
import image2 from "./hero-image/2.jpg";
import image3 from "./hero-image/3.jpg";

const slides = [
  {
    image: image1,
    title: "Luxury Collection 2025",
    description: "Discover our latest collection of handcrafted silver jewelry"
  },
  {
    image: image2,
    title: "Timeless Elegance",
    description: "Exquisite designs that stand the test of time"
  },
  {
    image: image3,
    title: "Custom Creations",
    description: "Your unique vision brought to life by our master craftsmen"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationState, setAnimationState] = useState({
    title: false,
    description: false,
    button: false
  });

  // Trigger animations when slide changes
  useEffect(() => {
    // Reset animations
    setAnimationState({
      title: false,
      description: false,
      button: false
    });

    // Stagger animations
    const titleTimer = setTimeout(() => setAnimationState(prev => ({ ...prev, title: true })), 300);
    const descTimer = setTimeout(() => setAnimationState(prev => ({ ...prev, description: true })), 800);
    const btnTimer = setTimeout(() => setAnimationState(prev => ({ ...prev, button: true })), 1300);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(descTimer);
      clearTimeout(btnTimer);
    };
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    // Auto-play slides every 5 seconds
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className={styles.hero}>
      <div 
        className={styles.slides}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className={styles.slide}>
            <div className={styles.imageContainer}>
              <img src={slide.image} alt={slide.title} />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.content}>
              <h2 className={`${styles.slideTitle} ${index === currentSlide && animationState.title ? styles.animate : ''}`}>
                {slide.title}
              </h2>
              <p className={`${styles.slideDescription} ${index === currentSlide && animationState.description ? styles.animate : ''}`}>
                {slide.description}
              </p>
              <button className={`${styles.cta} ${index === currentSlide && animationState.button ? styles.animate : ''}`}>
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide}>
        ‹
      </button>
      <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide}>
        ›
      </button>

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}