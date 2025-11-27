import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { ImageLibrary } from '../ImageLibrary';
import { LayoutPreview } from '../LayoutPreview';
import { HomePage } from '../../pages/HomePage';
import { SparrowsClosetPage } from '../../pages/SparrowsClosetPage';
import './VisualEditor.css';

// Section Layout Button Component
const SectionLayoutButton: React.FC<{ section: string; onSelect: () => void }> = ({ section, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; right?: number; left?: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      // Map section names to actual CSS class names
      const sectionClassMap: Record<string, string> = {
        hero: 'hero',
        mission: 'mission',
        help: 'help',
        story: 'story-section',
        'stats-section': 'stats-section',
        contact: 'contact',
        impact: 'impact',
        donation: 'donation',
        sponsors: 'sponsors',
        'sparrows-closet': 'sparrows-closet',
        'sparrows-closet-hero': 'sparrows-closet-hero',
        'sparrows-closet-info': 'sparrows-closet-info',
        'sparrows-closet-impact': 'sparrows-closet-impact',
        'sparrows-closet-cta': 'sparrows-closet-cta',
      };

      const className = sectionClassMap[section] || section;
      const sectionSelectors = [
        `section.${className}`,
        `section[class*="${className}"]`,
      ];
      
      let sectionElement: HTMLElement | null = null;
      for (const selector of sectionSelectors) {
        sectionElement = document.querySelector(selector) as HTMLElement;
        if (sectionElement) {
          break;
        }
      }

      if (!sectionElement) {
        setIsVisible(false);
        setPosition(null);
        return;
      }

      const preview = document.querySelector('.visual-editor__preview') as HTMLElement;
      if (!preview) {
        setIsVisible(false);
        return;
      }

      // Get the preview container (parent of preview)
      const previewContainer = preview.parentElement;
      if (!previewContainer) {
        setIsVisible(false);
        return;
      }

      // Calculate position relative to the preview container
      // Get section's position relative to the preview element
      const sectionRect = sectionElement.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      const containerRect = previewContainer.getBoundingClientRect();
      
      // Calculate position relative to the preview container
      // Account for scroll position of the preview
      const scrollTop = preview.scrollTop || 0;
      const sectionTopRelativeToPreview = sectionRect.top - previewRect.top + scrollTop;
      const top = sectionTopRelativeToPreview + 20;
      
      const sectionRightRelativeToContainer = sectionRect.right - containerRect.left;
      const containerWidth = previewContainer.clientWidth;
      const right = Math.max(20, containerWidth - sectionRightRelativeToContainer + 20);

      // Position at top-right
      setPosition({ top, right });
      // Show button if section is in viewport or close to it
      setIsVisible(true);
    };

    // Wait for sections to render, then update position
    let interval: ReturnType<typeof setInterval> | null = null;
    let scrollHandler: (() => void) | null = null;
    let resizeHandler: (() => void) | null = null;
    
    const timer = setTimeout(() => {
      updatePosition();
      
      const preview = document.querySelector('.visual-editor__preview') as HTMLElement;
      if (preview) {
        scrollHandler = () => updatePosition();
        resizeHandler = () => updatePosition();
        
        // Listen to scroll on the preview element, not window
        preview.addEventListener('scroll', scrollHandler, true);
        window.addEventListener('scroll', scrollHandler, true);
        window.addEventListener('resize', resizeHandler);
        
        // Update on interval to handle dynamic content (less frequently)
        interval = setInterval(updatePosition, 1000);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
      const preview = document.querySelector('.visual-editor__preview') as HTMLElement;
      if (preview && scrollHandler) {
        preview.removeEventListener('scroll', scrollHandler, true);
      }
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler, true);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    };
  }, [section]);

  if (!isVisible || !position) return null;

  return (
    <button
      ref={buttonRef}
      className="visual-editor__layout-button"
      style={{
        top: `${position.top}px`,
        right: position.right ? `${position.right}px` : undefined,
        left: position.left ? `${position.left}px` : undefined,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      title={`Change layout for ${section} section`}
    >
      🎨 Layout
    </button>
  );
};

interface EditableElement {
  id: string;
  type: 'image' | 'text';
  section: string;
  selector: string;
  currentValue?: string;
  imageUrl?: string;
}

interface EditModalProps {
  isOpen: boolean;
  element: EditableElement | null;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
}

const EditTextModal: React.FC<EditModalProps> = ({ isOpen, element, onClose, onSave }) => {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (element && isOpen) {
      setValue(element.currentValue || '');
    }
  }, [element, isOpen]);

  if (!isOpen || !element) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(value);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="visual-editor__modal-overlay" onClick={onClose}>
      <div className="visual-editor__modal" onClick={(e) => e.stopPropagation()}>
        <div className="visual-editor__modal-header">
          <h3>Edit Text</h3>
          <button className="visual-editor__modal-close" onClick={onClose}>×</button>
        </div>
        <div className="visual-editor__modal-body">
          <label>Content:</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={6}
            className="visual-editor__modal-textarea"
            placeholder="Enter text content..."
          />
        </div>
        <div className="visual-editor__modal-footer">
          <Button variant="outline" size="md" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EditImageModal: React.FC<EditModalProps & { imageUrl?: string; section?: string }> = ({ 
  isOpen, 
  element, 
  onClose, 
  onSave,
  imageUrl,
  section
}) => {
  if (!isOpen || !element) return null;

  const handleSelectImage = async (selectedImageUrl: string) => {
    try {
      await onSave(selectedImageUrl);
      onClose();
    } catch (error: any) {
      console.error('Error saving image:', error);
      alert(`Error saving image: ${error.message}`);
    }
  };

  return (
    <div className="visual-editor__modal-overlay" onClick={onClose}>
      <div className="visual-editor__modal visual-editor__modal--large" onClick={(e) => e.stopPropagation()}>
        <div className="visual-editor__modal-header">
          <h3>Select Image for {section || element.section}</h3>
          <button className="visual-editor__modal-close" onClick={onClose}>×</button>
        </div>
        <div className="visual-editor__modal-body">
          {imageUrl && (
            <div className="visual-editor__modal-current-image">
              <p className="visual-editor__modal-current-label">Current Image:</p>
              <div className="visual-editor__modal-image-preview">
                <img src={imageUrl} alt="Current" />
              </div>
            </div>
          )}
          <div className="visual-editor__modal-library">
            <ImageLibrary
              onSelectImage={handleSelectImage}
              currentImageUrl={imageUrl}
            />
          </div>
        </div>
        <div className="visual-editor__modal-footer">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export const VisualEditor: React.FC = () => {
  const [editMode, setEditMode] = useState(true);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editModalType, setEditModalType] = useState<'text' | 'image' | null>(null);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sectionLayouts, setSectionLayouts] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<'home' | 'sparrows-closet'>('home');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editMode) {
      // Mark editable elements after a short delay to let the page render
      setTimeout(() => {
        markEditableElements();
        loadSectionLayouts();
      }, 500);
    }
  }, [editMode, currentPage]);

  const loadSectionLayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('section_layouts')
        .select('section, layout_type');

      if (error) {
        console.error('Error loading layouts:', error);
      } else {
        const layouts: Record<string, string> = {};
        data?.forEach(item => {
          layouts[item.section] = item.layout_type || 'default';
        });
        setSectionLayouts(layouts);
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const handleLayoutChange = async (section: string, newLayout: string) => {
    try {
      const { error } = await supabase
        .from('section_layouts')
        .upsert({
          section,
          layout_type: newLayout,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setSectionLayouts(prev => ({ ...prev, [section]: newLayout }));
      alert(`Layout updated for ${section} section!`);
      // Reload page to show new layout
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating layout:', error);
      alert(`Error updating layout: ${error.message}`);
    }
  };

  const markEditableElements = () => {
    const foundElements: EditableElement[] = [];
    
    // First, find all images with data-section attribute (from DynamicImage) - this is the source of truth
    const imagesWithDataSection = document.querySelectorAll('img[data-section], .dynamic-image--placeholder[data-section]');
    imagesWithDataSection.forEach((element, index) => {
      const section = element.getAttribute('data-section');
      if (section) {
        // Skip if already marked
        if (element.hasAttribute('data-editable')) return;
        
        const id = `img-${section}-${index}`;
        element.setAttribute('data-editable', id);
        element.setAttribute('data-editable-type', 'image');
        element.setAttribute('data-editable-section', section);
        
        const imgElement = element as HTMLImageElement;
        foundElements.push({
          id,
          type: 'image',
          section,
          selector: `[data-editable="${id}"]`,
          imageUrl: imgElement.src || undefined,
        });
      }
    });

    // Find text elements that could be editable
    const textSelectors = [
      { selector: 'h1', section: 'hero' },
      { selector: 'h2', section: 'mission' },
      { selector: '.hero__title', section: 'hero' },
      { selector: '.hero__description', section: 'hero' },
      { selector: '.mission__title', section: 'mission' },
      { selector: '.mission__text', section: 'mission' },
      { selector: '.story-section__title', section: 'story' },
      { selector: '.story-section__subtitle', section: 'story' },
      { selector: '.story-section__story-title', section: 'story' },
      { selector: '.story-section__story-text', section: 'story' },
      { selector: '.stats-section__value', section: 'stats' },
      { selector: '.stats-section__label', section: 'stats' },
      { selector: '.impact__stat-value', section: 'impact' },
      { selector: '.impact__stat-label', section: 'impact' },
    ];

    textSelectors.forEach(({ selector, section: defaultSection }) => {
      const textElements = document.querySelectorAll(selector);
      textElements.forEach((el, elIndex) => {
        // Skip if already marked
        if (el.hasAttribute('data-editable')) return;
        
        const id = `text-${selector.replace(/[^a-zA-Z0-9]/g, '-')}-${elIndex}`;
        el.setAttribute('data-editable', id);
        el.setAttribute('data-editable-type', 'text');
        
        // Try to find section from parent
        const section = el.closest('section')?.className.split(' ')[0]?.replace('__', '-') || defaultSection;
        el.setAttribute('data-editable-section', section);
        
        // Store current text content
        const currentValue = el.textContent || '';
        if (currentValue.trim()) {
          foundElements.push({
            id,
            type: 'text',
            section,
            selector: `[data-editable="${id}"]`,
            currentValue,
          });
        }
      });
    });

    setEditableElements(foundElements);
  };

  const handleElementClick = (e: React.MouseEvent) => {
    if (!editMode) return;

    const target = e.target as HTMLElement;
    
    // Don't trigger if clicking on layout button
    if (target.closest('.visual-editor__layout-button')) {
      return;
    }
    
    // Check if the clicked element itself is editable
    let editableId = target.getAttribute('data-editable');
    let editableType = target.getAttribute('data-editable-type');
    let editableSection = target.getAttribute('data-editable-section');
    
    // If not, check parent elements
    if (!editableId) {
      const parent = target.closest('[data-editable]');
      if (parent) {
        editableId = parent.getAttribute('data-editable');
        editableType = parent.getAttribute('data-editable-type');
        editableSection = parent.getAttribute('data-editable-section');
      }
    }
    
    // Also check for images with data-section (from DynamicImage)
    // Check both IMG tags and placeholder divs
    if (!editableId) {
      let dataSection: string | null = null;
      
      if (target.tagName === 'IMG') {
        dataSection = target.getAttribute('data-section');
      } else {
        // Check if it's a placeholder div or if we clicked inside one
        const placeholderDiv = target.closest('.dynamic-image--placeholder');
        if (placeholderDiv) {
          dataSection = placeholderDiv.getAttribute('data-section');
        } else {
          // Check if the target itself has data-section
          dataSection = target.getAttribute('data-section');
        }
      }
      
      if (dataSection) {
        // The data-section attribute is the actual section name we should use
        // For story images: story-1, story-2, story-3 (these are correct)
        // For other images: hero, mission, help, contact, etc. (these are correct)
        editableId = `img-${dataSection}-0`;
        editableType = 'image';
        editableSection = dataSection; // Use the data-section value directly
      }
    }
    
    if (!editableId || !editableType) return;

    e.preventDefault();
    e.stopPropagation();

    // Find or create element
    let element = editableElements.find(el => el.id === editableId);
    
    if (!element && editableType === 'image' && editableSection) {
      // Create element on the fly for images
      element = {
        id: editableId,
        type: 'image',
        section: editableSection,
        selector: `[data-section="${editableSection}"]`,
        imageUrl: (target as HTMLImageElement).src,
      };
    } else if (!element && editableType === 'text' && editableSection) {
      // Create element on the fly for text
      element = {
        id: editableId,
        type: 'text',
        section: editableSection,
        selector: `[data-editable="${editableId}"]`,
        currentValue: target.textContent || '',
      };
    }
    
    if (element) {
      setSelectedElement(element);
      setEditModalType(element.type);
    }
  };

  const handleSaveText = async (_value: string) => {
    // For now, text editing would require a section_content table
    // This is a placeholder showing how it would work
    alert('Text editing requires a content management system. This feature is coming soon!');
  };

  const handleSaveImage = async (imageUrl: string) => {
    if (!selectedElement) return;

    const targetSection = selectedElement.section;
    
    try {
      // STEP 1: Find ALL existing entries for this section + URL (including duplicates)
      const { data: allExistingImages } = await supabase
        .from('images')
        .select('*')
        .eq('section', targetSection)
        .eq('url', imageUrl);

      // STEP 2: If duplicates exist, delete all but the first one
      if (allExistingImages && allExistingImages.length > 1) {
        // Keep the first one, delete the rest
        const idsToDelete = allExistingImages.slice(1).map(img => img.id);
        const { error: deleteError } = await supabase
          .from('images')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }

      // STEP 3: Now check if we have an entry (after cleanup)
      const { data: existingImage } = await supabase
        .from('images')
        .select('*')
        .eq('section', targetSection)
        .eq('url', imageUrl)
        .limit(1)
        .maybeSingle();

      if (existingImage) {
        // Image exists - reactivate it and deactivate others for this section
        // First, deactivate all other active images for this section
        const { data: otherActiveImages } = await supabase
          .from('images')
          .select('id')
          .eq('section', targetSection)
          .eq('is_active', true)
          .neq('id', existingImage.id);

        if (otherActiveImages && otherActiveImages.length > 0) {
          const { error: deactivateError } = await supabase
            .from('images')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .in('id', otherActiveImages.map(img => img.id));

          if (deactivateError) throw deactivateError;
        }

        // Reactivate the existing image
        const { error } = await supabase
          .from('images')
          .update({ 
            is_active: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingImage.id);

        if (error) throw error;
      } else {
        // Image doesn't exist for this section - create it
        // First, deactivate all other active images for this section
        const { data: otherActiveImages } = await supabase
          .from('images')
          .select('id')
          .eq('section', targetSection)
          .eq('is_active', true);

        if (otherActiveImages && otherActiveImages.length > 0) {
          const { error: deactivateError } = await supabase
            .from('images')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .in('id', otherActiveImages.map(img => img.id));

          if (deactivateError) throw deactivateError;
        }

        // Create new entry
        const { error } = await supabase
          .from('images')
          .insert({
            section: targetSection,
            url: imageUrl,
            alt_text: `${targetSection} image`,
            order_index: 0,
            is_active: true,
          });

        if (error) {
          // If it's a duplicate key error, try to find and reactivate existing
          if (error.code === '23505' || error.message?.includes('duplicate')) {
            const { data: foundImage } = await supabase
              .from('images')
              .select('*')
              .eq('section', targetSection)
              .eq('url', imageUrl)
              .limit(1)
              .maybeSingle();
            
            if (foundImage) {
              const { error: updateError } = await supabase
                .from('images')
                .update({ is_active: true, updated_at: new Date().toISOString() })
                .eq('id', foundImage.id);
              
              if (updateError) throw updateError;
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }
      }

      // Reload the page to show updated image
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving image:', error);
      alert(`Error saving image: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="visual-editor">
      <div className="visual-editor__toolbar">
        <div className="visual-editor__toolbar-left">
          <h2 className="visual-editor__title">Visual Editor</h2>
          <p className="visual-editor__subtitle">Click on any text or image to edit it</p>
        </div>
        <div className="visual-editor__toolbar-right">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setCurrentPage(currentPage === 'home' ? 'sparrows-closet' : 'home')}
          >
            {currentPage === 'home' ? '🦅 Sparrows Closet' : '🏠 My Refuge'}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowImageLibrary(true)}
          >
            🖼️ Image Library
          </Button>
          <Button
            variant={editMode ? 'primary' : 'outline'}
            size="md"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '✏️ Edit Mode: ON' : '👁️ Preview Mode'}
          </Button>
        </div>
      </div>

      {editMode && (
        <div className="visual-editor__instructions">
          <div className="visual-editor__instruction-item">
            <span className="visual-editor__instruction-icon">🖱️</span>
            <span>Click on any image or text to edit it</span>
          </div>
          <div className="visual-editor__instruction-item">
            <span className="visual-editor__instruction-icon">✨</span>
            <span>Editable elements are highlighted on hover</span>
          </div>
          <div className="visual-editor__instruction-item">
            <span className="visual-editor__instruction-icon">🎨</span>
            <span>Click floating buttons on sections to change layouts</span>
          </div>
          <div className="visual-editor__instruction-item">
            <span className="visual-editor__instruction-icon">💾</span>
            <span>Changes are saved automatically</span>
          </div>
        </div>
      )}

      <div className="visual-editor__preview-container">
        <div 
          ref={previewRef}
          className={`visual-editor__preview ${editMode ? 'visual-editor__preview--edit-mode' : ''}`}
          onClick={handleElementClick}
        >
          {currentPage === 'home' ? (
            <HomePage />
          ) : (
            <SparrowsClosetPage />
          )}
        </div>
        
        {editMode && currentPage === 'home' && (
          <>
            <SectionLayoutButton section="hero" onSelect={() => setSelectedSection('hero')} />
            <SectionLayoutButton section="stats-section" onSelect={() => setSelectedSection('stats')} />
            <SectionLayoutButton section="mission" onSelect={() => setSelectedSection('mission')} />
            <SectionLayoutButton section="story" onSelect={() => setSelectedSection('story')} />
            <SectionLayoutButton section="help" onSelect={() => setSelectedSection('help')} />
            <SectionLayoutButton section="impact" onSelect={() => setSelectedSection('impact')} />
            <SectionLayoutButton section="contact" onSelect={() => setSelectedSection('contact')} />
          </>
        )}
        {editMode && currentPage === 'sparrows-closet' && (
          <>
            <SectionLayoutButton section="sparrows-closet-hero" onSelect={() => setSelectedSection('sparrows-closet-hero')} />
            <SectionLayoutButton section="sparrows-closet-info" onSelect={() => setSelectedSection('sparrows-closet-info')} />
            <SectionLayoutButton section="sparrows-closet-impact" onSelect={() => setSelectedSection('sparrows-closet-impact')} />
            <SectionLayoutButton section="sparrows-closet-cta" onSelect={() => setSelectedSection('sparrows-closet-cta')} />
          </>
        )}
      </div>

      {editModalType === 'text' && (
        <EditTextModal
          isOpen={!!selectedElement}
          element={selectedElement}
          onClose={() => {
            setSelectedElement(null);
            setEditModalType(null);
          }}
          onSave={handleSaveText}
        />
      )}

      {editModalType === 'image' && (
        <EditImageModal
          isOpen={!!selectedElement}
          element={selectedElement}
          imageUrl={selectedElement?.imageUrl}
          section={selectedElement?.section}
          onClose={() => {
            setSelectedElement(null);
            setEditModalType(null);
          }}
          onSave={handleSaveImage}
        />
      )}

      {showImageLibrary && (
        <div className="visual-editor__library-overlay" onClick={() => setShowImageLibrary(false)}>
          <div className="visual-editor__library-modal" onClick={(e) => e.stopPropagation()}>
            <div className="visual-editor__library-header">
              <h3>Image Library</h3>
              <button className="visual-editor__modal-close" onClick={() => setShowImageLibrary(false)}>×</button>
            </div>
            <div className="visual-editor__library-body">
              <ImageLibrary
                onSelectImage={() => {}}
                onUpload={() => {
                  // Refresh after upload
                }}
              />
            </div>
          </div>
        </div>
      )}

      {selectedSection && (
        <div className="visual-editor__layout-overlay" onClick={() => setSelectedSection(null)}>
          <div className="visual-editor__layout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="visual-editor__layout-header">
              <h3>Layout Options for {selectedSection}</h3>
              <button className="visual-editor__modal-close" onClick={() => setSelectedSection(null)}>×</button>
            </div>
            <div className="visual-editor__layout-body">
              <div className="visual-editor__layout-previews">
                {['default', 'layout-2', 'layout-3'].map((layout) => (
                  <div
                    key={layout}
                    className={`visual-editor__layout-preview-item ${sectionLayouts[selectedSection] === layout ? 'visual-editor__layout-preview-item--active' : ''}`}
                    onClick={() => handleLayoutChange(selectedSection, layout)}
                  >
                    <LayoutPreview
                      layoutType={layout}
                      section={selectedSection as any}
                      isSelected={sectionLayouts[selectedSection] === layout}
                      onClick={() => handleLayoutChange(selectedSection, layout)}
                    />
                    <p className="visual-editor__layout-label">{layout === 'default' ? 'Default' : layout === 'layout-2' ? 'Layout 2' : 'Layout 3'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

