import React from 'react';
import './LayoutPreview.css';

interface LayoutPreviewProps {
  layoutType: string;
  section: string;
  isSelected: boolean;
  onClick: () => void;
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({
  layoutType,
  section,
  isSelected,
  onClick,
}) => {
  const getWireframe = () => {
    // Hero, Sparrows Closet Hero, Sparrows Closet Section
    if (section === 'hero' || section === 'sparrows-closet-hero' || section === 'sparrows-closet') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--two-col">
            <div className="layout-preview__block layout-preview__block--text">Text</div>
            <div className="layout-preview__block layout-preview__block--image">Image</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--hero-centered">
            <div className="layout-preview__block layout-preview__block--bg">Background</div>
            <div className="layout-preview__block layout-preview__block--centered">Centered</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--two-col-reverse">
            <div className="layout-preview__block layout-preview__block--image">Image</div>
            <div className="layout-preview__block layout-preview__block--text">Text</div>
          </div>
        );
      }
    }
    // Mission, Help, Contact, Sparrows Closet Info
    else if (section === 'mission' || section === 'help' || section === 'contact' || section === 'sparrows-closet-info') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--two-col">
            <div className="layout-preview__block layout-preview__block--image">Image</div>
            <div className="layout-preview__block layout-preview__block--text">Text</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--two-col-reverse">
            <div className="layout-preview__block layout-preview__block--text">Text</div>
            <div className="layout-preview__block layout-preview__block--image">Image</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--stacked">
            <div className="layout-preview__block layout-preview__block--text-full">Text</div>
            <div className="layout-preview__block layout-preview__block--image-full">Image</div>
          </div>
        );
      }
    }
    // Story Section
    else if (section === 'story') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--stacked">
            <div className="layout-preview__block layout-preview__block--card">Card 1</div>
            <div className="layout-preview__block layout-preview__block--card">Card 2</div>
            <div className="layout-preview__block layout-preview__block--card">Card 3</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--grid">
            <div className="layout-preview__block layout-preview__block--card">Card 1</div>
            <div className="layout-preview__block layout-preview__block--card">Card 2</div>
            <div className="layout-preview__block layout-preview__block--card">Card 3</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--alternating">
            <div className="layout-preview__block layout-preview__block--card-alt">Card 1</div>
            <div className="layout-preview__block layout-preview__block--card-alt-reverse">Card 2</div>
            <div className="layout-preview__block layout-preview__block--card-alt">Card 3</div>
          </div>
        );
      }
    }
    // Impact Section
    else if (section === 'impact') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--impact-grid">
            <div className="layout-preview__block layout-preview__block--stat">Stat 1</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 2</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 3</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 4</div>
            <div className="layout-preview__block layout-preview__block--story-full">Story</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--impact-side">
            <div className="layout-preview__block layout-preview__block--stats-row">Stats</div>
            <div className="layout-preview__block layout-preview__block--story-side">Story</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--impact-reverse">
            <div className="layout-preview__block layout-preview__block--story-full">Story</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 1</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 2</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 3</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 4</div>
          </div>
        );
      }
    }
    // Sparrows Closet Impact
    else if (section === 'sparrows-closet-impact') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--stats-row">
            <div className="layout-preview__block layout-preview__block--stat">Stat 1</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 2</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 3</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--stacked">
            <div className="layout-preview__block layout-preview__block--stat">Stat 1</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 2</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 3</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--impact-grid">
            <div className="layout-preview__block layout-preview__block--stat">Stat 1</div>
            <div className="layout-preview__block layout-preview__block--stat">Stat 2</div>
            <div className="layout-preview__block layout-preview__block--stat-large">Stat 3</div>
          </div>
        );
      }
    }
    // Sparrows Closet CTA
    else if (section === 'sparrows-closet-cta') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--centered">
            <div className="layout-preview__block layout-preview__block--centered">Centered</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--left">
            <div className="layout-preview__block layout-preview__block--left">Left</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--split">
            <div className="layout-preview__block layout-preview__block--text">Text</div>
            <div className="layout-preview__block layout-preview__block--decorative">Icon</div>
          </div>
        );
      }
    }
    return null;
  };

  const getLabel = () => {
    const sectionLabels: Record<string, Record<string, string>> = {
      hero: {
        'default': 'Text Left',
        'layout-1': 'Text Left',
        'layout-2': 'Full Background',
        'layout-3': 'Image Left',
      },
      mission: {
        'default': 'Image Left',
        'layout-1': 'Image Left',
        'layout-2': 'Text Left',
        'layout-3': 'Centered',
      },
      help: {
        'default': 'Text Left',
        'layout-1': 'Text Left',
        'layout-2': 'Image Left',
        'layout-3': 'Centered',
      },
      contact: {
        'default': 'Text Left',
        'layout-1': 'Text Left',
        'layout-2': 'Image Left',
        'layout-3': 'Centered',
      },
      story: {
        'default': 'Vertical',
        'layout-1': 'Vertical',
        'layout-2': 'Grid',
        'layout-3': 'Alternating',
      },
      impact: {
        'default': 'Stats Grid',
        'layout-1': 'Stats Grid',
        'layout-2': 'Side-by-Side',
        'layout-3': 'Story First',
      },
      'sparrows-closet': {
        'default': 'Image Left',
        'layout-1': 'Image Left',
        'layout-2': 'Text Left',
        'layout-3': 'Background',
      },
      'sparrows-closet-hero': {
        'default': 'Text Left',
        'layout-1': 'Text Left',
        'layout-2': 'Full Background',
        'layout-3': 'Image Left',
      },
      'sparrows-closet-info': {
        'default': 'Text Left',
        'layout-1': 'Text Left',
        'layout-2': 'Image Left',
        'layout-3': 'Centered',
      },
      'sparrows-closet-impact': {
        'default': 'Horizontal',
        'layout-1': 'Horizontal',
        'layout-2': 'Vertical',
        'layout-3': 'Grid',
      },
      'sparrows-closet-cta': {
        'default': 'Centered',
        'layout-1': 'Centered',
        'layout-2': 'Left',
        'layout-3': 'Split',
      },
    };

    return sectionLabels[section]?.[layoutType] || 
           (layoutType === 'default' || layoutType === 'layout-1' ? 'Default' : 
            layoutType === 'layout-2' ? 'Layout 2' : 'Layout 3');
  };

  return (
    <button
      type="button"
      className={`layout-preview ${isSelected ? 'layout-preview--selected' : ''}`}
      onClick={onClick}
    >
      <div className="layout-preview__wireframe-container">
        {getWireframe()}
      </div>
      <div className="layout-preview__label">{getLabel()}</div>
    </button>
  );
};

