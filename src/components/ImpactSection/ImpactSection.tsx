import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Card';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import { useSectionContent } from '../../hooks/useSectionContent';
import './ImpactSection.css';

export const ImpactSection: React.FC = () => {
  const { layout } = useSectionLayout('impact');
  const { content } = useSectionContent('impact');

  const title = content.title || 'Your Impact';
  const subtitle = content.subtitle || "Together, we're building a community where every child has a place to belong, where families find hope, and where love transforms lives.";
  const storyTitle = content['story-title'] || 'Real Stories, Real Impact';
  const storyText1 = content['story-text-1'] || 'Every number represents a real child, a real family, a real story of transformation. From providing warm meals to families struggling to make ends meet, to offering clothing and essentials through Sparrows Closet, to being a safe haven for youth seeking guidance—your support creates ripples of hope throughout Washington County.';
  const storyText2 = content['story-text-2'] || "We're not just providing services—we're building relationships, restoring dignity, and creating a community where everyone belongs.";

  const statFallbacks = [
    { 
      value: '10K+', 
      label: 'Meals Delivered', 
      description: 'Nutritious meals provided to children and families in need',
      icon: '🍽️',
      color: 'var(--color-primary-600)'
    },
    { 
      value: '100s', 
      label: 'Children Helped', 
      description: 'Lives transformed through mentoring, support, and care',
      icon: '👶',
      color: 'var(--color-success)'
    },
    { 
      value: '20+', 
      label: 'Dedicated Volunteers', 
      description: 'Community members giving their time and hearts',
      icon: '❤️',
      color: 'var(--color-secondary-600)'
    },
    { 
      value: '50+', 
      label: 'Families Served', 
      description: 'Families receiving support and resources through our programs',
      icon: '🏠',
      color: 'var(--color-gradient-purple-b)'
    },
  ];

  const impactStats = statFallbacks.map((stat, index) => ({
    ...stat,
    value: content[`stat-value-${index}`] || stat.value,
    label: content[`stat-label-${index}`] || stat.label,
    description: content[`stat-description-${index}`] || stat.description,
  }));

  const renderStats = () => (
    <div className="impact__stats">
      {impactStats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.15, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          <Card variant="elevated" padding="lg" className="impact__card">
            <div className="impact__card-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="impact__stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="impact__stat-label">{stat.label}</div>
            <div className="impact__stat-description">{stat.description}</div>
            <div className="impact__card-accent" style={{ backgroundColor: stat.color }}></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderStory = () => (
    <motion.div
      className="impact__story"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="impact__story-content">
        <h3 className="impact__story-title">{storyTitle}</h3>
        <p className="impact__story-text">{storyText1}</p>
        <p className="impact__story-text">{storyText2}</p>
      </div>
    </motion.div>
  );

  // Layout 1: Stats Grid with Story Below (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="impact impact--layout-1">
        <div className="impact__background" />
        <div className="impact__container">
          <motion.div
            className="impact__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="impact__title">{title}</h2>
            <p className="impact__subtitle">{subtitle}</p>
          </motion.div>
          {renderStats()}
          {renderStory()}
        </div>
      </section>
    );
  }

  // Layout 2: Stats Row with Story Side-by-Side
  if (layout === 'layout-2') {
    return (
      <section className="impact impact--layout-2">
        <div className="impact__background" />
        <div className="impact__container">
          <motion.div
            className="impact__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="impact__title">{title}</h2>
            <p className="impact__subtitle">{subtitle}</p>
          </motion.div>
          <div className="impact__layout-2-content">
            <div className="impact__layout-2-stats">
              {renderStats()}
            </div>
            <div className="impact__layout-2-story">
              {renderStory()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Story First, Stats Below
  if (layout === 'layout-3') {
    return (
      <section className="impact impact--layout-3">
        <div className="impact__background" />
        <div className="impact__container">
          <motion.div
            className="impact__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="impact__title">{title}</h2>
            <p className="impact__subtitle">{subtitle}</p>
          </motion.div>
          {renderStory()}
          {renderStats()}
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};
