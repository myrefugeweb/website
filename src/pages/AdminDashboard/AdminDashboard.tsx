import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import type { ImageUpload, CalendarEvent, Sponsor } from '../../lib/supabase';
import { useUserRole } from '../../hooks/useUserRole';
import { LayoutPreview } from '../../components/LayoutPreview';
import './AdminDashboard.css';

type MainTab = 'edit-site' | 'events' | 'analytics' | 'admin';
type SiteTab = 'my-refuge' | 'sparrows-closet';
type SectionType = 'hero' | 'mission' | 'story' | 'help' | 'contact' | 'impact' | 'donation' | 'sponsors' | 'sparrows-closet-hero' | 'sparrows-closet-info' | 'sparrows-closet-impact' | 'sparrows-closet-cta';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('edit-site');
  const [activeSiteTab, setActiveSiteTab] = useState<SiteTab>('my-refuge');
  const [selectedSection, setSelectedSection] = useState<SectionType>('hero');
  const [user, setUser] = useState<any>(null);
  const { userRole, isSuperAdmin: isSuperAdminRole, loading: roleLoading } = useUserRole();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (!user || roleLoading) {
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
          <Button variant="outline" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="admin-dashboard__main-tabs">
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'edit-site' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('edit-site')}
        >
          ✏️ Edit Site
        </button>
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('events')}
        >
          📅 Events
        </button>
        <button
          className={`admin-dashboard__main-tab ${activeMainTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('analytics')}
        >
          📊 Analytics
        </button>
        {isSuperAdmin && (
          <button
            className={`admin-dashboard__main-tab ${activeMainTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('admin')}
          >
            👑 Admin
          </button>
        )}
      </div>

      <div className="admin-dashboard__content-area">
        {activeMainTab === 'edit-site' && (
          <EditSiteTab
            activeSiteTab={activeSiteTab}
            setActiveSiteTab={setActiveSiteTab}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        )}
        {activeMainTab === 'events' && <EventsTab />}
        {activeMainTab === 'analytics' && <AnalyticsTab />}
        {activeMainTab === 'admin' && isSuperAdmin && <SuperAdminTab />}
      </div>
    </div>
  );
};

// Edit Site Tab Component
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
};

// Sponsors Manager Component
const SponsorsManager: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
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

  const handleToggleActive = async (sponsor: Sponsor) => {
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

// Section Editor Component
const SectionEditor: React.FC<{ section: SectionType; siteTab: SiteTab }> = ({ section, siteTab: _siteTab }) => {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [layout, setLayout] = useState<string>('default');

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
        <div className="admin-dashboard__image-grid">
          {images.map((image) => (
            <div key={image.id} className="admin-dashboard__image-item">
              <div className="admin-dashboard__image-preview">
                <img src={image.url} alt={image.alt_text || ''} />
              </div>
              <div className="admin-dashboard__image-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
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
      .update({ is_active: false })
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
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      const weekStart = new Date(now.setDate(now.getDate() - 7)).toISOString();
      const monthStart = new Date(now.setMonth(now.getMonth() - 1)).toISOString();

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

      // Unique visitors
      const { count: visitorsToday } = await supabase
        .from('unique_visitors')
        .select('*', { count: 'exact', head: true })
        .gte('last_visit_at', todayStart);

      const { count: visitorsWeek } = await supabase
        .from('unique_visitors')
        .select('*', { count: 'exact', head: true })
        .gte('last_visit_at', weekStart);

      const { count: visitorsMonth } = await supabase
        .from('unique_visitors')
        .select('*', { count: 'exact', head: true })
        .gte('last_visit_at', monthStart);

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
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
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

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users from auth.users (via Supabase Admin API would be better, but we'll use what we have)
      // Note: We can't directly query auth.users, so we'll get users from user_roles
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

      // Get unique user IDs
      const userIds = [...new Set(userRoles?.map((ur: any) => ur.user_id) || [])];
      
      // For each user, get their roles
      // Note: We can't directly query auth.users without Admin API, so we'll show users from user_roles
      const usersWithRoles = userIds.map((userId) => {
        const userRoleData = userRoles?.filter((ur: any) => ur.user_id === userId) || [];
        return {
          id: userId,
          roles: userRoleData.map((ur: any) => ur.roles?.name).filter(Boolean),
        };
      });

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
        <button
          className={`admin-dashboard__admin-subtab ${activeSubTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('roles')}
        >
          🔐 Roles & Permissions
        </button>
      </div>

      {activeSubTab === 'users' && (
        <Card variant="elevated" padding="lg">
          <div className="admin-dashboard__section-header">
            <div>
              <h2 className="admin-dashboard__editor-title">User Management</h2>
              <p className="admin-dashboard__editor-subtitle">Add, edit, and manage user accounts</p>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowUserForm(!showUserForm)}>
              {showUserForm ? 'Cancel' : '➕ Add User'}
            </Button>
          </div>

          {showUserForm && (
            <form className="admin-dashboard__form" style={{ marginTop: '2rem' }}>
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
                <label>Password *</label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                />
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
                    <h3>User ID: {userItem.id}</h3>
                    <p>Roles: {userItem.roles?.join(', ') || 'No roles assigned'}</p>
                  </div>
                  <div className="admin-dashboard__user-actions">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
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
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Delete</Button>
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
