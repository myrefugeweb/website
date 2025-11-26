import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import './HelpSection.css';

export const HelpSection: React.FC = () => {
  return (
    <section className="help">
      <div className="help__container">
        <motion.div
          className="help__content"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="help__title">How You Can Help</h2>
          <p className="help__text">
            Supporting My Refuge is an investment in the future of youth in Washington County,
            Oklahoma. Through providing meals, clothing, and crisis aid to struggling families,
            we create a foundation of hope and support that transforms lives.
          </p>
        </motion.div>
        <motion.div
          className="help__image"
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DynamicImage section="help" />
        </motion.div>
      </div>
    </section>
  );
};

