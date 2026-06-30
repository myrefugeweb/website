import React from 'react';
import './LayoutPreview.css';

interface LayoutPreviewProps {
  layoutType: string;
  section: string;
  isSelected: boolean;
  onClick: () => void;
}

type MockSize = 'display' | 'title' | 'subtitle' | 'body' | 'eyebrow';

const MockText: React.FC<{ size: MockSize; lines?: number; align?: 'left' | 'center' }> = ({
  size,
  lines = 1,
  align = 'left',
}) => (
  <div className={`mock-text mock-text--${align}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <span
        key={index}
        className={`mock-line mock-line--${size}`}
        style={{ width: lineWidth(size, index, lines) }}
      />
    ))}
  </div>
);

const lineWidth = (size: MockSize, index: number, lines: number) => {
  if (size === 'display') return index === 0 ? '85%' : '55%';
  if (size === 'title') return index === 0 ? '70%' : '45%';
  if (size === 'eyebrow') return '32%';
  // body
  if (index === lines - 1) return '60%';
  return '100%';
};

const MockImage: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`mock-image ${className}`} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M3 16l5-5 4 4 3-3 6 6M3 5h18v14H3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
    </svg>
  </div>
);

const MockButtons: React.FC<{ align?: 'left' | 'center' }> = ({ align = 'left' }) => (
  <div className={`mock-buttons mock-buttons--${align}`}>
    <span className="mock-btn mock-btn--primary" />
    <span className="mock-btn mock-btn--ghost" />
  </div>
);

const MockStat: React.FC = () => (
  <div className="mock-stat">
    <span className="mock-stat__value" />
    <span className="mock-stat__label" />
  </div>
);

const TextStack: React.FC<{ align?: 'left' | 'center'; titleSize?: MockSize; withButtons?: boolean }> = ({
  align = 'left',
  titleSize = 'title',
  withButtons = true,
}) => (
  <div className={`mock-stack mock-stack--${align}`}>
    <MockText size="eyebrow" align={align} />
    <MockText size={titleSize} lines={2} align={align} />
    <MockText size="body" lines={3} align={align} />
    {withButtons && <MockButtons align={align} />}
  </div>
);

const renderBlueprint = (section: string, layoutType: string): React.ReactNode => {
  const isHero = section === 'hero' || section === 'sparrows-closet-hero';
  const isSplit =
    section === 'mission' ||
    section === 'help' ||
    section === 'contact' ||
    section === 'sparrows-closet' ||
    section === 'sparrows-closet-info';
  const isStory = section === 'story';
  const isImpact = section === 'impact' || section === 'sparrows-closet-impact';
  const isCta = section === 'sparrows-closet-cta';

  // Hero variants
  if (isHero) {
    if (layoutType === 'layout-2') {
      return (
        <div className="mock mock--hero-bg">
          <MockImage className="mock-image--full" />
          <div className="mock-overlay">
            <TextStack align="center" titleSize="display" />
          </div>
        </div>
      );
    }
    if (layoutType === 'layout-3') {
      return (
        <div className="mock mock--split">
          <MockImage />
          <TextStack titleSize="display" />
        </div>
      );
    }
    return (
      <div className="mock mock--split">
        <TextStack titleSize="display" />
        <MockImage />
      </div>
    );
  }

  // Split content sections (mission/help/contact/etc.)
  if (isSplit) {
    if (layoutType === 'layout-2') {
      return (
        <div className="mock mock--feature">
          <MockImage className="mock-image--tall" />
          <div className="mock-panel">
            <TextStack withButtons={false} />
          </div>
        </div>
      );
    }
    if (layoutType === 'layout-3') {
      return (
        <div className="mock mock--stacked mock--spotlight">
          <TextStack align="center" withButtons={false} />
          <MockImage className="mock-image--wide" />
        </div>
      );
    }
    return (
      <div className="mock mock--split">
        <MockImage />
        <TextStack withButtons={false} />
      </div>
    );
  }

  // Story (3 cards)
  if (isStory) {
    if (layoutType === 'layout-2') {
      return (
        <div className="mock mock--story-grid">
          {[0, 1, 2].map((i) => (
            <div className="mock-card" key={i}>
              <MockImage />
              <MockText size="subtitle" />
              <MockText size="body" lines={2} />
            </div>
          ))}
        </div>
      );
    }
    if (layoutType === 'layout-3') {
      return (
        <div className="mock mock--story-alt">
          <div className="mock-row">
            <MockImage />
            <div className="mock-stack">
              <MockText size="subtitle" />
              <MockText size="body" lines={2} />
            </div>
          </div>
          <div className="mock-row mock-row--reverse">
            <MockImage />
            <div className="mock-stack">
              <MockText size="subtitle" />
              <MockText size="body" lines={2} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mock mock--story-stack">
        {[0, 1].map((i) => (
          <div className="mock-row" key={i}>
            <MockImage />
            <div className="mock-stack">
              <MockText size="subtitle" />
              <MockText size="body" lines={2} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Impact (stats)
  if (isImpact) {
    if (layoutType === 'layout-2') {
      return (
        <div className="mock mock--impact-side">
          <div className="mock-stats mock-stats--row">
            {[0, 1, 2, 3].map((i) => (
              <MockStat key={i} />
            ))}
          </div>
          <div className="mock-stack">
            <MockText size="subtitle" />
            <MockText size="body" lines={3} />
          </div>
        </div>
      );
    }
    if (layoutType === 'layout-3') {
      return (
        <div className="mock mock--stacked">
          <div className="mock-stack mock-stack--center">
            <MockText size="subtitle" align="center" />
            <MockText size="body" lines={2} align="center" />
          </div>
          <div className="mock-stats mock-stats--grid">
            {[0, 1, 2, 3].map((i) => (
              <MockStat key={i} />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="mock mock--stacked">
        <div className="mock-stats mock-stats--grid">
          {[0, 1, 2, 3].map((i) => (
            <MockStat key={i} />
          ))}
        </div>
        <MockText size="body" lines={2} align="center" />
      </div>
    );
  }

  // CTA
  if (isCta) {
    if (layoutType === 'layout-2') {
      return (
        <div className="mock mock--cta mock--cta-left">
          <TextStack />
        </div>
      );
    }
    if (layoutType === 'layout-3') {
      return (
        <div className="mock mock--split mock--cta-split">
          <div className="mock-stack">
            <MockText size="title" />
            <MockText size="body" lines={2} />
            <MockButtons />
          </div>
          <MockImage />
        </div>
      );
    }
    return (
      <div className="mock mock--cta">
        <TextStack align="center" />
      </div>
    );
  }

  // Fallback generic
  return (
    <div className="mock mock--split">
      <TextStack withButtons={false} />
      <MockImage />
    </div>
  );
};

const getLabel = (section: string, layoutType: string): string => {
  const sectionLabels: Record<string, Record<string, string>> = {
    hero: { default: 'Text Left', 'layout-1': 'Text Left', 'layout-2': 'Full Background', 'layout-3': 'Image Left' },
    mission: { default: 'Side by Side', 'layout-1': 'Side by Side', 'layout-2': 'Feature Panel', 'layout-3': 'Spotlight' },
    help: { default: 'Side by Side', 'layout-1': 'Side by Side', 'layout-2': 'Feature Panel', 'layout-3': 'Spotlight' },
    contact: { default: 'Side by Side', 'layout-1': 'Side by Side', 'layout-2': 'Feature Panel', 'layout-3': 'Spotlight' },
    story: { default: 'Vertical', 'layout-1': 'Vertical', 'layout-2': 'Grid', 'layout-3': 'Alternating' },
    impact: { default: 'Stats Grid', 'layout-1': 'Stats Grid', 'layout-2': 'Side-by-Side', 'layout-3': 'Story First' },
    'sparrows-closet': { default: 'Side by Side', 'layout-1': 'Side by Side', 'layout-2': 'Feature Panel', 'layout-3': 'Immersive' },
    'sparrows-closet-hero': { default: 'Text Left', 'layout-1': 'Text Left', 'layout-2': 'Full Background', 'layout-3': 'Image Left' },
    'sparrows-closet-info': { default: 'Side by Side', 'layout-1': 'Side by Side', 'layout-2': 'Feature Panel', 'layout-3': 'Spotlight' },
    'sparrows-closet-impact': { default: 'Stats Grid', 'layout-1': 'Stats Grid', 'layout-2': 'Side-by-Side', 'layout-3': 'Story First' },
    'sparrows-closet-cta': { default: 'Centered', 'layout-1': 'Centered', 'layout-2': 'Left Aligned', 'layout-3': 'Split' },
  };

  return (
    sectionLabels[section]?.[layoutType] ||
    (layoutType === 'default' || layoutType === 'layout-1'
      ? 'Default'
      : layoutType === 'layout-2'
        ? 'Layout 2'
        : 'Layout 3')
  );
};

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ layoutType, section, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`layout-preview ${isSelected ? 'layout-preview--selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className="layout-preview__frame">
        <div className="layout-preview__chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="layout-preview__canvas">{renderBlueprint(section, layoutType)}</div>
      </div>
      <div className="layout-preview__label">
        {getLabel(section, layoutType)}
        {isSelected && <span className="layout-preview__check" aria-hidden="true">✓</span>}
      </div>
    </button>
  );
};
