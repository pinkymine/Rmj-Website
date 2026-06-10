import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './home-style/Categories.module.css';
import one from './catagories-images/ring1.jpg';
import two from './catagories-images/neckles.jpg';
import three from './catagories-images/earing.jpg';
import four from './catagories-images/bracelet.jpg';
import five from './catagories-images/pendant.jpg';
import six from './catagories-images/six.jpg';




const categories = [
  { 
    image: one, 
    name: 'Rings', 
    path: 'all-procuct' 
  },
  { 
    image: two, 
    name: 'Necklaces', 
    path: 'all-procuct' 
  },
  { 
    image: three, 
    name: 'Earrings', 
    path: 'all-procuct' 
  },
  { 
    image: four, 
    name: 'Bracelets', 
    path: 'all-procuct' 
  },
  { 
    image: five, 
    name: 'Pendants', 
    path: 'all-procuct' 
  },{ 
    image: six, 
    name: 'Anklet', 
    path: 'all-procuct' 
  }
 
];

export default function Categories() {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start showing items one by one with a delay
          let timer = 0;
          const newVisibleItems = [];
          
          const interval = setInterval(() => {
            if (timer < categories.length) {
              newVisibleItems.push(timer);
              setVisibleItems([...newVisibleItems]);
              timer++;
            } else {
              clearInterval(interval);
            }
          }, 300); // 300ms delay between each item appearing
          
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
  
  return (
    <section className={styles.categories} ref={sectionRef}>
      <h2>Shop by Category</h2>
      <div className={styles.grid}>
        {categories.map((category, index) => {
          return (
            <Link key={index} to={category.path} className={styles.categoryLink}>
              <div
                className={`${styles.category} ${visibleItems.includes(index) ? styles.visible : styles.hidden}`}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className={styles.categoryImage} 
                  />
                </div>
                <h3>{category.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}