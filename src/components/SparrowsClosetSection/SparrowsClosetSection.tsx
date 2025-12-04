import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { DynamicImage } from '../DynamicImage';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import './SparrowsClosetSection.css';

export const SparrowsClosetSection: React.FC = () => {
  const { layout } = useSectionLayout('sparrows-closet');

  // Layout 1: Image Left, Text Right (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="sparrows-closet sparrows-closet--layout-1">
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
  }

  // Layout 2: Text Left, Image Right
  if (layout === 'layout-2') {
    return (
      <section className="sparrows-closet sparrows-closet--layout-2">
        <div className="sparrows-closet__container">
          <motion.div
            className="sparrows-closet__content"
            initial={{ opacity: 0, x: -15 }}
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
          <motion.div
            className="sparrows-closet__image"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicImage section="sparrows-closet" />
          </motion.div>
        </div>
      </section>
    );
  }

  // Layout 3: Centered Content with Image Background
  if (layout === 'layout-3') {
    return (
      <section className="sparrows-closet sparrows-closet--layout-3">
        <div className="sparrows-closet__background-image">
          <DynamicImage section="sparrows-closet" className="sparrows-closet__bg-img" />
          <div className="sparrows-closet__bg-overlay"></div>
        </div>
        <div className="sparrows-closet__container">
          <motion.div
            className="sparrows-closet__content sparrows-closet__content--centered"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="sparrows-closet__title sparrows-closet__title--centered">Sparrows Closet</h2>
            <p className="sparrows-closet__text sparrows-closet__text--centered">
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
  }

  // Fallback to default
  return null;
};

