import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useUserRole } from '../../hooks/useUserRole';
import { Button } from '../Button';
import './Onboarding.css';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  action?: {
    type: 'click' | 'type' | 'navigate' | 'open-image-library' | 'open-image-library-on-next';
    selector?: string;
    value?: string;
    tab?: string;
  };
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  role?: string[]; // Roles that should see this step
}

// Role-based onboarding steps
const getOnboardingSteps = (userRole: string): OnboardingStep[] => {
  const baseSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to My Refuge Admin Dashboard! 🎉',
      description: 'Let\'s take a quick tour to help you get started. We\'ll walk through each feature step by step. You can interact with everything freely - the overlay won\'t block you!',
      position: 'center',
    },
  ];

  const editorSteps: OnboardingStep[] = [
    {
      id: 'visual-editor-intro',
      title: 'Visual Editor - Your Content Hub',
      description: 'The Visual Editor is where you\'ll make all your content changes. This tab is already selected. Let\'s explore the editing features!',
      target: '[data-tab="visual-editor"]',
      position: 'bottom',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'edit-mode-toggle',
      title: 'Enable Edit Mode',
      description: 'First, toggle Edit Mode ON using the button in the toolbar (you\'ll see it turn orange). When Edit Mode is ON, you can click on any element to edit it. The overlay won\'t block you - you can interact freely!',
      target: '.visual-editor__toolbar-right .button:last-child',
      position: 'left',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'edit-text',
      title: 'Edit Text Content',
      description: 'With Edit Mode ON, you can click on any text element (headings, paragraphs, titles) to edit it. A modal will open where you can modify the content. Changes are saved to staging automatically. Try clicking on the hero title or description!',
      target: '.visual-editor__preview',
      position: 'top',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'edit-image',
      title: 'Edit Images',
      description: 'Images work the same way! Click on any image on the page to swap it with another from your library. The edit modal will show all available images for that section. You can select a different image or upload a new one.',
      target: '.visual-editor__preview',
      position: 'top',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'image-library-button',
      title: 'Image Library - Manage All Images',
      description: 'The "🖼️ Image Library" button opens your full image collection. Click "Next" to open it and explore the features!',
      target: '.visual-editor__toolbar-right .button:nth-child(2)', // Image Library button
      action: { 
        type: 'open-image-library-on-next', 
        selector: '.visual-editor__toolbar-right .button:nth-child(2)'
      },
      position: 'left',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'image-library-cleanup',
      title: 'Clean Duplicates',
      description: 'The "🧹 Clean Duplicates" button helps you remove duplicate images from your library. This keeps your library organized and saves storage space.',
      target: '.image-library__cleanup-button',
      position: 'bottom',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'image-library-upload',
      title: 'Upload New Images',
      description: 'Click the "📤 Upload New" button to add images to your library. You can upload multiple images at once. Once uploaded, they\'ll appear in the grid below.',
      target: '.image-library__upload-label',
      position: 'bottom',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'image-library-grid',
      title: 'Image Grid - Select & Manage',
      description: 'Click on any image in the grid to select it. Each image shows which sections are using it. Use the "🗑️ Delete" button on any image to remove it from your library.',
      target: '.image-library__grid',
      position: 'top',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'image-library-close',
      title: 'Close Image Library',
      description: 'You can close the Image Library by clicking the X button or clicking outside the modal. When editing images on the page, the library will open automatically for you to select a new image.',
      target: '.visual-editor__library-modal .visual-editor__modal-close',
      action: { type: 'click', selector: '.visual-editor__library-overlay' }, // Click overlay to close
      position: 'top',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'change-layout',
      title: 'Change Section Layouts',
      description: 'Each section has 3 different layout options. When Edit Mode is ON, you\'ll see floating "Layout" buttons on each section. Click one to see the layout previews and choose a different design.',
      target: '.visual-editor__preview',
      position: 'top',
      role: ['admin', 'editor', 'super_admin'],
    },
    {
      id: 'staging-mode',
      title: 'Staging Mode - Safe Editing',
      description: 'All your changes are saved in "staging" mode - they won\'t go live until you click "Publish Changes". You\'ll see an "Unpublished" badge when you have pending changes. This lets you preview everything safely before going live!',
      target: '.visual-editor__toolbar',
      position: 'bottom',
      role: ['admin', 'editor', 'super_admin'],
    },
  ];

  const adminSteps: OnboardingStep[] = [
    {
      id: 'events-tab',
      title: 'Manage Events',
      description: 'The Events tab lets you create and manage calendar events that appear on your website. Let\'s explore the Events section!',
      target: '[data-tab="events"]',
      action: { type: 'navigate', tab: 'events' },
      position: 'bottom',
      role: ['admin', 'super_admin'],
    },
    {
      id: 'create-event',
      title: 'Creating an Event',
      description: 'Click the "➕ Add New Event" button to create a new calendar event. You\'ll fill in: event title (required), description, date (required), optional time, and location. Events appear on your website\'s calendar section.',
      target: '.admin-dashboard__section-header',
      position: 'bottom',
      role: ['admin', 'super_admin'],
    },
    {
      id: 'event-form',
      title: 'Event Form Fields',
      description: 'When creating an event, you\'ll see fields for: Title (required), Description, Date (required), Time (optional), and Location (optional). Fill in the details and click "Save Event" to add it to your calendar.',
      target: '.admin-dashboard__form',
      position: 'top',
      role: ['admin', 'super_admin'],
    },
    {
      id: 'analytics-tab',
      title: 'View Analytics',
      description: 'The Analytics tab shows your website traffic, page views, unique visitors, device types, and browser data. Click the "📊 Analytics" tab to see your site\'s performance metrics!',
      target: '[data-tab="analytics"]',
      action: { type: 'navigate', tab: 'analytics' },
      position: 'bottom',
      role: ['admin', 'super_admin'],
    },
  ];

  const superAdminSteps: OnboardingStep[] = [
    {
      id: 'admin-tab',
      title: 'User & Role Management',
      description: 'As a super admin, you can manage users, assign roles, and control permissions in the Admin tab. Click the "👑 Admin" tab to access these features!',
      target: '[data-tab="admin"]',
      action: { type: 'navigate', tab: 'admin' },
      position: 'bottom',
      role: ['super_admin'],
    },
  ];

  const finalStep: OnboardingStep[] = [
    {
      id: 'complete',
      title: 'You\'re All Set! 🎊',
      description: 'You\'ve completed the onboarding tour. Remember: all changes are in staging mode until you publish them. Feel free to explore and experiment!',
      position: 'center',
    },
  ];

  // Filter steps based on user role
  const allSteps = [
    ...baseSteps,
    ...editorSteps.filter(step => !step.role || step.role.includes(userRole) || (userRole === 'admin' && step.role.includes('admin'))),
    ...adminSteps.filter(step => !step.role || step.role.includes(userRole) || userRole === 'super_admin'),
    ...superAdminSteps.filter(step => !step.role || step.role.includes(userRole)),
    ...finalStep,
  ];

  return allSteps;
};

