import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { helpCategories, helpTopics } from '../../data/adminHelpTopics';
import type { HelpCategory, HelpTopic } from '../../data/adminHelpTopics';
import './AdminHelp.css';

const categoryOrder = helpCategories.map((category) => category.id);

const topicMatches = (topic: HelpTopic, query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    topic.title,
    topic.summary,
    topic.whatItDoes,
    topic.category,
    ...topic.steps,
    ...(topic.tips || []),
  ].some((value) => value.toLowerCase().includes(normalized));
};

export const AdminHelp: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HelpCategory | 'all'>('all');

  const visibleTopics = useMemo(() => {
    return helpTopics
      .filter((topic) => activeCategory === 'all' || topic.category === activeCategory)
      .filter((topic) => topicMatches(topic, query))
      .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
  }, [activeCategory, query]);

  return (
    <div className="admin-help">
      <header className="admin-help__hero">
        <div className="admin-help__hero-content">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
          <div>
            <p className="admin-help__eyebrow">My Refuge Admin</p>
            <h1 className="admin-help__title">Help Center</h1>
            <p className="admin-help__subtitle">
              Learn what each tool does, see where it lives in the dashboard, and follow step-by-step instructions for editing, publishing, and training new users.
            </p>
          </div>
        </div>
      </header>

      <main className="admin-help__main">
        <section className="admin-help__search-card" aria-label="Search help topics">
          <div>
            <h2>What do you need help with?</h2>
            <p>Search by task, feature, or dashboard area.</p>
          </div>
          <input
            className="admin-help__search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search editing, images, publish, events..."
          />
        </section>

        <section className="admin-help__layout">
          <aside className="admin-help__sidebar" aria-label="Help categories">
            <button
              className={`admin-help__category ${activeCategory === 'all' ? 'admin-help__category--active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </button>
            {helpCategories.map((category) => (
              <button
                key={category.id}
                className={`admin-help__category ${activeCategory === category.id ? 'admin-help__category--active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span>{category.label}</span>
                <small>{category.description}</small>
              </button>
            ))}
          </aside>

          <div className="admin-help__topics">
            {visibleTopics.length === 0 ? (
              <div className="admin-help__empty">
                <h2>No matching topics</h2>
                <p>Try searching for “publish”, “image”, “event”, or “edit”.</p>
              </div>
            ) : (
              visibleTopics.map((topic) => <HelpTopicCard key={topic.id} topic={topic} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

type MediaState = 'animated' | 'static' | 'missing';

const HelpTopicCard: React.FC<{ topic: HelpTopic }> = ({ topic }) => {
  const category = helpCategories.find((item) => item.id === topic.category);
  const [mediaState, setMediaState] = useState<MediaState>(topic.animated ? 'animated' : 'static');

  const gifPath = `/help/screenshots/${topic.id}.gif`;
  const pngPath = `/help/screenshots/${topic.id}.png`;
  const mediaSrc = mediaState === 'animated' ? gifPath : pngPath;

  const handleMediaError = () => {
    // GIF missing -> try the static PNG; PNG missing -> show labeled frame.
    setMediaState((current) => (current === 'animated' ? 'static' : 'missing'));
  };

  return (
    <article className="admin-help__topic" id={topic.id}>
      <div className="admin-help__topic-header">
        <div>
          <p className="admin-help__topic-category">{category?.label || topic.category}</p>
          <h2>{topic.title}</h2>
          <p>{topic.summary}</p>
        </div>
        <span className="admin-help__topic-audience">
          {topic.audience.includes('super_admin') ? 'Admin' : topic.audience.includes('editor') ? 'Editor' : 'All'}
        </span>
      </div>

      <div className="admin-help__topic-body">
        <figure
          className="admin-help__media"
          data-topic-id={topic.id}
          data-screenshot-target={topic.screenshotTarget || ''}
        >
          {mediaState === 'missing' ? (
            <div className="admin-help__media-frame">
              <span>Screenshot target</span>
              <strong>{topic.screenshotLabel || topic.title}</strong>
              <small>{topic.screenshotTarget || 'Manual/reference screenshot'}</small>
            </div>
          ) : (
            <>
              <img
                className="admin-help__media-image"
                src={mediaSrc}
                alt={topic.screenshotLabel || `${topic.title} ${mediaState === 'animated' ? 'demo' : 'screenshot'}`}
                loading="lazy"
                onError={handleMediaError}
              />
              {mediaState === 'animated' && <span className="admin-help__media-badge">▶ Demo</span>}
            </>
          )}
          {topic.screenshotLabel && mediaState !== 'missing' && (
            <figcaption className="admin-help__media-caption">{topic.screenshotLabel}</figcaption>
          )}
        </figure>

        <div className="admin-help__steps">
          <div className="admin-help__what-it-does">
            <h3>What it does</h3>
            <p>{topic.whatItDoes}</p>
          </div>

          <h3>How to do it</h3>
          <ol>
            {topic.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {topic.tips && topic.tips.length > 0 && (
            <div className="admin-help__tips">
              <h3>Tips</h3>
              <ul>
                {topic.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
