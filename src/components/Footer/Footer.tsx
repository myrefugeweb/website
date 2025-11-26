import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { DONATION_URL } from '../../constants/donation';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__donate-section">
        <div className="footer__donate-container">
          <div className="footer__donate-content">
            <h3 className="footer__donate-title">Help Today</h3>
            <p className="footer__donate-text">Make a secure donation today</p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.open(DONATION_URL, '_blank')}
          >
            Donate Today
          </Button>
        </div>
      </div>
      <div className="footer__main">
        <div className="footer__container">
          <div className="footer__section">
            <h4 className="footer__section-title">ADDITIONAL INFO</h4>
            <ul className="footer__links">
              <li>
                <Link to="/privacy">Privacy Statement</Link>
              </li>
              <li>
                <a href="tel:918-766-3559">918-766-3559</a>
              </li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__section-title">COMPANY</h4>
            <ul className="footer__links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <a href="tel:918-766-3559">918-766-3559</a>
              </li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__section-title">ADDRESS</h4>
            <p className="footer__address">
              PO Box 681, 1536 Sunset Blvd<br />
              Bartlesville, OK, 74003
            </p>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">
            Copyright © 2024 My Refuge 501c3
          </p>
          <Link to="/admin" className="footer__admin-link">
            login
          </Link>
        </div>
      </div>
    </footer>
  );
};

