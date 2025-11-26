import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { DynamicImage } from '../DynamicImage';
import './SparrowsClosetSection.css';

export const SparrowsClosetSection: React.FC = () => {
  return (
    <section className="sparrows-closet">
      <div className="sparrows-closet__container">
        <motion.div
          className="sparrows-closet__image"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DynamicImage section="sparrows-closet" />
        </motion.div>
        <motion.div
          className="sparrows-closet__content"
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="sparrows-closet__title">Sparrows Closet</h2>
          <p className="sparrows-closet__text">
            Providing free clothing and hygiene items to families in need.
          </p>
          <Link to="/sparrows-closet">
            <Button variant="primary" size="lg" className="sparrows-closet__button">
              Learn How to Help
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

