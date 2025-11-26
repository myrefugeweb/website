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
    if (section === 'hero') {
      if (layoutType === 'default' || layoutType === 'layout-1') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--hero-default">
            <div className="layout-preview__block layout-preview__block--text">Text</div>
            <div className="layout-preview__block layout-preview__block--image">Image</div>
          </div>
        );
      } else if (layoutType === 'layout-2') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--hero-centered">
            <div className="layout-preview__block layout-preview__block--bg">Background</div>
            <div className="layout-preview__block layout-preview__block--centered">Centered Content</div>
          </div>
        );
      } else if (layoutType === 'layout-3') {
        return (
          <div className="layout-preview__wireframe layout-preview__wireframe--hero-reverse">
            <div className="layout-preview__block layout-preview__block--image">Image</div>
            <div className="layout-preview__block layout-preview__block--text">Text</div>
          </div>
        );
      }
    } else if (section === 'mission' || section === 'help') {
      if (layoutType === 'default') {
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
            <div className="layout-preview__block layout-preview__block--image-full">Image</div>
            <div className="layout-preview__block layout-preview__block--text-full">Text</div>
          </div>
        );
      }
    }
    return null;
  };

  const getLabel = () => {
    const labels: Record<string, string> = {
      'default': 'Default',
      'layout-1': 'Default',
      'layout-2': 'Centered',
      'layout-3': 'Reversed',
    };
    return labels[layoutType] || layoutType;
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

