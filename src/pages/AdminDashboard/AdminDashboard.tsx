import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import type { CalendarEvent } from '../../lib/supabase';
import { useUserRole } from '../../hooks/useUserRole';
import { VisualEditor } from '../../components/VisualEditor';
import { Onboarding } from '../../components/Onboarding/Onboarding';
import { useOnboarding } from '../../contexts/OnboardingContext';
import './AdminDashboard.css';

type MainTab = 'visual-editor' | 'events' | 'analytics' | 'admin';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('visual-editor');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const { userRole, isSuperAdmin: isSuperAdminRole, loading: roleLoading } = useUserRole();
  
  // Get onboarding context (may not be available if not wrapped in provider)
  let onboardingContext;
  try {
    onboardingContext = useOnboarding();
  } catch (error) {
    // Onboarding context not available, that's okay
    onboardingContext = null;
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        // Session expired or logged out, ProtectedRoute will handle redirect
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.admin-dashboard__profile-container')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileDropdown]);

  // Expose setActiveMainTab to window for onboarding navigation
  useEffect(() => {
    (window as any).__adminDashboardSetTab = (tab: MainTab) => {
      setActiveMainTab(tab);
    };
    return () => {
      delete (window as any).__adminDashboardSetTab;
    };
  }, []);

  if (loading || roleLoading || !user) {
    return <div className="admin-dashboard__loading">Loading...</div>;
  }

  const isSuperAdmin = isSuperAdminRole || userRole === 'admin';

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div className="admin-dashboard__header-content">
          <div>
            <h1 className="admin-dashboard__title">Admin Dashboard</h1>
            <p className="admin-dashboard__subtitle">Welcome back, {user.email}</p>
          </div>
          <div className="admin-dashboard__profile-container">
            <button
              className="admin-dashboard__profile-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Profile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="admin-dashboard__profile-dropdown">
                <button
                  className="admin-dashboard__profile-dropdown-item"
                  onClick={() => {
                    setShowProfileSettings(true);
                    setShowProfileDropdown(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Profile Settings
                </button>
                {onboardingContext && (
                  <button
                    className="admin-dashboard__profile-dropdown-item"
                    onClick={() => {
                      onboardingContext.startOnboarding();
                      setShowProfileDropdown(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Start Onboarding Tour
                  </button>
                )}
                <button
                  className="admin-dashboard__profile-dropdown-item"
                  onClick={handleLogout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="admin-dashboard__main-tabs">
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'visual-editor' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('visual-editor')}
          data-tab="visual-editor"
        >
          🎨 Visual Editor
        </button>
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('events')}
          data-tab="events"
        >
          📅 Events
        </button>
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('analytics')}
          data-tab="analytics"
        >
          📊 Analytics
        </button>
        {isSuperAdmin && (
          <button
            className={`admin-dashboard__main-tab ${activeMainTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('admin')}
            data-tab="admin"
          >
            👑 Admin
          </button>
        )}
      </div>

      <div className="admin-dashboard__content-area">
        {activeMainTab === 'visual-editor' && (userRole === 'admin' || userRole === 'editor' || isSuperAdminRole) && <VisualEditor />}
        {activeMainTab === 'visual-editor' && userRole === 'viewer' && (
          <div className="admin-dashboard__empty-state">
            <p>⚠️ Viewers do not have access to the Visual Editor.</p>
            <p className="admin-dashboard__empty-hint">Please contact an admin if you need editing access.</p>
          </div>
        )}
        {activeMainTab === 'events' && <EventsTab />}
        {activeMainTab === 'analytics' && <AnalyticsTab />}
        {activeMainTab === 'admin' && isSuperAdmin && <SuperAdminTab />}
      </div>

      {showProfileSettings && (
        <ProfileSettingsModal
          user={user}
          onClose={() => setShowProfileSettings(false)}
        />
      )}

      <Onboarding />
    </div>
  );
};

// Edit Site Tab Component
// EditSiteTab is no longer used - replaced by VisualEditor
/*
const EditSiteTab: React.FC<{
  activeSiteTab: SiteTab;
  setActiveSiteTab: (tab: SiteTab) => void;
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}> = ({ activeSiteTab, setActiveSiteTab, selectedSection, setSelectedSection }) => {
  const myRefugeSections: { value: SectionType; label: string; icon: string }[] = [
    { value: 'hero', label: 'Hero Section', icon: '🏠' },
    { value: 'mission', label: 'Mission Section', icon: '🎯' },
    { value: 'story', label: 'Story Section', icon: '📖' },
    { value: 'help', label: 'Help Section', icon: '🤝' },
    { value: 'impact', label: 'Impact Section', icon: '💫' },
    { value: 'donation', label: 'Donation Banner', icon: '💝' },
    { value: 'contact', label: 'Contact Section', icon: '📧' },
  ];

  const sparrowsClosetSections: { value: SectionType; label: string; icon: string }[] = [
    { value: 'sparrows-closet-hero', label: 'Hero Section', icon: '🏠' },
    { value: 'sparrows-closet-info', label: 'Info Section', icon: 'ℹ️' },
    { value: 'sparrows-closet-impact', label: 'Impact Section', icon: '💫' },
    { value: 'sparrows-closet-cta', label: 'Call to Action', icon: '📢' },
  ];

  const currentSections = activeSiteTab === 'my-refuge' ? myRefugeSections : sparrowsClosetSections;

  return (
    <>
      <div className="admin-dashboard__site-tabs">
        <button
          className={`admin-dashboard__site-tab ${activeSiteTab === 'my-refuge' ? 'active' : ''}`}
          onClick={() => {
            setActiveSiteTab('my-refuge');
            setSelectedSection('hero');
          }}
        >
          My Refuge
        </button>
        <button
          className={`admin-dashboard__site-tab ${activeSiteTab === 'sparrows-closet' ? 'active' : ''}`}
          onClick={() => {
            setActiveSiteTab('sparrows-closet');
            setSelectedSection('sparrows-closet-hero');
          }}
        >
          Sparrows Closet
        </button>
      </div>

      <div className="admin-dashboard__container">
        <aside className="admin-dashboard__sidebar">
          <h3 className="admin-dashboard__sidebar-title">Sections</h3>
          <nav className="admin-dashboard__sections-nav">
            {currentSections.map((section) => (
              <button
                key={section.value}
                className={`admin-dashboard__section-btn ${selectedSection === section.value ? 'active' : ''}`}
                onClick={() => setSelectedSection(section.value)}
              >
                <span className="admin-dashboard__section-icon">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-dashboard__content">
          <SectionEditor section={selectedSection} siteTab={activeSiteTab} />
        </main>
      </div>
    </>
  );
}; */

// Sponsors Manager Component - no longer used
/*
const SponsorsManager: React.FC = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    order_index: 0,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading sponsors:', error);
    } else {
      setSponsors(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a sponsor name');
      return;
    }

    setUploading(true);
    try {
      let logoUrl = '';
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `sponsor-${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        logoUrl = publicUrl;
      }

      const { error: dbError } = await supabase
        .from('sponsors')
        .insert({
          name: formData.name,
          logo_url: logoUrl || null,
          website_url: formData.website_url || null,
          order_index: formData.order_index || sponsors.length,
          is_active: true,
        });

      if (dbError) throw dbError;

      await loadSponsors();
      setShowForm(false);
      setFormData({ name: '', website_url: '', order_index: 0 });
      setLogoFile(null);
      alert('Sponsor added successfully!');
    } catch (error: any) {
      console.error('Error adding sponsor:', error);
      alert(`Error adding sponsor: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) {
      alert('Error deleting sponsor. Please try again.');
    } else {
      await loadSponsors();
      alert('Sponsor deleted successfully!');
    }
  };

  const handleToggleActive = async (sponsor: any) => {
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: !sponsor.is_active })
      .eq('id', sponsor.id);

    if (error) {
      alert('Error updating sponsor. Please try again.');
    } else {
      await loadSponsors();
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="admin-dashboard__editor-card">
      <div className="admin-dashboard__editor-header">
        <h2 className="admin-dashboard__editor-title">Sponsors Section</h2>
        <p className="admin-dashboard__editor-subtitle">Manage sponsors displayed on your website</p>
      </div>

      <div className="admin-dashboard__upload-area">
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Sponsor'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-dashboard__form">
          <div className="admin-dashboard__form-group">
            <label>Sponsor Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter sponsor name"
            />
          </div>
          <div className="admin-dashboard__form-group">
            <label>Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="admin-dashboard__form-group">
            <label>Logo Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="admin-dashboard__form-group">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
          <Button type="submit" variant="primary" size="md" disabled={uploading}>
            {uploading ? 'Adding...' : 'Add Sponsor'}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="admin-dashboard__loading-state">Loading sponsors...</div>
      ) : sponsors.length === 0 ? (
        <div className="admin-dashboard__empty-state">
          <p>No sponsors added yet.</p>
        </div>
      ) : (
        <div className="admin-dashboard__sponsors-list">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="admin-dashboard__sponsor-item">
              <div className="admin-dashboard__sponsor-info">
                {sponsor.logo_url && (
                  <img src={sponsor.logo_url} alt={sponsor.name} className="admin-dashboard__sponsor-logo" />
                )}
                <div>
                  <h3>{sponsor.name}</h3>
                  {sponsor.website_url && <p>{sponsor.website_url}</p>}
                  <p className="admin-dashboard__sponsor-status">
                    Status: {sponsor.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="admin-dashboard__sponsor-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(sponsor)}
                >
                  {sponsor.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(sponsor.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// Section Editor Component - no longer used, replaced by VisualEditor
/*
const SectionEditor: React.FC<{ section: SectionType; siteTab: SiteTab }> = ({ section, siteTab: _siteTab }) => {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [layout, setLayout] = useState<string>('default');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editAltText, setEditAltText] = useState<string>('');

  useEffect(() => {
    loadImages();
    loadLayout();
  }, [section]);

  const loadLayout = async () => {
    try {
      const { data, error } = await supabase
        .from('section_layouts')
        .select('layout_type')
        .eq('section', section)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading layout:', error);
      } else if (data) {
        setLayout(data.layout_type || 'default');
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  const handleLayoutChange = async (newLayout: string) => {
    try {
      const { error } = await supabase
        .from('section_layouts')
        .upsert({
          section,
          layout_type: newLayout,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setLayout(newLayout);
      alert('Layout updated successfully!');
    } catch (error: any) {
      console.error('Error updating layout:', error);
      alert(`Error updating layout: ${error.message}`);
    }
  };

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('section', section)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Check authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('You must be logged in to upload images. Please log in again.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${section}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('images')
        .insert({
          section: section,
          url: publicUrl,
          alt_text: `${section} image`,
          order_index: images.length,
          is_active: true,
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        console.error('Error details:', {
          code: dbError.code,
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
        });
        throw dbError;
      }

      await loadImages();
      alert('Image uploaded successfully!');
      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading image:', error);
      let errorMessage = error.message || 'Unknown error occurred';
      
      if (error.message?.includes('row-level security')) {
        errorMessage = 'RLS Policy Error: Your account may not have permission to upload images. Please run the SQL fix in Supabase Dashboard → SQL Editor (see backend/fix_images_rls.sql)';
      }
      
      alert(`Error uploading image: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) {
      alert('Error deleting image. Please try again.');
    } else {
      await loadImages();
      alert('Image deleted successfully!');
    }
  };

  const handleToggleActive = async (image: ImageUpload) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ is_active: !image.is_active })
        .eq('id', image.id);

      if (error) throw error;
      await loadImages();
    } catch (error: any) {
      console.error('Error toggling image active status:', error);
      alert(`Error updating image: ${error.message}`);
    }
  };

  const handleUpdateAltText = async (id: string) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ alt_text: editAltText })
        .eq('id', id);

      if (error) throw error;
      setEditingImage(null);
      await loadImages();
    } catch (error: any) {
      console.error('Error updating alt text:', error);
      alert(`Error updating alt text: ${error.message}`);
    }
  };

  const handleMoveImage = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const currentImage = images[currentIndex];
    const targetImage = images[newIndex];

    try {
      // Swap order indices
      const { error: error1 } = await supabase
        .from('images')
        .update({ order_index: targetImage.order_index })
        .eq('id', currentImage.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('images')
        .update({ order_index: currentImage.order_index })
        .eq('id', targetImage.id);

      if (error2) throw error2;

      await loadImages();
    } catch (error: any) {
      console.error('Error moving image:', error);
      alert(`Error moving image: ${error.message}`);
    }
  };

  const getPrimaryImage = () => {
    return images.find(img => img.is_active) || images[0];
  };

  const startEditingAltText = (image: ImageUpload) => {
    setEditingImage(image.id);
    setEditAltText(image.alt_text || '');
  };

  const sectionLabels: Record<SectionType, string> = {
    'hero': 'Hero Section',
    'mission': 'Mission Section',
    'story': 'Story Section',
    'help': 'Help Section',
    'impact': 'Impact Section',
    'donation': 'Donation Banner',
    'contact': 'Contact Section',
    'sponsors': 'Sponsors Section',
    'sparrows-closet-hero': 'Hero Section',
    'sparrows-closet-info': 'Info Section',
    'sparrows-closet-impact': 'Impact Section',
    'sparrows-closet-cta': 'Call to Action',
  };

  const layoutOptions = ['default', 'layout-2', 'layout-3'];

  // Only show layout selector for sections that support layouts
  const supportsLayouts = ['hero', 'mission', 'help'].includes(section);

  // Special handling for sponsors section
  if (section === 'sponsors') {
    return <SponsorsManager />;
  }

  return (
    <Card variant="elevated" padding="lg" className="admin-dashboard__editor-card">
      <div className="admin-dashboard__editor-header">
        <h2 className="admin-dashboard__editor-title">{sectionLabels[section]}</h2>
        <p className="admin-dashboard__editor-subtitle">Manage images and layout for this section</p>
      </div>

      {supportsLayouts && (
        <div className="admin-dashboard__layout-selector">
          <label className="admin-dashboard__layout-label">Layout Style:</label>
          <div className="admin-dashboard__layout-previews">
            {layoutOptions.map((opt) => (
              <LayoutPreview
                key={opt}
                layoutType={opt}
                section={section}
                isSelected={layout === opt}
                onClick={() => handleLayoutChange(opt)}
              />
            ))}
          </div>
          <p className="admin-dashboard__layout-hint">
            Click a layout to preview and select how this section is displayed
          </p>
        </div>
      )}

      <div className="admin-dashboard__upload-area">
        <input
          type="file"
          id={`upload-${section}`}
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor={`upload-${section}`} 
          className="admin-dashboard__upload-label"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'inline-block' }}
        >
          <span className="admin-dashboard__upload-button">
            {uploading ? 'Uploading...' : '📤 Upload Image'}
          </span>
        </label>
        <p className="admin-dashboard__upload-hint">
          Upload an image to display in the {sectionLabels[section]} section
        </p>
      </div>

      {loading ? (
        <div className="admin-dashboard__loading-state">Loading images...</div>
      ) : images.length === 0 ? (
        <div className="admin-dashboard__empty-state">
          <p>No images uploaded for this section yet.</p>
          <p className="admin-dashboard__empty-hint">Upload an image above to get started.</p>
        </div>
      ) : (
        <>
          <div className="admin-dashboard__image-info-banner">
            <div className="admin-dashboard__image-info-content">
              <span className="admin-dashboard__image-info-icon">ℹ️</span>
              <div>
                <strong>How images work:</strong>
                <p>The first active image (shown with a star ⭐) is displayed on your main website. You can reorder images or toggle them active/inactive to control which one appears.</p>
              </div>
            </div>
          </div>
          <div className="admin-dashboard__image-list">
            {images.map((image, index) => {
              const isPrimary = getPrimaryImage()?.id === image.id && image.is_active;
              
              return (
                <div 
                  key={image.id} 
                  className={`admin-dashboard__image-card ${isPrimary ? 'admin-dashboard__image-card--primary' : ''} ${!image.is_active ? 'admin-dashboard__image-card--inactive' : ''}`}
                >
                  <div className="admin-dashboard__image-card-header">
                    <div className="admin-dashboard__image-card-badge">
                      {isPrimary && image.is_active && (
                        <span className="admin-dashboard__primary-badge">⭐ Primary (Shown on Site)</span>
                      )}
                      {!image.is_active && (
                        <span className="admin-dashboard__inactive-badge">Inactive</span>
                      )}
                      {image.is_active && !isPrimary && (
                        <span className="admin-dashboard__secondary-badge">Active (Not Displayed)</span>
                      )}
                    </div>
                    <div className="admin-dashboard__image-card-position">
                      Position: {index + 1} of {images.length}
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__image-card-preview">
                    <img src={image.url} alt={image.alt_text || ''} />
                    {isPrimary && image.is_active && (
                      <div className="admin-dashboard__image-card-overlay">
                        <span>Currently Displayed</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-dashboard__image-card-details">
                    {editingImage === image.id ? (
                      <div className="admin-dashboard__image-edit-form">
                        <input
                          type="text"
                          value={editAltText}
                          onChange={(e) => setEditAltText(e.target.value)}
                          placeholder="Alt text for accessibility"
                          className="admin-dashboard__image-edit-input"
                        />
                        <div className="admin-dashboard__image-edit-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateAltText(image.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingImage(null);
                              setEditAltText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-dashboard__image-card-alt">
                        <strong>Alt Text:</strong> {image.alt_text || 'No alt text set'}
                      </div>
                    )}
                  </div>

                  <div className="admin-dashboard__image-card-actions">
                    <div className="admin-dashboard__image-card-actions-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(image)}
                        title={image.is_active ? 'Hide from site' : 'Show on site'}
                      >
                        {image.is_active ? '👁️ Hide' : '👁️‍🗨️ Show'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingAltText(image)}
                        title="Edit alt text for accessibility"
                      >
                        ✏️ Edit Alt Text
                      </Button>
                    </div>
                    <div className="admin-dashboard__image-card-actions-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(image.id, 'up')}
                        disabled={index === 0}
                        title="Move up (makes it primary if active)"
                      >
                        ⬆️ Move Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(image.id, 'down')}
                        disabled={index === images.length - 1}
                        title="Move down"
                      >
                        ⬇️ Move Down
                      </Button>
                    </div>
                    <div className="admin-dashboard__image-card-actions-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                        className="admin-dashboard__delete-btn"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};
*/

// Profile Settings Modal Component
const ProfileSettingsModal: React.FC<{ user: any; onClose: () => void }> = ({ user, onClose }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update email.');
        setLoading(false);
        return;
      }

      setSuccess('Email update request sent! Please check your email to confirm the change.');
      setLoading(false);
    } catch (err: any) {
      console.error('Email update error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password.');
        setLoading(false);
        return;
      }

      setSuccess('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-dashboard__modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '2rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="admin-dashboard__profile-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #E8E8E8',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: 0,
          }}>
            Profile Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '2rem',
              color: '#757575',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0,
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F5F5F5';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#757575';
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E8E8E8',
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '3px solid #007DFF' : '3px solid transparent',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: activeTab === 'profile' ? '#007DFF' : '#757575',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'password' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'password' ? '3px solid #007DFF' : '3px solid transparent',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: activeTab === 'password' ? '#007DFF' : '#757575',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Change Password
          </button>
        </div>

        <div style={{
          padding: '2rem',
        }}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#FFEBEE',
              border: '1px solid #EF5350',
              borderRadius: '0.5rem',
              color: '#C62828',
              marginBottom: '1.5rem',
              fontSize: '0.9375rem',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              background: '#E8F5E9',
              border: '1px solid #4CAF50',
              borderRadius: '0.5rem',
              color: '#2E7D32',
              marginBottom: '1.5rem',
              fontSize: '0.9375rem',
            }}>
              {success}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateEmail}>
              <div className="admin-dashboard__field" style={{ marginBottom: '1.5rem' }}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
                <p style={{
                  fontSize: '0.875rem',
                  color: '#757575',
                  marginTop: '0.5rem',
                  marginBottom: 0,
                }}>
                  Changing your email will require confirmation via email.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading || email === user?.email}
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword}>
              <div className="admin-dashboard__field" style={{ marginBottom: '1.5rem' }}>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="admin-dashboard__field" style={{ marginBottom: '1.5rem' }}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  minLength={6}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading || !newPassword || !confirmPassword}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Events Tab Component
