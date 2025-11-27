import React from 'react';
import { motion } from 'framer-motion';
import './StatsSection.css';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '20+',
      label: 'Dedicated Volunteers',
      icon: '👥'
    },
    {
      value: '100%',
      label: 'Delivered Donations',
      icon: '✅'
    },
    {
      value: '250K',
      label: 'Charity Participation',
      icon: '❤️'
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-section__container">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stats-section__stat"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stats-section__icon">{stat.icon}</div>
            <div className="stats-section__value" data-editable-type="text" data-editable-section="stats">{stat.value}</div>
            <div className="stats-section__label" data-editable-type="text" data-editable-section="stats">{stat.label}</div>
            {index < stats.length - 1 && (
              <div className="stats-section__divider"></div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

