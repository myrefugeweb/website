import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DynamicImage } from '../../components/DynamicImage';
import { DONATION_URL } from '../../constants/donation';
import { supabase } from '../../lib/supabase';
import type { SparrowsClosetContent } from '../../lib/supabase';
import './SparrowsClosetPage.css';

export const SparrowsClosetPage: React.FC = () => {
  const [content, setContent] = useState<SparrowsClosetContent | null>(null);

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
        <motion.section
          className="sparrows-closet-hero"
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

        <section className="sparrows-closet-info">
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

        <section className="sparrows-closet-impact">
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

        <section className="sparrows-closet-cta">
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
      </main>
      <Footer />
    </div>
  );
};

