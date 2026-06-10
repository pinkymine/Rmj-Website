import { Link } from 'wouter';
import styles from './home-style/CustomJewelry.module.css';

const customOptions = [
  {
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    title: "Custom Rings",
    description: "Design your perfect ring",
    path: "/custom/rings"
  },
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    title: "Custom Necklaces",
    description: "Create unique necklaces",
    path: "/custom/necklaces"
  },
  {
    image: "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800&q=80",
    title: "Custom Sets",
    description: "Design matching sets",
    path: "/custom/sets"
  }
];

export default function CustomJewelry() {
  return (
    <section className={styles.customSection}>
      <h2>Customized Jewelry</h2>
      <p className={styles.subtitle}>Create your own unique piece</p>

      <div className={styles.grid}>
        {customOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <div className={styles.card}>
              <img src={option.image} alt={option.title} />
              <div className={styles.content}>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <button className={styles.customizeButton}>
                  Start Designing
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
