import { motion } from 'framer-motion';
import Categories from '../component/home-component/Categories';
import Collections from '../component/home-component/Collections';
import ContactForm from '../component/home-component/ContactForm';
import CustomJewelry from '../component/home-component/CustomJewelry';
import Footer from '../component/home-component/Footer';
import GenderShowcase from '../component/home-component/GenderShowcase';
import Header from '../component/home-component/Header';
import Hero from '../component/home-component/Hero';
import PriceRange from '../component/home-component/PriceRange';
import ProductSection from '../component/home-component/ProductSection';
import Reviews from '../component/home-component/Reviews';
import SpecialOffers from '../component/home-component/Special';
import styles from '../style/Home.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const parallax = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

export default function Home() {
  return (
    <div className={styles.home}>
      {/* <Header/> */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <Hero />
        </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <Categories />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <GenderShowcase />
      </motion.div>
      
      {/* <CustomJewelry/> */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <ProductSection />
      </motion.div>
      
      {/* <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <PriceRange />
      </motion.div> */}
      
      {/* <Collections/> */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <SpecialOffers />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <Reviews />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
        <ContactForm />
      </motion.div>
      
      {/* <Footer/> */}
    </div>
  );
}
