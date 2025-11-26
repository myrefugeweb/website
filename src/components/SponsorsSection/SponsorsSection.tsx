import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, type Sponsor } from '../../lib/supabase';
import './SponsorsSection.css';

export const SponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading sponsors:', error);
      } else {
        setSponsors(data || []);
      }
    } catch (error) {
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className="sponsors-section">
      <div className="sponsors-section__container">
        <motion.div
          className="sponsors-section__header"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="sponsors-section__title">Our Sponsors</h2>
          <p className="sponsors-section__subtitle">
            Thank you to our generous sponsors who make our mission possible
          </p>
        </motion.div>

        <div className="sponsors-section__grid">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.website_url || '#'}
              target={sponsor.website_url ? '_blank' : undefined}
              rel={sponsor.website_url ? 'noopener noreferrer' : undefined}
              className="sponsors-section__sponsor"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {sponsor.logo_url ? (
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="sponsors-section__logo"
                />
              ) : (
                <div className="sponsors-section__placeholder">
                  {sponsor.name}
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

