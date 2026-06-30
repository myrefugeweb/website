import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import { useSectionContent } from '../../hooks/useSectionContent';
import './ContactSection.css';

export const ContactSection: React.FC = () => {
  const { layout } = useSectionLayout('contact');
  const { content } = useSectionContent('contact');

  const title = content.title || 'Looking to get in touch?';
  const text = content.text || 'Give us a call or send an email.';

  // Layout 1: Text Left, Image Right (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="contact contact--layout-1">
        <div className="contact__container">
          <motion.div
            className="contact__content"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="contact__title">{title}</h2>
            <p className="contact__text">{text}</p>
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
  }

  // Layout 2: Image Left, Text Right
  if (layout === 'layout-2') {
    return (
      <section className="contact contact--layout-2">
        <div className="contact__container">
          <motion.div
            className="contact__image"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicImage section="contact" />
          </motion.div>
          <motion.div
            className="contact__content"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="contact__title">{title}</h2>
            <p className="contact__text">{text}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  // Layout 3: Centered Text with Image Below
  if (layout === 'layout-3') {
    return (
      <section className="contact contact--layout-3">
        <div className="contact__container">
          <motion.div
            className="contact__content contact__content--centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="contact__title contact__title--centered">{title}</h2>
            <p className="contact__text contact__text--centered">{text}</p>
          </motion.div>
          <motion.div
            className="contact__image contact__image--full-width"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <DynamicImage section="contact" />
          </motion.div>
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};

