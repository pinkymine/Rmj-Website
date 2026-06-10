import { useState } from 'react';
import { Link } from 'wouter';
import styles from './home-style/Collections.module.css';

const collections = [
  {
    name: "Traditional",
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&q=80",
    path: "/collections/traditional"
  },
  {
    name: "Modern",
    image: "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800&q=80",
    path: "/collections/modern"
  },
  {
    name: "Bridal",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    path: "/collections/bridal"
  },
  {
    name: "Festive",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    path: "/collections/festive"
  },
  {
    name: "Casual",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    path: "/collections/casual"
  },
  {
    name: "Designer",
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559074?w=800&q=80",
    path: "/collections/designer"
  },
  {
    name: "Antique",
    image: "https://images.unsplash.com/photo-1563294267-5db3f7975b9f?w=800&q=80",
    path: "/collections/antique"
  },
  {
    name: "Temple",
    image: "https://images.unsplash.com/photo-1620441090373-f6977a23fa0b?w=800&q=80",
    path: "/collections/temple"
  }
];

export default function Collections() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (collections.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (collections.length - 3)) % (collections.length - 3));
  };

  return (
    <section className={styles.collections}>
      <h2>Our Collections</h2>
      <div className={styles.carouselContainer}>
        <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide}>‹</button>
        <div className={styles.carousel}>
          <div 
            className={styles.slides}
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {collections.map((collection, index) => (
              <Link key={index} href={collection.path}>
                <div className={styles.slide}>
                  <img src={collection.image} alt={collection.name} />
                  <div className={styles.content}>
                    <h3>{collection.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide}>›</button>
      </div>
      <Link href="/collections">
        <button className={styles.viewAll}>View All Collections</button>
        
      </Link>
    </section>
  );
}
