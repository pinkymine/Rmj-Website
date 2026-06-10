import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGift, FaPercent } from 'react-icons/fa';
import styles from './home-style/SpecialOffers.module.css';
import one from './special-images/traditional-indian-wedding-jewelry.jpg';
import two from './special-images/side-view-silver-bracelets-with-diamonds-black-wall.jpg';
import three from './special-images/gorgeous-wedding-rings-sparklie-acorn.jpg';
const offers = [
  {
    id: 1,
    title: 'Summer Collection',
    description: 'Get up to 30% off on our new summer jewelry collection',
    image: one,
    badge: 'NEW',
    expiry: '2025-06-30',
    link: 'all-procuct'
  },
  {
    id: 2,
    title: 'Silver Elegance',
    description: 'Buy any silver necklace and get matching earrings at 20% off',
    image: two,
    badge: 'HOT',
    expiry: '2025-04-15',
    link: 'all-procuct'
  },
  {
    id: 3,
    title: 'Wedding Collection',
    description: 'Special prices for complete wedding jewelry sets',
    image: three,
    badge: 'SALE',
    expiry: '2025-05-31',
    link: 'all-procuct'
  }
];

export default function SpecialOffers() {
  const [visibleOffers, setVisibleOffers] = useState([]);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start showing offers one by one with a delay
          let timer = 0;
          const newVisibleOffers = [];
          
          const interval = setInterval(() => {
            if (timer < offers.length) {
              newVisibleOffers.push(timer);
              setVisibleOffers([...newVisibleOffers]);
              timer++;
            } else {
              clearInterval(interval);
            }
          }, 400); // 400ms delay between each offer appearing
          
          // Stop observing once triggered
          observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Function to calculate days remaining for offer
  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  return (
    <section className={styles.specialOffers} ref={sectionRef}>
      <div className={styles.header}>
        <h2>Special Offers & Promotions</h2>
        <p>Exclusive deals on our premium jewelry collections</p>
      </div>
      
      <div className={styles.offersGrid}>
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`${styles.offerCard} ${visibleOffers.includes(index) ? styles.visible : styles.hidden}`}
          >
            <div className={styles.imageContainer}>
              <img 
                src={offer.image} 
                alt={offer.title} 
                className={styles.offerImage} 
              />
              
              {offer.badge && (
                <span className={styles.badge}>
                  {offer.badge === 'NEW' && <FaGift className={styles.badgeIcon} />}
                  {offer.badge === 'SALE' && <FaPercent className={styles.badgeIcon} />}
                  {offer.badge}
                </span>
              )}
            </div>
            
            <div className={styles.offerContent}>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              
              <div className={styles.offerMeta}>
                <span className={styles.daysRemaining}>
                  {getDaysRemaining(offer.expiry)} days remaining
                </span>
              </div>
              
              <Link to={offer.link}>
                <button className={styles.actionButton}>
                  Shop Now <FaArrowRight className={styles.buttonIcon} />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.viewAllContainer}>
        <Link to="/all-procuct">
          <button className={styles.viewAllButton}>
            View All Promotions
          </button>
        </Link>
      </div>
    </section>
  );
}