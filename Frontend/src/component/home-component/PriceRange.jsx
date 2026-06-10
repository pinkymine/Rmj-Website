
import { Link } from 'react-router-dom';
import styles from './home-style/PriceRange.module.css';

const priceRanges = [
  {
    range: "Under ₹999",
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&q=80",
    path: "/all-procuct"
  },
  {
    range: "₹1000 - ₹2999",
    image: "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800&q=80",
    path: "/all-procuct"
  },
  {
    range: "₹3000 & Above",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    path: "/all-procuct"
  }
];

export default function PriceRange() {
  return (
    <section className={styles.priceRange}>
      <h2>Shop by Price</h2>
      <div className={styles.grid}>
        {priceRanges.map((range, index) => (
          <Link key={index} to={range.path} className={styles.link}>
            <div className={styles.priceCard}>
              <img src={range.image} alt={range.range} />
              <div className={styles.overlay}>
                <h3>{range.range}</h3>
                <button className={styles.shopButton}>Shop Now</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
