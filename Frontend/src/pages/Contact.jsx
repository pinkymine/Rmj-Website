import React, { useState } from 'react';
import styles from '../style/ContactPage.module.css';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('https://rmj-backend.onrender.com/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Response from server:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Show success message
      setIsSubmitted(true);
      
      // Keep success message visible for 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // The address coordinates for Rajamani Jewellery in Ariyalur
  const storeLocation = {
    lat: 11.2123,
    lng: 79.3636
  };

  return (
    <div className={styles.container}>
      {/* Get in touch section */}
      <motion.section 
        className={styles.contactSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Get in touch
        </motion.h2>
        <motion.p 
          className={styles.contactDesc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Please do not hesitate to reach out to us for any queries or feedback. We are here to create effective solutions for any of your concerns
        </motion.p>
        
        <motion.form 
          className={styles.contactForm}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className={styles.formRow}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            className={styles.formInput}
          />
          
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className={styles.formTextarea}
            rows={4}
          ></textarea>
          
          {isSubmitted && (
            <motion.div 
              className={styles.successMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Thank you for your message! We will get back to you soon.
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              className={styles.errorMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </motion.div>
          )}
          
          <motion.button 
            type="submit" 
            className={styles.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </motion.button>
        </motion.form>
      </motion.section>

      {/* Store location section */}
      <motion.section 
        className={styles.locationSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          Store location
        </motion.h2>

        <motion.div 
          className={styles.storeInfoContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className={styles.storeInfo}>
            <h3>Timings:</h3>
            <p>All Days Available (10:30 am to 9:30 pm)</p>
            
            <h3>Address:</h3>
            <p>105 bazzer Street jayankondam, Ariyalur (dt)</p>
            
            <h3>Contact No:</h3>
            <p>+91-7604953346</p>
            
            <h3>Email us:</h3>
            <p >rajamanijewellery35@gmail.com</p>
          
          </div>
          
          <motion.div 
            className={styles.mapContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Updated Google Maps iframe with the specific link provided */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.9749999966314!2d79.36116912779553!3d11.212269390855695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab2b3b80b7c5cb%3A0xb63520122480e748!2srajamani%20jewellery!5e0!3m2!1sen!2sin!4v1713200012345!5m2!1sen!2sin"
              width="580"
              height="240"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rajamani Jewellery Location"
              className={styles.mapIframe}
            ></iframe>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Benefits section */}
    
      <motion.div 
        className={styles.qualityAssurance}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <p>ALL ITEMS SOLD BY US ARE GENUINE SILVER WITH RESALE VALUE ALL OVER INDIA</p>
      </motion.div>
    </div>
  );
};

export default ContactPage;