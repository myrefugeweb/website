import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card } from '../../components/Card';
import './PrivacyPage.css';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="privacy-page">
      <Header />
      <main className="privacy-page__main">
        <div className="privacy-page__container">
          <Card variant="elevated" padding="lg" className="privacy-page__card">
            <h1 className="privacy-page__title">Privacy Statement</h1>
            <p className="privacy-page__last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <div className="privacy-page__content">
              <section className="privacy-page__section">
                <h2>Introduction</h2>
                <p>
                  My Refuge 501c3 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Statement explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section className="privacy-page__section">
                <h2>Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                  <li>Make a donation</li>
                  <li>Register for events</li>
                  <li>Contact us through our website</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Volunteer with our organization</li>
                </ul>
                <p>This information may include:</p>
                <ul>
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Information about your interests and preferences</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
                <ul>
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages you visit and time spent on pages</li>
                  <li>Referring website addresses</li>
                </ul>
              </section>

              <section className="privacy-page__section">
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process and acknowledge your donations</li>
                  <li>Send you updates about our programs and events</li>
                  <li>Respond to your inquiries and requests</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                  <li>Send you newsletters and other communications (with your consent)</li>
                </ul>
              </section>

              <section className="privacy-page__section">
                <h2>Information Sharing and Disclosure</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul>
                  <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                  <li><strong>Protection of Rights:</strong> We may disclose information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</li>
                </ul>
              </section>

              <section className="privacy-page__section">
                <h2>Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section className="privacy-page__section">
                <h2>Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access and receive a copy of your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of receiving marketing communications</li>
                  <li>Object to processing of your personal information</li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided below.</p>
              </section>

              <section className="privacy-page__section">
                <h2>Cookies and Tracking Technologies</h2>
                <p>
                  Our website may use cookies and similar tracking technologies to enhance your experience. You can set your browser to refuse cookies or alert you when cookies are being sent. However, some parts of our website may not function properly if you disable cookies.
                </p>
              </section>

              <section className="privacy-page__section">
                <h2>Children's Privacy</h2>
                <p>
                  Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section className="privacy-page__section">
                <h2>Changes to This Privacy Statement</h2>
                <p>
                  We may update this Privacy Statement from time to time. We will notify you of any changes by posting the new Privacy Statement on this page and updating the "Last Updated" date. You are advised to review this Privacy Statement periodically for any changes.
                </p>
              </section>

              <section className="privacy-page__section">
                <h2>Contact Us</h2>
                <p>If you have any questions about this Privacy Statement or our privacy practices, please contact us:</p>
                <div className="privacy-page__contact">
                  <p><strong>My Refuge 501c3</strong></p>
                  <p>PO Box 681, 1536 Sunset Blvd</p>
                  <p>Bartlesville, OK 74003</p>
                  <p>Phone: <a href="tel:918-766-3559">918-766-3559</a></p>
                </div>
              </section>
            </div>

            <div className="privacy-page__back">
              <Link to="/" className="privacy-page__back-link">
                ← Back to Home
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

