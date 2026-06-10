import { useState } from 'react';
import styles from './home-style/ContactForm.module.css';

export default function ContactForm() {
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
      
      const response = await fetch('https://backend-ecommerce-1-zdfc.onrender.com/api/contacts', {
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
  
  return (
    <section className={styles.contact}>
      <div className={styles.content}>
        <h2>Contact Us</h2>
        <p>Have questions? We'd love to hear from you.</p>
        
        {isSubmitted && (
          <div className={styles.successMessage || "success-message"}>
            Thank you for your message! We'll get back to you soon.
          </div>
        )}
        
        {!isSubmitted && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            
            {error && (
              <div className={styles.errorMessage || "error-message"}>
                Error: {error}
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}