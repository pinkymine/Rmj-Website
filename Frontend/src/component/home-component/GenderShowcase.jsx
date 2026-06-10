import { Link } from 'react-router-dom';
import styles from './home-style/GenderShowcase.module.css';
import male from '../../images/gender/image.png';
import female from '../../images/gender/female1.png';

export default function GenderShowcase() {
  return (
    <section className={styles.showcase}>
      <div className={styles.item}>
        <img 
          src={male}
          alt="Men's Collection"
        />
        <div className={styles.content}>
          <h2>Men's Collection</h2>
          <p>Bold designs for the modern gentleman</p>
          <Link to="/mens">
            <button className={styles.shopButton}>Shop Men's</button>
          </Link>
        </div>
      </div>

      <div className={styles.item}>
        <img 
          src={female} 
          alt="Women's Collection"
        />
        <div className={styles.content}>
          <h2>Women's Collection</h2>
          <p>Timeless elegance for every occasion</p>
          <Link to="/womens">
            <button className={styles.shopButton}>Shop Women's</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