const EventsTab: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('calendar_events')
      .insert({
        ...formData,
        is_active: true,
      });

    if (error) {
      alert('Error creating event. Please try again.');
    } else {
      alert('Event created successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', date: '', time: '', location: '' });
      await loadEvents();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting event. Please try again.');
    } else {
      await loadEvents();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="admin-dashboard__tab-content">
      <Card variant="elevated" padding="lg">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__editor-title">Calendar Events</h2>
            <p className="admin-dashboard__editor-subtitle">Manage upcoming events and activities</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '➕ Add New Event'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="admin-dashboard__form" style={{ marginTop: '2rem' }}>
            <div className="admin-dashboard__field">
              <label>Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Event name"
              />
            </div>
            <div className="admin-dashboard__field">
              <label>Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description"
              />
            </div>
            <div className="admin-dashboard__field-row">
              <div className="admin-dashboard__field">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="admin-dashboard__field">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-dashboard__field">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event location"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Save Event
            </Button>
          </form>
        )}

        {loading ? (
          <div className="admin-dashboard__loading-state">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="admin-dashboard__empty-state">
            <p>No events scheduled yet.</p>
            <p className="admin-dashboard__empty-hint">Click "Add New Event" to create your first event.</p>
          </div>
        ) : (
          <div className="admin-dashboard__events-list" style={{ marginTop: '2rem' }}>
            {events.map((event) => (
              <div key={event.id} className="admin-dashboard__event-item">
                <div>
                  <h3>{event.title}</h3>
                  {event.description && <p>{event.description}</p>}
                  <p>
                    📅 {formatDate(event.date)}
                    {event.time && ` at ${event.time}`}
                    {event.location && ` • 📍 ${event.location}`}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: { today: 0, week: 0, month: 0, total: 0 },
    uniqueVisitors: { today: 0, week: 0, month: 0, total: 0 },
    topPages: [] as { path: string; views: number }[],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    browsers: [] as { browser: string; users: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fix: Create new Date objects for each calculation to avoid mutation issues
      const now = new Date();
      
      // Today start (midnight today)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
      
      // Week start (7 days ago from now)
      const weekStartDate = new Date(now);
      weekStartDate.setDate(weekStartDate.getDate() - 7);
      const weekStart = weekStartDate.toISOString();
      
      // Month start (30 days ago from now for consistency with "Last 30 Days" labels)
      const monthStartDate = new Date(now);
      monthStartDate.setDate(monthStartDate.getDate() - 30);
      const monthStart = monthStartDate.toISOString();

      // Page views
      const { count: pageViewsToday } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart);

      const { count: pageViewsWeek } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart);

      const { count: pageViewsMonth } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart);

      const { count: pageViewsTotal } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Unique visitors - count distinct visitors who visited in each time period
      // We need to join with page_views to get accurate counts per time period
      const { data: visitorsTodayData } = await supabase
        .from('page_views')
        .select('visitor_id')
        .gte('created_at', todayStart);
      
      const visitorsToday = new Set(visitorsTodayData?.map(pv => pv.visitor_id) || []).size;

      const { data: visitorsWeekData } = await supabase
        .from('page_views')
        .select('visitor_id')
        .gte('created_at', weekStart);
      
      const visitorsWeek = new Set(visitorsWeekData?.map(pv => pv.visitor_id) || []).size;

      const { data: visitorsMonthData } = await supabase
        .from('page_views')
        .select('visitor_id')
        .gte('created_at', monthStart);
      
      const visitorsMonth = new Set(visitorsMonthData?.map(pv => pv.visitor_id) || []).size;

      const { count: visitorsTotal } = await supabase
        .from('unique_visitors')
        .select('*', { count: 'exact', head: true });

      // Top pages
      const { data: topPagesData } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', monthStart);

      const pageCounts: Record<string, number> = {};
      topPagesData?.forEach((pv) => {
        pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1;
      });

      const topPages = Object.entries(pageCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Device types
      const { data: deviceData } = await supabase
        .from('page_views')
        .select('device_type')
        .gte('created_at', monthStart);

      const devices = {
        desktop: deviceData?.filter((d) => d.device_type === 'desktop').length || 0,
        mobile: deviceData?.filter((d) => d.device_type === 'mobile').length || 0,
        tablet: deviceData?.filter((d) => d.device_type === 'tablet').length || 0,
      };

      // Browsers
      const { data: browserData } = await supabase
        .from('page_views')
        .select('browser')
        .gte('created_at', monthStart)
        .not('browser', 'is', null);

      const browserCounts: Record<string, number> = {};
      browserData?.forEach((pv) => {
        if (pv.browser) {
          browserCounts[pv.browser] = (browserCounts[pv.browser] || 0) + 1;
        }
      });

      const browsers = Object.entries(browserCounts)
        .map(([browser, users]) => ({ browser, users }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 5);

      setAnalyticsData({
        pageViews: {
          today: pageViewsToday || 0,
          week: pageViewsWeek || 0,
          month: pageViewsMonth || 0,
          total: pageViewsTotal || 0,
        },
        uniqueVisitors: {
          today: visitorsToday || 0,
          week: visitorsWeek || 0,
          month: visitorsMonth || 0,
          total: visitorsTotal || 0,
        },
        topPages,
        devices,
        browsers,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard__tab-content">
      <Card variant="elevated" padding="lg">
        <div className="admin-dashboard__editor-header">
          <h2 className="admin-dashboard__editor-title">Analytics</h2>
          <p className="admin-dashboard__editor-subtitle">View website traffic and user behavior</p>
        </div>

        <div className="admin-dashboard__analytics-grid">
          <div className="admin-dashboard__analytics-card">
            <h3 className="admin-dashboard__analytics-card-title">Page Views</h3>
            <div className="admin-dashboard__analytics-stats">
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Today</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.pageViews.today}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">This Week</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.pageViews.week}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">This Month</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.pageViews.month}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Total</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.pageViews.total}</span>
              </div>
            </div>
          </div>

          <div className="admin-dashboard__analytics-card">
            <h3 className="admin-dashboard__analytics-card-title">Unique Visitors</h3>
            <div className="admin-dashboard__analytics-stats">
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Today</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.uniqueVisitors.today}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">This Week</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.uniqueVisitors.week}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">This Month</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.uniqueVisitors.month}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Total</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.uniqueVisitors.total}</span>
              </div>
            </div>
          </div>

          <div className="admin-dashboard__analytics-card">
            <h3 className="admin-dashboard__analytics-card-title">Device Types</h3>
            <div className="admin-dashboard__analytics-stats">
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Desktop</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.devices.desktop}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Mobile</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.devices.mobile}</span>
              </div>
              <div className="admin-dashboard__analytics-stat">
                <span className="admin-dashboard__analytics-stat-label">Tablet</span>
                <span className="admin-dashboard__analytics-stat-value">{analyticsData.devices.tablet}</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-dashboard__loading-state">Loading analytics...</div>
        ) : (
          <>
            {analyticsData.topPages.length > 0 && (
              <div className="admin-dashboard__analytics-section">
                <h3 className="admin-dashboard__analytics-section-title">Top Pages (Last 30 Days)</h3>
                <div className="admin-dashboard__top-pages">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="admin-dashboard__top-page-item">
                      <span className="admin-dashboard__top-page-path">{page.path}</span>
                      <span className="admin-dashboard__top-page-views">{page.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyticsData.browsers.length > 0 && (
              <div className="admin-dashboard__analytics-section">
                <h3 className="admin-dashboard__analytics-section-title">Top Browsers (Last 30 Days)</h3>
                <div className="admin-dashboard__top-pages">
                  {analyticsData.browsers.map((browser, index) => (
                    <div key={index} className="admin-dashboard__top-page-item">
                      <span className="admin-dashboard__top-page-path">{browser.browser}</span>
                      <span className="admin-dashboard__top-page-views">{browser.users} users</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyticsData.pageViews.total === 0 && (
              <div className="admin-dashboard__analytics-placeholder">
                <p>📊 No analytics data yet. Analytics will start tracking once visitors view your site.</p>
                <p className="admin-dashboard__analytics-placeholder-hint">
                  Page views and visitor data will appear here automatically.
                </p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

// Super Admin Tab Component
const SuperAdminTab: React.FC = () => {
  const { userRole, isSuperAdmin: isSuperAdminRole } = useUserRole();
  const isAdmin = isSuperAdminRole || userRole === 'admin';
  
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [editingUser, setEditingUser] = useState<{ id: string; email: string; currentRoles: string[] } | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);
  const [userFormData, setUserFormData] = useState({
    email: '',
    role: '',
  });
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: {} as Record<string, boolean>,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Generate a secure random password
  const generatePassword = (): string => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Password copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Password: ' + text);
    });
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail || userId}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete user roles first (cascade will handle this, but being explicit)
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error deleting user roles:', rolesError);
        alert('Error deleting user roles. Please try again.');
        return;
      }

      // Delete from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) {
        console.error('Error deleting user:', userError);
        // Continue anyway - the user might not exist in users table yet
      }

      // Note: We cannot delete from auth.users using the client SDK
      // The user will need to be deleted manually from Supabase Dashboard → Authentication → Users
      // Or we could create an Edge Function for this
      alert('User roles and data deleted. Note: The user account in auth.users must be deleted manually from Supabase Dashboard → Authentication → Users.');
      
      await loadData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  const handleEditUser = (userId: string, currentEmail: string, currentRoles: string[]) => {
    setEditingUser({ id: userId, email: currentEmail, currentRoles });
    setSelectedRoles([...currentRoles]);
  };

  const handleCloseRoleEditor = () => {
    setEditingUser(null);
    setSelectedRoles([]);
  };

  const handleToggleRole = (roleName: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleName)) {
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;

    setSavingRoles(true);
    try {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUser.id);

      if (deleteError) {
        throw deleteError;
      }

      // Add new roles
      if (selectedRoles.length > 0) {
        for (const roleName of selectedRoles) {
          const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
          if (role) {
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert({
                user_id: editingUser.id,
                role_id: role.id,
              });

            if (insertError) {
              console.error(`Error adding role ${roleName}:`, insertError);
              alert(`Error adding role "${roleName}". Please try again.`);
            }
          }
        }
      }

      alert('User roles updated successfully!');
      await loadData();
      handleCloseRoleEditor();
    } catch (error: any) {
      console.error('Error updating user roles:', error);
      alert(`Error updating user roles: ${error.message}`);
    } finally {
      setSavingRoles(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all users from users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error loading users:', usersError);
      }

      // Load all user roles
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles:role_id (
            id,
            name,
            description
          )
        `);

      if (userRolesError) {
        console.error('Error loading user roles:', userRolesError);
      }

      // Build a map of user_id -> roles
      const rolesByUserId = new Map<string, string[]>();
      (userRoles || []).forEach((ur: any) => {
        const userId = ur.user_id;
        const roleName = ur.roles?.name;
        if (userId && roleName) {
          if (!rolesByUserId.has(userId)) {
            rolesByUserId.set(userId, []);
          }
          rolesByUserId.get(userId)!.push(roleName);
        }
      });

      // Combine users with their roles
      const usersWithRoles = (usersData || []).map((user: any) => ({
        id: user.id,
        email: user.email || `User ${user.id.substring(0, 8)}...`,
        roles: rolesByUserId.get(user.id) || [],
      }));

      // Load roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesError) {
        console.error('Error loading roles:', rolesError);
      }

      setUsers(usersWithRoles as any[]);
      setRoles(rolesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading users. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard__tab-content">
      <div className="admin-dashboard__admin-subtabs">
        <button
          className={`admin-dashboard__admin-subtab ${activeSubTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('users')}
        >
          👥 Users
        </button>
        {isSuperAdminRole && (
          <button
            className={`admin-dashboard__admin-subtab ${activeSubTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('roles')}
          >
            🔐 Roles & Permissions
          </button>
        )}
      </div>

      {activeSubTab === 'users' && (
        <Card variant="elevated" padding="lg">
          <div className="admin-dashboard__section-header">
            <div>
              <h2 className="admin-dashboard__editor-title">User Management</h2>
              <p className="admin-dashboard__editor-subtitle">Add, edit, and manage user accounts</p>
            </div>
            {isAdmin && (
              <Button variant="primary" size="md" onClick={() => {
                setShowUserForm(!showUserForm);
                if (!showUserForm) {
                  const newPassword = generatePassword();
                  setGeneratedPassword(newPassword);
                } else {
                  setGeneratedPassword('');
                }
              }}>
                {showUserForm ? 'Cancel' : '➕ Add User'}
              </Button>
            )}
          </div>

          {!isAdmin && (
            <div className="admin-dashboard__empty-state" style={{ marginTop: '2rem' }}>
              <p>⚠️ Only admins and super admins can add members.</p>
            </div>
          )}

          {showUserForm && isAdmin && (
            <form 
              className="admin-dashboard__form" 
              style={{ marginTop: '2rem' }}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!userFormData.email || !userFormData.role) {
                  alert('Please fill in all required fields.');
                  return;
                }

                try {
                  // Create user with generated password
                  const password = generatedPassword || generatePassword();
                  // Get production URL from environment or use current origin
                  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                  const redirectUrl = `${siteUrl}/admin`;
                  
                  const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: userFormData.email,
                    password: password,
                    options: {
                      emailRedirectTo: redirectUrl, // Redirect to admin login after email confirmation
                      data: {
                        must_change_password: true, // Flag to force password change on first login
                        temporary_password: password, // Store password temporarily (will be cleared after first login)
                        password: password, // Also store in Data for email template access
                        role: userFormData.role, // Include role in email
                      }
                    }
                  });

                  if (authError) {
                    alert(`Error creating user: ${authError.message}`);
                    return;
                  }

                  if (authData.user) {
                    // Store user email in users table
                    const { error: userEmailError } = await supabase
                      .from('users')
                      .upsert({
                        id: authData.user.id,
                        email: userFormData.email,
                        updated_at: new Date().toISOString(),
                      }, {
                        onConflict: 'id'
                      });

                    if (userEmailError) {
                      console.error('Error storing user email:', userEmailError);
                      // Continue anyway - email storage is not critical
                    }

                    // Get role ID
                    const { data: roleData } = await supabase
                      .from('roles')
                      .select('id')
                      .eq('name', userFormData.role)
                      .single();

                    if (roleData) {
                      // Assign role to user
                      const { error: roleError } = await supabase
                        .from('user_roles')
                        .insert({
                          user_id: authData.user.id,
                          role_id: roleData.id,
                        });

                      if (roleError) {
                        console.error('Error assigning role:', roleError);
                        alert('User created but failed to assign role. Please assign manually.');
                      } else {
                        // Copy password to clipboard
                        copyToClipboard(password);
                        
                        // Show success message with email instructions
                        const emailSubject = encodeURIComponent('Your My Refuge Admin Account');
                        const emailBody = encodeURIComponent(`Hello,

Your admin account has been created for My Refuge.

Login Details:
Email: ${userFormData.email}
Temporary Password: ${password}

IMPORTANT: You will be required to change this password on your first login for security reasons.

Login URL: ${window.location.origin}/admin

Please keep this password secure and do not share it with anyone.

Best regards,
My Refuge Admin Team`);
                        
                        const mailtoLink = `mailto:${userFormData.email}?subject=${emailSubject}&body=${emailBody}`;
                        
                        // Show alert with instructions
                        const shouldOpenEmail = confirm(
                          `User created successfully!\n\n` +
                          `Password: ${password}\n\n` +
                          `Password has been copied to clipboard.\n\n` +
                          `Would you like to open your email client to send this password to ${userFormData.email}?`
                        );
                        
                        if (shouldOpenEmail) {
                          window.location.href = mailtoLink;
                        }
                        
                        setShowUserForm(false);
                        setUserFormData({ email: '', role: '' });
                        setGeneratedPassword('');
                        await loadData();
                      }
                    } else {
                      alert('User created but role not found. Please assign role manually.');
                    }
                  }
                } catch (error: any) {
                  console.error('Error creating user:', error);
                  alert(`Error creating user: ${error.message}`);
                }
              }}
            >
              <div className="admin-dashboard__field">
                <label>Email *</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  required
                  placeholder="user@example.com"
                />
              </div>
              <div className="admin-dashboard__field">
                <label>Generated Password *</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    style={{ flex: 1, fontFamily: 'monospace', backgroundColor: '#F5F5F5' }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newPassword = generatePassword();
                      setGeneratedPassword(newPassword);
                    }}
                  >
                    🔄 Regenerate
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(generatedPassword)}
                  >
                    📋 Copy
                  </Button>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#757575', marginTop: '0.5rem' }}>
                  Copy this password and email it to the user. They will be required to change it on first login.
                </p>
              </div>
              <div className="admin-dashboard__field">
                <label>Role *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  required
                  className="admin-dashboard__select"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <Button type="submit" variant="primary" size="md">
                Create User
              </Button>
            </form>
          )}

          {loading ? (
            <div className="admin-dashboard__loading-state">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="admin-dashboard__empty-state">
              <p>No users found.</p>
              <p className="admin-dashboard__empty-hint">Click "Add User" to create a new user account.</p>
            </div>
          ) : (
            <div className="admin-dashboard__users-list" style={{ marginTop: '2rem' }}>
              {users.map((userItem) => (
                <div key={userItem.id} className="admin-dashboard__user-item">
                  <div>
                    <h3>{userItem.email || 'Email not available'}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#757575', marginTop: '0.25rem' }}>
                      User ID: {userItem.id}
                    </p>
                    <p>Roles: {userItem.roles?.join(', ') || 'No roles assigned'}</p>
                  </div>
                  {isSuperAdminRole && (
                    <div className="admin-dashboard__user-actions">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(userItem.id, userItem.email, userItem.roles || [])}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Role Editor Modal */}
          {editingUser && (
            <div 
              className="admin-dashboard__modal-overlay" 
              onClick={handleCloseRoleEditor}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '2rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div 
                className="admin-dashboard__modal" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  maxWidth: '500px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid #E8E8E8',
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    margin: 0,
                  }}>
                    Edit Roles: {editingUser.email}
                  </h3>
                  <button 
                    onClick={handleCloseRoleEditor}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '2rem',
                      color: '#757575',
                      cursor: 'pointer',
                      lineHeight: 1,
                      padding: 0,
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F5F5F5';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#757575';
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  {roles.length === 0 ? (
                    <p style={{ color: '#757575' }}>No roles available. Please create roles first.</p>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F8F9FA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.name)}
                          onChange={() => handleToggleRole(role.name)}
                          style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            cursor: 'pointer',
                            accentColor: '#007DFF',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{role.name}</div>
                          {role.description && (
                            <div style={{ fontSize: '0.875rem', color: '#757575', marginTop: '0.25rem' }}>
                              {role.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  padding: '1.5rem 2rem',
                  borderTop: '1px solid #E8E8E8',
                }}>
                  <Button 
                    variant="outline" 
                    size="md" 
                    onClick={handleCloseRoleEditor}
                    disabled={savingRoles}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={handleSaveRoles}
                    disabled={savingRoles}
                  >
                    {savingRoles ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {activeSubTab === 'roles' && (
        <Card variant="elevated" padding="lg">
          <div className="admin-dashboard__section-header">
            <div>
              <h2 className="admin-dashboard__editor-title">Roles & Permissions</h2>
              <p className="admin-dashboard__editor-subtitle">Manage user roles and their permissions</p>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowRoleForm(!showRoleForm)}>
              {showRoleForm ? 'Cancel' : '➕ Add Role'}
            </Button>
          </div>

          {showRoleForm && (
            <form className="admin-dashboard__form" style={{ marginTop: '2rem' }}>
              <div className="admin-dashboard__field">
                <label>Role Name *</label>
                <input
                  type="text"
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  required
                  placeholder="e.g., editor, moderator"
                />
              </div>
              <div className="admin-dashboard__field">
                <label>Description</label>
                <textarea
                  rows={2}
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="Role description"
                />
              </div>
              <div className="admin-dashboard__field">
                <label>Permissions</label>
                <div className="admin-dashboard__permissions-grid">
                  <label className="admin-dashboard__permission-item">
                    <input
                      type="checkbox"
                      checked={roleFormData.permissions.manageContent || false}
                      onChange={(e) =>
                        setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, manageContent: e.target.checked },
                        })
                      }
                    />
                    <span>Manage Content</span>
                  </label>
                  <label className="admin-dashboard__permission-item">
                    <input
                      type="checkbox"
                      checked={roleFormData.permissions.manageImages || false}
                      onChange={(e) =>
                        setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, manageImages: e.target.checked },
                        })
                      }
                    />
                    <span>Manage Images</span>
                  </label>
                  <label className="admin-dashboard__permission-item">
                    <input
                      type="checkbox"
                      checked={roleFormData.permissions.manageEvents || false}
                      onChange={(e) =>
                        setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, manageEvents: e.target.checked },
                        })
                      }
                    />
                    <span>Manage Events</span>
                  </label>
                  <label className="admin-dashboard__permission-item">
                    <input
                      type="checkbox"
                      checked={roleFormData.permissions.manageUsers || false}
                      onChange={(e) =>
                        setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, manageUsers: e.target.checked },
                        })
                      }
                    />
                    <span>Manage Users</span>
                  </label>
                  <label className="admin-dashboard__permission-item">
                    <input
                      type="checkbox"
                      checked={roleFormData.permissions.viewAnalytics || false}
                      onChange={(e) =>
                        setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, viewAnalytics: e.target.checked },
                        })
                      }
                    />
                    <span>View Analytics</span>
                  </label>
                </div>
              </div>
              <Button type="submit" variant="primary" size="md">
                Create Role
              </Button>
            </form>
          )}

          {loading ? (
            <div className="admin-dashboard__loading-state">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="admin-dashboard__empty-state">
              <p>No roles found.</p>
              <p className="admin-dashboard__empty-hint">Click "Add Role" to create a new role.</p>
            </div>
          ) : (
            <div className="admin-dashboard__roles-list" style={{ marginTop: '2rem' }}>
              {roles.map((role) => (
                <div key={role.id} className="admin-dashboard__role-item">
                  <div>
                    <h3>{role.name}</h3>
                    <p>{role.description || 'No description'}</p>
                    <div className="admin-dashboard__permissions">
                      <strong>Permissions:</strong>
                      <pre>{JSON.stringify(role.permissions, null, 2)}</pre>
                    </div>
                  </div>
                  <div className="admin-dashboard__role-actions">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        alert('Role editing coming soon!');
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        if (!confirm(`Are you sure you want to delete role "${role.name}"? This will remove it from all users.`)) {
                          return;
                        }
                        try {
                          // First, delete all user_roles entries for this role
                          const { error: userRolesError } = await supabase
                            .from('user_roles')
                            .delete()
                            .eq('role_id', role.id);

                          if (userRolesError) throw userRolesError;

                          // Then delete the role
                          const { error: roleError } = await supabase
                            .from('roles')
                            .delete()
                            .eq('id', role.id);

                          if (roleError) throw roleError;

                          alert('Role deleted successfully!');
                          await loadData();
                        } catch (error: any) {
                          console.error('Error deleting role:', error);
                          alert(`Error deleting role: ${error.message}`);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
