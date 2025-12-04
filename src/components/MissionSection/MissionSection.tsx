import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import { useSectionContent } from '../../hooks/useSectionContent';
import './MissionSection.css';

export const MissionSection: React.FC = () => {
  const { layout } = useSectionLayout('mission');
  const { content } = useSectionContent('mission');

  // Get content with fallbacks
  const title = content.title || 'Our Mission';
  const text1 = content['text-1'] || 'We believe every child deserves to know their worth, every family deserves support during difficult times, and every community member deserves the opportunity to make a difference. Through Christian faith-based mentoring, education, and unconditional love, we provide local youth with a sense of personal worth, clear direction, and the knowledge that they matter.';
  const text2 = content['text-2'] || "Our mission extends beyond providing services—we're building relationships, restoring dignity, and creating lasting change that transforms not just individual lives, but entire communities.";

  // Layout 1: Image Left, Text Right (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="mission mission--layout-1">
        <div className="mission__container">
          <motion.div
            className="mission__image"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicImage section="mission" />
          </motion.div>
          <motion.div
            className="mission__content"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mission__title">{title}</h2>
            <p className="mission__text">{text1}</p>
            <p className="mission__text">{text2}</p>
            <motion.div 
              className="mission__accent"
              initial={{ width: 0 }}
              whileInView={{ width: '100px' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            ></motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Layout 2: Text Left, Image Right
  if (layout === 'layout-2') {
    return (
      <section className="mission mission--layout-2">
        <div className="mission__container">
          <motion.div
            className="mission__content"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mission__title">{title}</h2>
            <p className="mission__text">{text1}</p>
            <p className="mission__text">{text2}</p>
            <motion.div 
              className="mission__accent"
              initial={{ width: 0 }}
              whileInView={{ width: '100px' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            ></motion.div>
          </motion.div>
          <motion.div
            className="mission__image"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicImage section="mission" />
          </motion.div>
        </div>
      </section>
    );
  }

  // Layout 3: Centered Text with Image Below
  if (layout === 'layout-3') {
    return (
      <section className="mission mission--layout-3">
        <div className="mission__container">
          <motion.div
            className="mission__content mission__content--centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mission__title mission__title--centered">Our Mission</h2>
            <p className="mission__text mission__text--centered">
              We believe every child deserves to know their worth, every family deserves support 
              during difficult times, and every community member deserves the opportunity to make 
              a difference. Through Christian faith-based mentoring, education, and unconditional 
              love, we provide local youth with a sense of personal worth, clear direction, and 
              the knowledge that they matter.
            </p>
            <p className="mission__text mission__text--centered">
              Our mission extends beyond providing services—we're building relationships, restoring 
              dignity, and creating lasting change that transforms not just individual lives, but 
              entire communities.
            </p>
            <motion.div 
              className="mission__accent mission__accent--centered"
              initial={{ width: 0 }}
              whileInView={{ width: '100px' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            ></motion.div>
          </motion.div>
          <motion.div
            className="mission__image mission__image--full-width"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <DynamicImage section="mission" />
          </motion.div>
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};

