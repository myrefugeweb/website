import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DynamicImage } from '../../components/DynamicImage';
import { DONATION_URL } from '../../constants/donation';
import { supabase } from '../../lib/supabase';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import type { SparrowsClosetContent } from '../../lib/supabase';
import './SparrowsClosetPage.css';

export const SparrowsClosetPage: React.FC = () => {
  const [content, setContent] = useState<SparrowsClosetContent | null>(null);
  const heroLayout = useSectionLayout('sparrows-closet-hero');
  const infoLayout = useSectionLayout('sparrows-closet-info');
  const impactLayout = useSectionLayout('sparrows-closet-impact');
  const ctaLayout = useSectionLayout('sparrows-closet-cta');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        if (!anonKey || anonKey === 'dummy-key-for-initialization') {
          return;
        }

        const { data, error } = await supabase
          .from('sparrows_closet_content')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          // Only log if it's not a missing key error
          if (!error.message.includes('JWT') && !error.message.includes('key')) {
            console.error('Error loading content:', error);
          }
          return;
        }

        if (data) {
          setContent(data);
        }
      } catch (error: any) {
        // Silently handle errors
        if (error?.message && !error.message.includes('JWT') && !error.message.includes('key')) {
          console.error('Error loading content:', error);
        }
      }
    };

    loadContent();
  }, []);

  return (
    <div className="sparrows-closet-page">
      <Header />
      <main className="sparrows-closet-main">
        {/* Hero Section */}
        {heroLayout.layout === 'default' || heroLayout.layout === 'layout-1' ? (
          <motion.section
            className="sparrows-closet-hero sparrows-closet-hero--layout-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="sparrows-closet-hero__container">
              <div className="sparrows-closet-hero__content">
                <h1 className="sparrows-closet-hero__title">
                  {content?.title || 'Sparrows Closet'}
                </h1>
                <p className="sparrows-closet-hero__description">
                  {content?.description || 'Providing free clothing and hygiene items to families in need.'}
                </p>
              </div>
              <div className="sparrows-closet-hero__image">
                <DynamicImage section="sparrows-closet-hero" />
              </div>
            </div>
          </motion.section>
        ) : heroLayout.layout === 'layout-2' ? (
          <motion.section
            className="sparrows-closet-hero sparrows-closet-hero--layout-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="sparrows-closet-hero__background-image">
              <DynamicImage section="sparrows-closet-hero" className="sparrows-closet-hero__bg-img" />
              <div className="sparrows-closet-hero__bg-overlay"></div>
            </div>
            <div className="sparrows-closet-hero__container">
              <div className="sparrows-closet-hero__content sparrows-closet-hero__content--centered">
                <h1 className="sparrows-closet-hero__title">
                  {content?.title || 'Sparrows Closet'}
                </h1>
                <p className="sparrows-closet-hero__description">
                  {content?.description || 'Providing free clothing and hygiene items to families in need.'}
                </p>
              </div>
            </div>
          </motion.section>
        ) : heroLayout.layout === 'layout-3' ? (
          <motion.section
            className="sparrows-closet-hero sparrows-closet-hero--layout-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="sparrows-closet-hero__container">
              <div className="sparrows-closet-hero__image">
                <DynamicImage section="sparrows-closet-hero" />
              </div>
              <div className="sparrows-closet-hero__content">
                <h1 className="sparrows-closet-hero__title">
                  {content?.title || 'Sparrows Closet'}
                </h1>
                <p className="sparrows-closet-hero__description">
                  {content?.description || 'Providing free clothing and hygiene items to families in need.'}
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        {/* Info Section */}
        {infoLayout.layout === 'default' || infoLayout.layout === 'layout-1' ? (
          <section className={`sparrows-closet-info sparrows-closet-info--layout-1`}>
            <div className="sparrows-closet-info__container">
              <motion.div
                className="sparrows-closet-info__content"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="sparrows-closet-info__title">What We Provide</h2>
                <p className="sparrows-closet-info__text">
                  Free clothing, shoes, and hygiene items for families in need.
                </p>
              </motion.div>
              <motion.div
                className="sparrows-closet-info__image"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <DynamicImage section="sparrows-closet-info" />
              </motion.div>
            </div>
          </section>
        ) : infoLayout.layout === 'layout-2' ? (
          <section className="sparrows-closet-info sparrows-closet-info--layout-2">
            <div className="sparrows-closet-info__container">
              <motion.div
                className="sparrows-closet-info__image"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <DynamicImage section="sparrows-closet-info" />
              </motion.div>
              <motion.div
                className="sparrows-closet-info__content"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="sparrows-closet-info__title">What We Provide</h2>
                <p className="sparrows-closet-info__text">
                  Free clothing, shoes, and hygiene items for families in need.
                </p>
              </motion.div>
            </div>
          </section>
        ) : infoLayout.layout === 'layout-3' ? (
          <section className="sparrows-closet-info sparrows-closet-info--layout-3">
            <div className="sparrows-closet-info__container">
              <motion.div
                className="sparrows-closet-info__content sparrows-closet-info__content--centered"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="sparrows-closet-info__title sparrows-closet-info__title--centered">What We Provide</h2>
                <p className="sparrows-closet-info__text sparrows-closet-info__text--centered">
                  Free clothing, shoes, and hygiene items for families in need.
                </p>
              </motion.div>
              <motion.div
                className="sparrows-closet-info__image sparrows-closet-info__image--full-width"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <DynamicImage section="sparrows-closet-info" />
              </motion.div>
            </div>
          </section>
        ) : null}

        {/* Impact Section */}
        {impactLayout.layout === 'default' || impactLayout.layout === 'layout-1' ? (
          <section className="sparrows-closet-impact sparrows-closet-impact--layout-1">
            <div className="sparrows-closet-impact__container">
              <h2 className="sparrows-closet-impact__title">Our Impact</h2>
              <div className="sparrows-closet-impact__stats">
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">200+</div>
                  <div className="sparrows-closet-stat__label">Children Served</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">100%</div>
                  <div className="sparrows-closet-stat__label">Free to Families</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">2023</div>
                  <div className="sparrows-closet-stat__label">Year Launched</div>
                </Card>
              </div>
            </div>
          </section>
        ) : impactLayout.layout === 'layout-2' ? (
          <section className="sparrows-closet-impact sparrows-closet-impact--layout-2">
            <div className="sparrows-closet-impact__container">
              <h2 className="sparrows-closet-impact__title">Our Impact</h2>
              <div className="sparrows-closet-impact__stats sparrows-closet-impact__stats--vertical">
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">200+</div>
                  <div className="sparrows-closet-stat__label">Children Served</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">100%</div>
                  <div className="sparrows-closet-stat__label">Free to Families</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">2023</div>
                  <div className="sparrows-closet-stat__label">Year Launched</div>
                </Card>
              </div>
            </div>
          </section>
        ) : impactLayout.layout === 'layout-3' ? (
          <section className="sparrows-closet-impact sparrows-closet-impact--layout-3">
            <div className="sparrows-closet-impact__container">
              <h2 className="sparrows-closet-impact__title">Our Impact</h2>
              <div className="sparrows-closet-impact__stats sparrows-closet-impact__stats--grid">
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat sparrows-closet-stat--large">
                  <div className="sparrows-closet-stat__value">200+</div>
                  <div className="sparrows-closet-stat__label">Children Served</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">100%</div>
                  <div className="sparrows-closet-stat__label">Free to Families</div>
                </Card>
                <Card variant="elevated" padding="lg" className="sparrows-closet-stat">
                  <div className="sparrows-closet-stat__value">2023</div>
                  <div className="sparrows-closet-stat__label">Year Launched</div>
                </Card>
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA Section */}
        {ctaLayout.layout === 'default' || ctaLayout.layout === 'layout-1' ? (
          <section className="sparrows-closet-cta sparrows-closet-cta--layout-1">
            <div className="sparrows-closet-cta__container">
              <h2 className="sparrows-closet-cta__title">How You Can Help</h2>
              <p className="sparrows-closet-cta__text">
                Your donations help us continue providing essential items to families in need.
                Every contribution makes a difference.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.open(DONATION_URL, '_blank')}
              >
                Donate to Sparrows Closet
              </Button>
            </div>
          </section>
        ) : ctaLayout.layout === 'layout-2' ? (
          <section className="sparrows-closet-cta sparrows-closet-cta--layout-2">
            <div className="sparrows-closet-cta__container sparrows-closet-cta__container--left">
              <h2 className="sparrows-closet-cta__title">How You Can Help</h2>
              <p className="sparrows-closet-cta__text">
                Your donations help us continue providing essential items to families in need.
                Every contribution makes a difference.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.open(DONATION_URL, '_blank')}
              >
                Donate to Sparrows Closet
              </Button>
            </div>
          </section>
        ) : ctaLayout.layout === 'layout-3' ? (
          <section className="sparrows-closet-cta sparrows-closet-cta--layout-3">
            <div className="sparrows-closet-cta__container sparrows-closet-cta__container--split">
              <div className="sparrows-closet-cta__content">
                <h2 className="sparrows-closet-cta__title">How You Can Help</h2>
                <p className="sparrows-closet-cta__text">
                  Your donations help us continue providing essential items to families in need.
                  Every contribution makes a difference.
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.open(DONATION_URL, '_blank')}
                >
                  Donate to Sparrows Closet
                </Button>
              </div>
              <div className="sparrows-closet-cta__decorative">
                <div className="sparrows-closet-cta__decorative-icon">❤️</div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

