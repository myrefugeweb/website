import React from 'react';
import { motion } from 'framer-motion';
import { DynamicImage } from '../DynamicImage';
import { useSectionLayout } from '../../hooks/useSectionLayout';
import './StorySection.css';

export const StorySection: React.FC = () => {
  const { layout } = useSectionLayout('story');
  
  const stories = [
    {
      title: 'A Place of Hope',
      content: 'Every day, children walk through our doors seeking more than just a meal or clothing. They\'re looking for someone who believes in them, who sees their potential, and who offers a safe space to grow.',
      image: 'story-1'
    },
    {
      title: 'Building Community',
      content: 'Through our programs, families don\'t just receive aid—they become part of a community. Neighbors helping neighbors, volunteers becoming mentors, and children finding role models who inspire them to dream bigger.',
      image: 'story-2'
    },
    {
      title: 'Transforming Lives',
      content: 'From providing crisis aid during difficult times to offering ongoing support through Sparrows Closet, we\'re not just addressing immediate needs—we\'re investing in long-term transformation, one child, one family at a time.',
      image: 'story-3'
    }
  ];

  // Layout 1: Vertical Stack (Default)
  if (layout === 'default' || layout === 'layout-1') {
    return (
      <section className="story-section story-section--layout-1">
        <div className="story-section__container">
          <motion.div
            className="story-section__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="story-section__title">Our Story</h2>
            <p className="story-section__subtitle">
              Every child deserves a place to belong. Every family deserves support. 
              Every community deserves hope.
            </p>
          </motion.div>

          <div className="story-section__stories">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                className="story-section__story"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <div className="story-section__story-image">
                  <DynamicImage section={story.image} />
                </div>
                <div className="story-section__story-content">
                  <h3 className="story-section__story-title">{story.title}</h3>
                  <p className="story-section__story-text">{story.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 2: Grid Layout (3 columns)
  if (layout === 'layout-2') {
    return (
      <section className="story-section story-section--layout-2">
        <div className="story-section__container">
          <motion.div
            className="story-section__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="story-section__title">Our Story</h2>
            <p className="story-section__subtitle">
              Every child deserves a place to belong. Every family deserves support. 
              Every community deserves hope.
            </p>
          </motion.div>

          <div className="story-section__stories story-section__stories--grid">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                className="story-section__story story-section__story--card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <div className="story-section__story-image">
                  <DynamicImage section={story.image} />
                </div>
                <div className="story-section__story-content">
                  <h3 className="story-section__story-title">{story.title}</h3>
                  <p className="story-section__story-text">{story.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Alternating Side-by-Side
  if (layout === 'layout-3') {
    return (
      <section className="story-section story-section--layout-3">
        <div className="story-section__container">
          <motion.div
            className="story-section__header"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="story-section__title">Our Story</h2>
            <p className="story-section__subtitle">
              Every child deserves a place to belong. Every family deserves support. 
              Every community deserves hope.
            </p>
          </motion.div>

          <div className="story-section__stories">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                className={`story-section__story story-section__story--alternating ${index % 2 === 0 ? 'story-section__story--left' : 'story-section__story--right'}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <div className="story-section__story-image">
                  <DynamicImage section={story.image} />
                </div>
                <div className="story-section__story-content">
                  <h3 className="story-section__story-title">{story.title}</h3>
                  <p className="story-section__story-text">{story.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default
  return null;
};

