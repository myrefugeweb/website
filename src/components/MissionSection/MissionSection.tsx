import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import './MissionSection.css';

export const MissionSection: React.FC = () => {
  return (
    <section className="mission">
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
          <h2 className="mission__title">Our Mission</h2>
          <p className="mission__text">
            We believe every child deserves to know their worth, every family deserves support 
            during difficult times, and every community member deserves the opportunity to make 
            a difference. Through Christian faith-based mentoring, education, and unconditional 
            love, we provide local youth with a sense of personal worth, clear direction, and 
            the knowledge that they matter.
          </p>
          <p className="mission__text">
            Our mission extends beyond providing services—we're building relationships, restoring 
            dignity, and creating lasting change that transforms not just individual lives, but 
            entire communities.
          </p>
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
};

