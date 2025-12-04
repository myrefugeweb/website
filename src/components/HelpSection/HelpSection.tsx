import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import './HelpSection.css';

export const HelpSection: React.FC = () => {
  const { layout } = useSectionLayout('help');

  // Layout 1: Text Left, Image Right (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="help help--layout-1">
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
  }

  // Layout 2: Image Left, Text Right
  if (layout === 'layout-2') {
    return (
      <section className="help help--layout-2">
        <div className="help__container">
          <motion.div
            className="help__image"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicImage section="help" />
          </motion.div>
          <motion.div
            className="help__content"
            initial={{ opacity: 0, x: 15 }}
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
        </div>
      </section>
    );
  }

  // Layout 3: Centered Text with Image Below
  if (layout === 'layout-3') {
    return (
      <section className="help help--layout-3">
        <div className="help__container">
          <motion.div
            className="help__content help__content--centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="help__title help__title--centered">How You Can Help</h2>
            <p className="help__text help__text--centered">
              Supporting My Refuge is an investment in the future of youth in Washington County,
              Oklahoma. Through providing meals, clothing, and crisis aid to struggling families,
              we create a foundation of hope and support that transforms lives.
            </p>
          </motion.div>
          <motion.div
            className="help__image help__image--full-width"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <DynamicImage section="help" />
          </motion.div>
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};

