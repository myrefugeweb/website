import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { DONATION_URL } from '../../constants/donation';
import { scrollToSection } from '../../utils/scrollToSection';
import './Header.css';

export const Header: React.FC = () => {
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToSection(sectionId);
    } else {
      // If not on home page, navigate to home first, then scroll
      e.preventDefault();
      window.location.href = `/#${sectionId}`;
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/">My Refuge</Link>
        </div>
        <ul className="header__links">
          <li>
            <Link to="/sparrows-closet">Sparrows Closet</Link>
          </li>
          <li>
            <a href="#events" onClick={(e) => handleNavClick(e, 'events')}>
              Events
            </a>
          </li>
          <li>
            <a href="#ways-to-give" onClick={(e) => handleNavClick(e, 'ways-to-give')}>
              Ways to Give
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>
              Contact
            </a>
          </li>
          <li>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => window.open(DONATION_URL, '_blank')}
            >
              Donate
            </Button>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
};