export const Onboarding: React.FC = () => {
  let onboardingContext;
  try {
    onboardingContext = useOnboarding();
  } catch (error) {
    // Onboarding context not available, don't render
    return null;
  }

  const { isOnboarding, currentStep, setCurrentStep, setTotalSteps, completeOnboarding, skipOnboarding } = onboardingContext;
  const { userRole } = useUserRole();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOnboarding) {
      const roleSteps = getOnboardingSteps(userRole);
      setSteps(roleSteps);
      setTotalSteps(roleSteps.length);
      setCurrentStep(0);
    }
  }, [isOnboarding, userRole, setTotalSteps, setCurrentStep]);

  useEffect(() => {
    if (!isOnboarding || steps.length === 0) return;

    const step = steps[currentStep];
    if (!step) return;

    // Function to update highlight position
    const updateHighlight = () => {
      if (step.target) {
        let element = document.querySelector(step.target) as HTMLElement;
        let shouldScroll = true;
        
        // For edit-text and edit-image steps, target the hero section specifically
        if (step.id === 'edit-text' || step.id === 'edit-image') {
          // Try to find hero section (it uses .hero class)
          const heroSection = document.querySelector('.hero, .hero-section, [data-section="hero"]') as HTMLElement;
          if (heroSection) {
            element = heroSection;
            shouldScroll = false; // Don't scroll for hero section - it's usually at the top
          } else {
            // Fallback: try to find first h1 or img in the preview
            const specificElement = document.querySelector('.visual-editor__preview h1, .visual-editor__preview img[data-section="hero"]') as HTMLElement;
            if (specificElement) {
              element = specificElement;
              shouldScroll = false; // Don't scroll for visible hero elements
            }
          }
        }
        
        if (element) {
          setHighlightedElement(element);
          
          // Only scroll if:
          // 1. shouldScroll is true (not disabled for this step)
          // 2. Element is not already visible in viewport
          // 3. Target is not a large container (like __preview)
          if (shouldScroll && !step.target.includes('__preview')) {
            const rect = element.getBoundingClientRect();
            const isVisible = (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (!isVisible) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
              }, 200);
            }
          }
        } else {
          setHighlightedElement(null);
        }
      } else {
        setHighlightedElement(null);
      }
    };

    // Handle navigation actions
    if (step.action?.type === 'navigate' && step.action.tab) {
      // Use window function if available, otherwise click button
      if ((window as any).__adminDashboardSetTab) {
        (window as any).__adminDashboardSetTab(step.action.tab);
      } else {
        const tabButton = document.querySelector(`[data-tab="${step.action.tab}"]`) as HTMLElement;
        if (tabButton) {
          tabButton.click();
        }
      }
      // Wait for the tab content to render before highlighting
      setTimeout(() => {
        updateHighlight();
      }, 600);
    } else if (step.action?.type === 'open-image-library') {
      // Open the image library modal immediately (for steps that need it open)
      const selector = step.action.selector || '.visual-editor__toolbar-right .button:nth-child(2)';
      const imageLibraryButton = document.querySelector(selector) as HTMLElement;
      if (imageLibraryButton) {
        imageLibraryButton.click();
      }
      // Wait for the modal to open before highlighting
      setTimeout(() => {
        updateHighlight();
      }, 500);
    } else if (step.action?.type === 'open-image-library-on-next') {
      // Don't open yet - wait for user to click Next
      // Just highlight the button
      setTimeout(() => {
        updateHighlight();
      }, 100);
    } else if (step.action?.type === 'click' && step.action.selector) {
      // Handle click actions (like closing modals)
      // Don't auto-click, just highlight the element
      setTimeout(() => {
        updateHighlight();
      }, 100);
    } else {
      // Highlight target element immediately
      setTimeout(() => {
        updateHighlight();
      }, 100);
    }

    // Cleanup
    return () => {
      setHighlightedElement(null);
    };
  }, [currentStep, steps, isOnboarding]);

  if (!isOnboarding || steps.length === 0) return null;

  const step = steps[currentStep];
  if (!step) return null;

  const handleNext = () => {
    // If we're on the image-library-button step, open the modal first
    if (step.id === 'image-library-button' && step.action?.type === 'open-image-library-on-next') {
      const selector = step.action.selector || '.visual-editor__toolbar-right .button:nth-child(2)';
      const imageLibraryButton = document.querySelector(selector) as HTMLElement;
      if (imageLibraryButton) {
        imageLibraryButton.click();
      }
      // Wait for modal to open, then move to next step
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          completeOnboarding();
        }
      }, 500);
    } else if (step.id === 'image-library-close') {
      // If we're on the image-library-close step, close the modal before continuing
      const closeButton = document.querySelector('.visual-editor__library-modal .visual-editor__modal-close') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      } else {
        // Fallback: click the overlay
        const overlay = document.querySelector('.visual-editor__library-overlay') as HTMLElement;
        if (overlay) {
          overlay.click();
        }
      }
      // Small delay to let modal close
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          completeOnboarding();
        }
      }, 300);
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeOnboarding();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (confirm('Skip the onboarding tour? You can always restart it from your profile menu (click your profile icon → "Start Onboarding Tour").')) {
      skipOnboarding();
    }
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    const isMobile = window.innerWidth <= 768;
    
    // Center positioning for welcome/completion steps
    if (!highlightedElement || step.position === 'center') {
      if (isMobile) {
        // On mobile, show at bottom as bottom sheet
        return {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          maxWidth: '100%',
          transform: 'none',
          zIndex: 10001,
          borderRadius: '12px 12px 0 0',
        };
      } else {
        // On desktop, center in viewport - ensure it's truly centered
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          maxWidth: '400px',
          width: '90%',
          margin: '0 auto',
          borderRadius: '12px',
        };
      }
    }

    const rect = highlightedElement.getBoundingClientRect();
    const spacing = isMobile ? 10 : 20;
    
    // Use responsive dimensions
    const tooltipWidth = isMobile ? window.innerWidth - 32 : 400; // 32px for margins
    const tooltipHeight = isMobile ? 250 : 200; // Estimate, will be auto on mobile
    
    let top = 0;
    let left = 0;

    if (isMobile) {
      // On mobile, always position tooltip at bottom of screen
      return {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        width: '100%',
        maxWidth: '100%',
        zIndex: 10001,
        borderRadius: '12px 12px 0 0',
      };
    }

    // Desktop positioning
    switch (step.position) {
      case 'top':
        top = rect.top - tooltipHeight - spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - spacing;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + spacing;
        break;
    }

    // Keep tooltip in viewport
    top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20));
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10001,
    };
  };

  return (
    <AnimatePresence>
      {isOnboarding && (
        <>
          {/* Overlay with cutout for highlighted element */}
          <motion.div
            ref={overlayRef}
            className="onboarding__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Allow clicks to pass through - don't block interactions
              e.stopPropagation();
            }}
          >
            {highlightedElement && (
              <div
                className="onboarding__highlight"
                style={{
                  position: 'fixed',
                  top: `${highlightedElement.getBoundingClientRect().top}px`,
                  left: `${highlightedElement.getBoundingClientRect().left}px`,
                  width: `${highlightedElement.getBoundingClientRect().width}px`,
                  height: `${highlightedElement.getBoundingClientRect().height}px`,
                }}
              />
            )}
          </motion.div>

          {/* Tooltip */}
          <motion.div
            className="onboarding__tooltip"
            style={getTooltipStyle()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="onboarding__tooltip-header">
              <h3 className="onboarding__tooltip-title">{step.title}</h3>
              <span className="onboarding__tooltip-step">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <p className="onboarding__tooltip-description">{step.description}</p>
            <div className="onboarding__tooltip-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="onboarding__skip-btn"
              >
                Skip Tour
              </Button>
              <div className="onboarding__nav-buttons">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    ← Previous
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

