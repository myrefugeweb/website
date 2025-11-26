import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { DONATION_URL } from '../../constants/donation';
import { scrollToSection } from '../../utils/scrollToSection';
import refugeLogo from '../../assets/refugeLogo.svg';
import './Header.css';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '/website/') {
      scrollToSection(sectionId);
    } else {
      // If not on home page, navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={refugeLogo} alt="My Refuge" className="header__logo-img" />
          </Link>
        </div>
        <ul className={`header__links ${isMobileMenuOpen ? 'header__links--open' : ''}`}>
          <li>
            <Link to="/sparrows-closet" onClick={() => setIsMobileMenuOpen(false)}>Sparrows Closet</Link>
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
              onClick={() => {
                window.open(DONATION_URL, '_blank');
                setIsMobileMenuOpen(false);
              }}
            >
              Donate
            </Button>
          </li>
        </ul>
        <button 
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="header__mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

