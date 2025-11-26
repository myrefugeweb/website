import React from 'react';
import { motion } from 'framer-motion';
import { DONATION_URL } from '../../constants/donation';
import './DonationBanner.css';

export const DonationBanner: React.FC = () => {
  return (
    <motion.section
      className="donation-banner"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="donation-banner__container">
        <h2 className="donation-banner__title">Your donation makes a change.</h2>
        <div className="donation-banner__options">
          <div 
            className="donation-option"
            onClick={() => window.open(DONATION_URL, '_blank')}
          >
            $25
          </div>
          <div 
            className="donation-option"
            onClick={() => window.open(DONATION_URL, '_blank')}
          >
            $50
          </div>
          <div 
            className="donation-option"
            onClick={() => window.open(DONATION_URL, '_blank')}
          >
            $100
          </div>
        </div>
      </div>
    </motion.section>
  );
};

