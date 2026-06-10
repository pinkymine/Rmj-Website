import { Link } from "react-router-dom";
import {  FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./home-style/Footer.module.css";
import play_store from './footer-image/play-store-removebg-preview.png';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.column}>
          <h3>About Us</h3>
          <p>
            Rajamani Jewellery Jayankondam is your premier destination for exquisite silver jewelry.
            We pride ourselves on quality craftsmanship and exceptional service.
          </p>
        </div>
        
        <div className={styles.column}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/track-order">Track order</Link></li>
          </ul>
        </div>
        
        <div className={styles.column}>
          <h3>Categories</h3>
          <ul>
            <li><Link to="/category/men">Mens</Link></li>
            <li><Link to="/category/women">Womens</Link></li>
            <li><Link to="/category/kids">Kids</Link></li>
            {/* <li><Link to="/all-product">Others</Link></li> */}
          </ul>
        </div>
        
        <div className={styles.column}>
          <h3>Newsletter</h3>
          <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className={styles.newsletter}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className={styles.playstore}>
        <p>Download our app</p>
        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
          <img 
            src={play_store}
            alt="Get it on Google Play" 
            className={styles.playstoreImage}
          />
        </a>
      </div>
      
      <div className={styles.bottom}>
        <div className={styles.social}>
          <center>FOLLOW US ON</center>
          <a href="https://www.instagram.com/rmj_35/?igsh=MTJxenhlZGhkNGM5ag%3D%3D#" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          
          <a href="https://www.youtube.com/@Rmj3535" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
            <FaPinterest />
          </a> */}
        </div>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Rajamani Jewellery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}