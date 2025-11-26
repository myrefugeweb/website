import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { DynamicImage } from '../DynamicImage';
import { DONATION_URL } from '../../constants/donation';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import { useEventTracking } from '../../hooks/useAnalytics';
import SunLogoText from '../../assets/sunLogowText.svg';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const { layout } = useSectionLayout('hero');
  const { trackDonationClick } = useEventTracking();

  // Layout 1: Default - Text Left, Image Right
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="hero hero--layout-1">
        <div className="hero__container">
          <div className="hero__content">
            <motion.div
              className="hero__text-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="hero__org-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img src={SunLogoText} alt="My Refuge" className="hero__org-name-logo" />
              </motion.div>
              <motion.h1
                className="hero__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Giving <span className="hero__title-accent">Hope</span>, Creating Impact
              </motion.h1>
              <motion.p
                className="hero__description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Be a part of something great. We are utterly dedicated to giving hope to those in need, 
                creating a lasting impact for children and families in Washington County, Oklahoma.
              </motion.p>
              <motion.div
                className="hero__actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.open(DONATION_URL, '_blank')}
                  className="hero__donate-btn"
                >
                  Donate Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="hero__learn-btn"
                  onClick={() => {
                    const aboutElement = document.getElementById('about');
                    if (aboutElement) {
                      const headerOffset = 80;
                      const elementPosition = aboutElement.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'auto' });
                    }
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="hero__visual"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="hero__image-wrapper">
                <DynamicImage section="hero" className="hero__dynamic-image" />
                <div className="hero__image-overlay"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Layout 2: Centered with Image Background
  if (layout === 'layout-2') {
    return (
      <section className="hero hero--layout-2">
        <div className="hero__background-image">
          <DynamicImage section="hero" className="hero__bg-img" />
          <div className="hero__bg-overlay"></div>
        </div>
        <div className="hero__container">
          <motion.div
            className="hero__centered-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero__org-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <img src={SunLogoText} alt="My Refuge" className="hero__org-name-logo" />
            </motion.div>
            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Giving <span className="hero__title-accent">Hope</span>, Creating Impact
            </motion.h1>
            <motion.p
              className="hero__description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Be a part of something great. We are utterly dedicated to giving hope to those in need, 
              creating a lasting impact for children and families in Washington County, Oklahoma.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => {
                  trackDonationClick('hero-section');
                  window.open(DONATION_URL, '_blank');
                }}
                className="hero__donate-btn"
              >
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hero__learn-btn"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Layout 3: Image Left, Text Right
  if (layout === 'layout-3') {
    return (
      <section className="hero hero--layout-3">
        <div className="hero__container">
          <div className="hero__content">
            <motion.div
              className="hero__visual"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="hero__image-wrapper">
                <DynamicImage section="hero" className="hero__dynamic-image" />
                <div className="hero__image-overlay"></div>
              </div>
            </motion.div>
            <motion.div
              className="hero__text-content"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="hero__org-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <img src={SunLogoText} alt="My Refuge" className="hero__org-name-logo" />
              </motion.div>
              <motion.h1
                className="hero__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Giving <span className="hero__title-accent">Hope</span>, Creating Impact
              </motion.h1>
              <motion.p
                className="hero__description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Be a part of something great. We are utterly dedicated to giving hope to those in need, 
                creating a lasting impact for children and families in Washington County, Oklahoma.
              </motion.p>
              <motion.div
                className="hero__actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.open(DONATION_URL, '_blank')}
                  className="hero__donate-btn"
                >
                  Donate Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="hero__learn-btn"
                  onClick={() => {
                    const aboutElement = document.getElementById('about');
                    if (aboutElement) {
                      const headerOffset = 80;
                      const elementPosition = aboutElement.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'auto' });
                    }
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};

