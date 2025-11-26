import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import './ContactSection.css';

export const ContactSection: React.FC = () => {
  return (
    <section className="contact">
      <div className="contact__container">
        <motion.div
          className="contact__content"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="contact__title">Looking to get in touch?</h2>
          <p className="contact__text">Give us a call or send an email.</p>
        </motion.div>
        <motion.div
          className="contact__image"
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DynamicImage section="contact" />
        </motion.div>
      </div>
    </section>
  );
};

