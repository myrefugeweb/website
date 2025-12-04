import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { ImageLibrary } from '../ImageLibrary';
import { LayoutPreview } from '../LayoutPreview';
import { HomePage } from '../../pages/HomePage';
import { SparrowsClosetPage } from '../../pages/SparrowsClosetPage';
import { StagingProvider } from '../../contexts/StagingContext';
import './VisualEditor.css';

// Section Layout Button Component
const SectionLayoutButton: React.FC<{ section: string; onSelect: () => void; isUnpublished?: boolean }> = ({ section, onSelect, isUnpublished }) => {
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
      
      // Calculate section's position relative to container
      const sectionLeftRelativeToContainer = sectionRect.left - containerRect.left;
      const sectionRightRelativeToContainer = sectionRect.right - containerRect.left;
      const containerWidth = previewContainer.clientWidth;
      
      const minMargin = 20; // Minimum distance from edges
      
      // Position the container to span the full width of the section (with margins)
      const left = sectionLeftRelativeToContainer + minMargin;
      const right = containerWidth - sectionRightRelativeToContainer + minMargin;
      
      setPosition({ top, left, right });
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
    <div style={{
      position: 'absolute',
      top: `${position.top}px`,
      left: position.left !== undefined ? `${position.left}px` : '20px',
      right: position.right !== undefined ? `${position.right}px` : '20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem',
      zIndex: 1000,
      width: position.left !== undefined && position.right !== undefined 
        ? `calc(100% - ${position.left + position.right}px)` 
        : 'auto',
    }}>
      <button
        ref={buttonRef}
        className="visual-editor__layout-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }}
        title={`Change layout for ${section} section`}
        style={{
          flexShrink: 0,
        }}
      >
        <span className="visual-editor__layout-button-icon">🎨</span>
        <span className="visual-editor__layout-button-text">Layout</span>
      </button>
      {isUnpublished && (
        <span style={{
          display: 'inline-block',
          padding: '0.25rem 0.5rem',
          background: '#FFC107',
          color: '#856404',
          fontSize: '0.75rem',
          fontWeight: 600,
          borderRadius: '0.25rem',
          border: '1px solid #FFA000',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}>
          Unpublished
        </span>
      )}
    </div>
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
  const [isHtml, setIsHtml] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (element && isOpen) {
      const currentValue = element.currentValue || '';
      setValue(currentValue);
      // Check if content contains HTML tags
      setIsHtml(/<[^>]+>/.test(currentValue));
      setError(null);
      setSuccess(false);
    }
  }, [element, isOpen]);

  if (!isOpen || !element) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(value);
      setSuccess(true);
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error saving:', err);
      setError(err.message || 'Error saving changes. Please try again.');
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
          {isHtml && (
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              HTML detected. You can use HTML tags like &lt;span&gt; for formatting.
            </p>
          )}
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            rows={6}
            className="visual-editor__modal-textarea"
            placeholder="Enter text content..."
            disabled={saving}
          />
          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#FEE',
              border: '1px solid #FCC',
              borderRadius: '0.5rem',
              color: '#C33',
              fontSize: '0.875rem',
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {success && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#EFE',
              border: '1px solid #CFC',
              borderRadius: '0.5rem',
              color: '#3C3',
              fontSize: '0.875rem',
            }}>
              <strong>✓ Saved!</strong> Changes will appear immediately. Click "Publish Changes" to make them live.
            </div>
          )}
        </div>
        <div className="visual-editor__modal-footer">
          <Button variant="outline" size="md" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving || success}>
            {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !element) return null;

  const handleSelectImage = async (selectedImageUrl: string) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(selectedImageUrl);
      setSuccess(true);
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error saving image:', err);
      setError(err.message || 'Error saving image. Please try again.');
    } finally {
      setSaving(false);
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
          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#FEE',
              border: '1px solid #FCC',
              borderRadius: '0.5rem',
              color: '#C33',
              fontSize: '0.875rem',
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {success && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#EFE',
              border: '1px solid #CFC',
              borderRadius: '0.5rem',
              color: '#3C3',
              fontSize: '0.875rem',
            }}>
              <strong>✓ Image saved!</strong> Changes will appear immediately. Click "Publish Changes" to make them live.
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
          <Button variant="outline" size="md" onClick={onClose} disabled={saving}>
            {success ? 'Close' : 'Cancel'}
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
  const [unpublishedSections, setUnpublishedSections] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<'home' | 'sparrows-closet'>('home');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load unpublished changes on component mount and when page changes
  useEffect(() => {
    loadAllUnpublishedChanges();
  }, [currentPage]);

  useEffect(() => {
    if (editMode) {
      // Mark editable elements after a short delay to let the page render
      setTimeout(() => {
        markEditableElements();
      }, 500);
    }
  }, [editMode, currentPage]);

  const loadAllUnpublishedChanges = async () => {
    const unpublished = new Set<string>();
    const layouts: Record<string, string> = {};

    try {
      // Load layouts and check for unpublished changes
      const { data: layoutData, error: layoutError } = await supabase
        .from('section_layouts')
        .select('section, layout_type, has_unpublished_changes');

      if (!layoutError && layoutData) {
        layoutData.forEach(item => {
          layouts[item.section] = item.layout_type || 'default';
          if (item.has_unpublished_changes) {
            unpublished.add(item.section);
          }
        });
      }

      // Load images and check for unpublished changes
      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('section, has_unpublished_changes')
        .eq('has_unpublished_changes', true);

      if (!imageError && imageData) {
        imageData.forEach(item => {
          unpublished.add(item.section);
        });
      }

      // Load content and check for unpublished changes
      try {
        const { data: contentData, error: contentError } = await supabase
          .from('section_content')
          .select('section, has_unpublished_changes')
          .eq('has_unpublished_changes', true);

        if (!contentError && contentData) {
          contentData.forEach(item => {
            unpublished.add(item.section);
          });
        }
      } catch (contentError: any) {
        // Silently ignore if table doesn't exist (PGRST205)
        if (contentError?.code !== 'PGRST205') {
          console.error('Error loading content:', contentError);
        }
      }

      setSectionLayouts(layouts);
      setUnpublishedSections(unpublished);
    } catch (error) {
      console.error('Error loading unpublished changes:', error);
    }
  };

  const handleLayoutChange = async (section: string, newLayout: string) => {
    try {
      // First, check if the section exists and get published layout
      const { data: existing } = await supabase
        .from('section_layouts')
        .select('section, published_layout_type')
        .eq('section', section)
        .maybeSingle();

      const publishedLayout = existing?.published_layout_type || 'default';
      const hasChanges = newLayout !== publishedLayout;

      if (existing) {
        // Update existing - save to staging
        const { error } = await supabase
          .from('section_layouts')
          .update({
            layout_type: newLayout,
            has_unpublished_changes: hasChanges,
            updated_at: new Date().toISOString(),
          })
          .eq('section', section);

        if (error) throw error;
      } else {
        // Insert new - set both staging and published to same value initially
        const { error } = await supabase
          .from('section_layouts')
          .insert({
            section,
            layout_type: newLayout,
            published_layout_type: newLayout,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }
      
      setSectionLayouts(prev => ({ ...prev, [section]: newLayout }));
      
      // Update unpublished sections set
      if (hasChanges) {
        setUnpublishedSections(prev => new Set(prev).add(section));
      } else {
        setUnpublishedSections(prev => {
          const next = new Set(prev);
          next.delete(section);
          return next;
        });
      }
      
      // Reload page to show new layout (layout changes require full reload)
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating layout:', error);
      // Error will be visible in console, page reload will show previous state
    }
  };

  const handlePublishAll = async () => {
    if (unpublishedSections.size === 0) {
      return;
    }

    setPublishing(true);
    setPublishError(null);
    try {
      // Get all current staging layouts
      const { data: stagingLayouts, error: fetchError } = await supabase
        .from('section_layouts')
        .select('section, layout_type')
        .in('section', Array.from(unpublishedSections));

      if (fetchError) throw fetchError;

      // Publish all staging layouts
      for (const layout of stagingLayouts || []) {
        const { error: updateError } = await supabase
          .from('section_layouts')
          .update({
            published_layout_type: layout.layout_type,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('section', layout.section);

        if (updateError) {
          console.error(`Error publishing ${layout.section}:`, updateError);
        }
      }

      // Also publish any unpublished image changes
      const { data: unpublishedImages, error: imagesError } = await supabase
        .from('images')
        .select('id, is_active')
        .eq('has_unpublished_changes', true);

      if (!imagesError && unpublishedImages) {
        for (const image of unpublishedImages) {
          await supabase
            .from('images')
            .update({
              published_is_active: image.is_active,
              has_unpublished_changes: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', image.id);
        }
      }

      // Also publish any unpublished text content changes
      // Only try if table exists (ignore errors if table doesn't exist)
      try {
        const { data: unpublishedContent, error: contentError } = await supabase
          .from('section_content')
          .select('section, content_key, content_value')
          .eq('has_unpublished_changes', true);

        if (!contentError && unpublishedContent) {
          for (const content of unpublishedContent) {
            await supabase
              .from('section_content')
              .update({
                published_content_value: content.content_value,
                has_unpublished_changes: false,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('section', content.section)
              .eq('content_key', content.content_key);
          }
        }
      } catch (contentError: any) {
        // Silently ignore if table doesn't exist (PGRST205)
        if (contentError?.code !== 'PGRST205') {
          console.error('Error publishing content:', contentError);
        }
      }

      // Reload all unpublished changes to update the UI
      await loadAllUnpublishedChanges();
      
      // Clear unpublished sections (should be empty now)
      setUnpublishedSections(new Set());
      
      // No need to reload - the state update will refresh the UI
    } catch (error: any) {
      console.error('Error publishing changes:', error);
      setPublishError(error.message || 'Failed to publish changes. Please try again.');
    } finally {
      setPublishing(false);
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

  const handleSaveText = async (value: string) => {
    if (!selectedElement) return;

    const targetSection = selectedElement.section;
    // Extract content key from element ID (e.g., 'text-hero__title-0' -> 'title')
    // Or use a more specific mapping
    const elementId = selectedElement.id;
    const contentKey = getContentKeyFromElementId(elementId, targetSection);

    try {
      // Check if content exists
      const { data: existing } = await supabase
        .from('section_content')
        .select('published_content_value')
        .eq('section', targetSection)
        .eq('content_key', contentKey)
        .maybeSingle();

      const publishedValue = existing?.published_content_value || '';
      const hasChanges = value !== publishedValue;

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('section_content')
          .update({
            content_value: value,
            has_unpublished_changes: hasChanges,
            updated_at: new Date().toISOString(),
          })
          .eq('section', targetSection)
          .eq('content_key', contentKey);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('section_content')
          .insert({
            section: targetSection,
            content_key: contentKey,
            content_value: value,
            published_content_value: value,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Trigger content update event to reload React components immediately
      const updateEvent = new CustomEvent('content-updated', {
        detail: { section: targetSection, contentKey, value }
      });
      window.dispatchEvent(updateEvent);

      // Also update the DOM directly for instant visual feedback
      // Use requestAnimationFrame to ensure we update after React finishes rendering
      requestAnimationFrame(() => {
        // Try multiple ways to find the element
        let element = document.querySelector(selectedElement.selector) as HTMLElement;
        
        // Fallback: try finding by section and content key
        if (!element && targetSection === 'hero' && contentKey === 'title') {
          element = document.querySelector('.hero__title') as HTMLElement;
        }
        if (!element && targetSection === 'hero' && contentKey === 'description') {
          element = document.querySelector('.hero__description') as HTMLElement;
        }
        
        if (element) {
          // For hero title and other elements that use dangerouslySetInnerHTML, always use innerHTML
          // Check if it's a hero title or if the value contains HTML
          const isHeroTitle = targetSection === 'hero' && contentKey === 'title';
          const containsHtml = /<[^>]+>/.test(value);
          
          if (isHeroTitle || containsHtml) {
            element.innerHTML = value;
          } else {
            element.textContent = value;
          }
        }
      });

      // Reload all unpublished changes to ensure state is accurate
      await loadAllUnpublishedChanges();

      // Don't close modal here - let the modal handle it after showing success
      // The modal will close itself after showing the success message
    } catch (error: any) {
      console.error('Error saving text:', error);
      
      // Handle missing table gracefully
      if (error.code === 'PGRST205') {
        throw new Error('Database table not found. Please run the SQL migration:\n\n1. Go to Supabase Dashboard → SQL Editor\n2. Run the SQL from: backend/sql/add_section_content.sql\n\nText editing will work after the migration is complete.');
      }
      throw error;
    }
  };

  // Helper function to map element IDs to content keys
  const getContentKeyFromElementId = (elementId: string, section: string): string => {
    // Map common patterns to content keys
    if (elementId.includes('hero__title') || elementId.includes('h1')) {
      return 'title';
    }
    if (elementId.includes('hero__description')) {
      return 'description';
    }
    if (elementId.includes('mission__title') || (section === 'mission' && elementId.includes('h2'))) {
      return 'title';
    }
    if (elementId.includes('mission__text')) {
      // For multiple paragraphs, use index
      const match = elementId.match(/mission__text-(\d+)/);
      return match ? `text-${match[1]}` : 'text-1';
    }
    if (elementId.includes('story-section__title')) {
      return 'title';
    }
    if (elementId.includes('story-section__subtitle')) {
      return 'subtitle';
    }
    if (elementId.includes('story-section__story-title')) {
      const match = elementId.match(/story-section__story-title-(\d+)/);
      return match ? `story-title-${match[1]}` : 'story-title-1';
    }
    if (elementId.includes('story-section__story-text')) {
      const match = elementId.match(/story-section__story-text-(\d+)/);
      return match ? `story-text-${match[1]}` : 'story-text-1';
    }
    if (elementId.includes('stats-section__value')) {
      const match = elementId.match(/stats-section__value-(\d+)/);
      return match ? `stat-value-${match[1]}` : 'stat-value-1';
    }
    if (elementId.includes('stats-section__label')) {
      const match = elementId.match(/stats-section__label-(\d+)/);
      return match ? `stat-label-${match[1]}` : 'stat-label-1';
    }
    if (elementId.includes('impact__stat-value')) {
      const match = elementId.match(/impact__stat-value-(\d+)/);
      return match ? `stat-value-${match[1]}` : 'stat-value-1';
    }
    if (elementId.includes('impact__stat-label')) {
      const match = elementId.match(/impact__stat-label-(\d+)/);
      return match ? `stat-label-${match[1]}` : 'stat-label-1';
    }
    
    // Default: use element ID as content key (sanitized)
    return elementId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
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

        // Reactivate the existing image and mark as unpublished if different from published
        // Check if the new state (is_active=true) differs from published state
        const hasUnpublishedChanges = existingImage.published_is_active !== true;

        const { error } = await supabase
          .from('images')
          .update({ 
            is_active: true,
            has_unpublished_changes: hasUnpublishedChanges,
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

        // Create new entry - mark as unpublished since it's new
        const { error } = await supabase
          .from('images')
          .insert({
            section: targetSection,
            url: imageUrl,
            alt_text: `${targetSection} image`,
            order_index: 0,
            is_active: true,
            published_is_active: false,
            has_unpublished_changes: true,
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

      // Update the image in the preview without reloading the page
      // Find all image elements for this section and update their src
      const imageElements = document.querySelectorAll(
        `img[data-section="${targetSection}"], .dynamic-image--placeholder[data-section="${targetSection}"]`
      );
      
      imageElements.forEach((element) => {
        if (element instanceof HTMLImageElement) {
          // Update existing image src
          element.src = imageUrl + '?t=' + Date.now(); // Add cache bust
          element.style.display = 'block';
        } else if (element.classList.contains('dynamic-image--placeholder')) {
          // Replace placeholder div with actual image
          const img = document.createElement('img');
          img.src = imageUrl + '?t=' + Date.now(); // Add cache bust
          img.alt = `${targetSection} image`;
          img.className = 'dynamic-image';
          img.setAttribute('data-section', targetSection);
          img.setAttribute('data-editable-type', 'image');
          img.setAttribute('data-editable', 'true');
          img.loading = 'lazy';
          
          // Replace the placeholder
          if (element.parentNode) {
            element.parentNode.replaceChild(img, element);
          }
        }
      });
      
      // Reload all unpublished changes to ensure state is accurate
      await loadAllUnpublishedChanges();
      
      // Don't close modal here - let the modal handle it after showing success
      // The modal will close itself after showing the success message
    } catch (error: any) {
      console.error('Error saving image:', error);
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
          {unpublishedSections.size > 0 && (
            <div className="visual-editor__unpublished-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#FFF3CD',
              border: '1px solid #FFC107',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#856404',
              marginRight: '1rem',
            }}>
              <span>⚠️</span>
              <span>{unpublishedSections.size} Unpublished Change{unpublishedSections.size > 1 ? 's' : ''}</span>
            </div>
          )}
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
          {unpublishedSections.size > 0 && (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={handlePublishAll}
                disabled={publishing}
                style={{
                  background: '#28A745',
                  borderColor: '#28A745',
                }}
                title={publishError || undefined}
              >
                {publishing ? '⏳ Publishing...' : '🚀 Publish Changes'}
              </Button>
              {publishError && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: '#FEE',
                  border: '1px solid #FCC',
                  borderRadius: '0.5rem',
                  color: '#C33',
                  fontSize: '0.875rem',
                  zIndex: 1000,
                  maxWidth: '300px',
                }}>
                  <strong>Error:</strong> {publishError}
                </div>
              )}
            </>
          )}
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowHelpModal(true)}
            title="View help and instructions"
          >
            ❓ Help
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

      <div className="visual-editor__preview-container">
        <StagingProvider stagingMode={true}>
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
        </StagingProvider>
        
        {editMode && currentPage === 'home' && (
          <>
            <SectionLayoutButton section="hero" onSelect={() => setSelectedSection('hero')} isUnpublished={unpublishedSections.has('hero')} />
            <SectionLayoutButton section="stats-section" onSelect={() => setSelectedSection('stats')} isUnpublished={unpublishedSections.has('stats-section')} />
            <SectionLayoutButton section="mission" onSelect={() => setSelectedSection('mission')} isUnpublished={unpublishedSections.has('mission')} />
            <SectionLayoutButton section="story" onSelect={() => setSelectedSection('story')} isUnpublished={unpublishedSections.has('story')} />
            <SectionLayoutButton section="help" onSelect={() => setSelectedSection('help')} isUnpublished={unpublishedSections.has('help')} />
            <SectionLayoutButton section="impact" onSelect={() => setSelectedSection('impact')} isUnpublished={unpublishedSections.has('impact')} />
            <SectionLayoutButton section="contact" onSelect={() => setSelectedSection('contact')} isUnpublished={unpublishedSections.has('contact')} />
          </>
        )}
        {editMode && currentPage === 'sparrows-closet' && (
          <>
            <SectionLayoutButton section="sparrows-closet-hero" onSelect={() => setSelectedSection('sparrows-closet-hero')} isUnpublished={unpublishedSections.has('sparrows-closet-hero')} />
            <SectionLayoutButton section="sparrows-closet-info" onSelect={() => setSelectedSection('sparrows-closet-info')} isUnpublished={unpublishedSections.has('sparrows-closet-info')} />
            <SectionLayoutButton section="sparrows-closet-impact" onSelect={() => setSelectedSection('sparrows-closet-impact')} isUnpublished={unpublishedSections.has('sparrows-closet-impact')} />
            <SectionLayoutButton section="sparrows-closet-cta" onSelect={() => setSelectedSection('sparrows-closet-cta')} isUnpublished={unpublishedSections.has('sparrows-closet-cta')} />
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

      {showHelpModal && (
        <div className="visual-editor__modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="visual-editor__modal" onClick={(e) => e.stopPropagation()}>
            <div className="visual-editor__modal-header">
              <h3>Visual Editor Help</h3>
              <button className="visual-editor__modal-close" onClick={() => setShowHelpModal(false)}>×</button>
            </div>
            <div className="visual-editor__modal-body">
              <div className="visual-editor__help-content">
                <div className="visual-editor__help-section">
                  <h4>📝 Editing Content</h4>
                  <ul>
                    <li><strong>Click on any text or image</strong> to edit it directly</li>
                    <li><strong>Editable elements</strong> are highlighted when you hover over them</li>
                    <li><strong>Text changes</strong> are saved automatically when you click "Save Changes"</li>
                    <li><strong>Image changes</strong> are saved when you select a new image from the library</li>
                  </ul>
                </div>

                <div className="visual-editor__help-section">
                  <h4>🎨 Changing Layouts</h4>
                  <ul>
                    <li><strong>Click the "Layout" button</strong> that appears on each section</li>
                    <li><strong>Choose from 3 layout options</strong> for each section</li>
                    <li><strong>Layout changes</strong> apply immediately but require a page reload</li>
                    <li><strong>Each section</strong> can have its own unique layout</li>
                  </ul>
                </div>

                <div className="visual-editor__help-section">
                  <h4>🚀 Staging & Publishing</h4>
                  <ul>
                    <li><strong>All changes are saved in "staging" mode</strong> - they won't appear on the live site until published</li>
                    <li><strong>Unpublished changes</strong> are marked with an orange "Unpublished" badge</li>
                    <li><strong>Click "Publish Changes"</strong> to make all pending changes visible to visitors</li>
                    <li><strong>You can make multiple edits</strong> before publishing - they'll all be published together</li>
                  </ul>
                </div>

                <div className="visual-editor__help-section">
                  <h4>🖼️ Image Library</h4>
                  <ul>
                    <li><strong>Click "Image Library"</strong> to view and manage all uploaded images</li>
                    <li><strong>Upload new images</strong> directly from the library</li>
                    <li><strong>Select an image</strong> to use it in any section</li>
                  </ul>
                </div>

                <div className="visual-editor__help-section">
                  <h4>👁️ Preview Mode</h4>
                  <ul>
                    <li><strong>Toggle "Preview Mode"</strong> to see how the site looks without editing controls</li>
                    <li><strong>Preview Mode</strong> shows the published version of your site</li>
                    <li><strong>Switch back to Edit Mode</strong> to continue making changes</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="visual-editor__modal-footer">
              <Button variant="primary" size="md" onClick={() => setShowHelpModal(false)}>
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

