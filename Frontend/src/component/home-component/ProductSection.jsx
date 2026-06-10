import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home-style/ProductSection.module.css';
import one from './feature-images/necklese.jpeg';
import two from './feature-images/ring.jpeg';
import three from './feature-images/bracelet.jpeg';
import four from './feature-images/ear-ring.jpeg';






const products = [
  {
    id: 1,
    name: "Silver Chain Necklace",
    price: "2,999.00",
    originalPrice: "3,499.00",
    // Replace with your local image path
    image: one, 
    inStock: true,
    category: "Chains",
    rating: 4.5,
    reviews: 12
  },
  {
    id: 2,
    name: "Elegant Silver Ring",
    price: "1,499.00",
    originalPrice: "1,799.00",
    // Replace with your local image path
    image: two,
    inStock: true,
    category: "Rings",
    rating: 4.8,
    reviews: 24
  },
  {
    id: 3,
    name: "Silver Bracelet",
    price: "1,999.00",
    originalPrice: "2,299.00",
    // Replace with your local image path
    image: three,
    inStock: true,
    category: "Bracelets",
    rating: 4.6,
    reviews: 18
  },
  {
    id: 4,
    name: "Silver Earrings",
    price: "1,299.00",
    originalPrice: "1,599.00",
    // Replace with your local image path
    image: four,
    inStock: false,
    category: "Earrings",
    rating: 4.7,
    reviews: 32
  }
];

export default function ProductSection() {
  return (
    <section className={styles.products}>
      <h2>Featured Products</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.product}>
            <div className={styles.imageWrapper}>
              <img src={product.image} alt={product.name} />
              {/* Removed the overlay with Add to Cart button */}
            </div>
            <h3>{product.name}</h3>
           
          </div>
        ))}
      </div>
      <Link to="/all-procuct">
        <button className={styles.seeMore}>See More Products</button>
      </Link>
    </section>
  );
}