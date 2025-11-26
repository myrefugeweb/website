-- ============================================
-- My Refuge - Complete Database Setup
-- ============================================
-- Run this entire file in Supabase Dashboard → SQL Editor
-- This will create all tables, policies, functions, and views
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ROLES AND PERMISSIONS
-- ============================================

-- Roles table for user permissions
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

-- Images table for dynamic image management
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Header content table
CREATE TABLE IF NOT EXISTS header_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'home',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page)
);

-- Sparrows Closet content table
CREATE TABLE IF NOT EXISTS sparrows_closet_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CALENDAR EVENTS
-- ============================================

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANALYTICS
-- ============================================

-- Page views tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  visitor_id TEXT, -- Generated client-side ID for tracking unique visitors
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique visitors tracking
CREATE TABLE IF NOT EXISTS unique_visitors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL, -- Generated client-side ID
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  UNIQUE(visitor_id)
);

-- Analytics events (clicks, form submissions, etc.)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'click', 'form_submit', 'download', 'donation_click', etc.
  event_name TEXT NOT NULL,
  page_path TEXT,
  element_id TEXT,
  element_text TEXT,
  metadata JSONB DEFAULT '{}',
  session_id TEXT,
  visitor_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Images indexes
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_images_section_active ON images(section, is_active);

-- Calendar events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_active ON calendar_events(is_active);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date_active ON calendar_events(date, is_active);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

CREATE INDEX IF NOT EXISTS idx_unique_visitors_visitor_id ON unique_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_last_visit ON unique_visitors(last_visit_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('super_admin', 'Full access to all features', '{"all": true, "manage_users": true, "manage_roles": true, "view_analytics": true}'::jsonb),
  ('admin', 'Can manage content and images', '{"manage_content": true, "manage_images": true, "manage_events": true, "view_analytics": true}'::jsonb),
  ('editor', 'Can edit content only', '{"manage_content": true, "manage_images": true}'::jsonb),
  ('viewer', 'Read-only access', '{"view": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default header content
INSERT INTO header_content (page, title, description) VALUES
  ('home', 'A PLACE TO BELONG', 'My Refuge in Bartlesville, Oklahoma, is an organization empowering at-risk youth through Christian mentoring, providing meals, clothing, and crisis aid to children and families in Washington County.')
ON CONFLICT (page) DO NOTHING;

-- Insert default Sparrows Closet content
INSERT INTO sparrows_closet_content (title, description) VALUES
  ('Sparrows Closet', 'Providing free clothing and hygiene items to families in need.')
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE header_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sparrows_closet_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - IMAGES
-- ============================================

DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Images are insertable by authenticated users" ON images;
CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Images are updatable by authenticated users" ON images;
CREATE POLICY "Images are updatable by authenticated users" ON images
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Images are deletable by authenticated users" ON images;
CREATE POLICY "Images are deletable by authenticated users" ON images
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - CALENDAR EVENTS
-- ============================================

DROP POLICY IF EXISTS "Events are viewable by everyone" ON calendar_events;
CREATE POLICY "Events are viewable by everyone" ON calendar_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Events are insertable by authenticated users" ON calendar_events;
CREATE POLICY "Events are insertable by authenticated users" ON calendar_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Events are updatable by authenticated users" ON calendar_events;
CREATE POLICY "Events are updatable by authenticated users" ON calendar_events
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Events are deletable by authenticated users" ON calendar_events;
CREATE POLICY "Events are deletable by authenticated users" ON calendar_events
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - HEADER CONTENT
-- ============================================

DROP POLICY IF EXISTS "Header content is viewable by everyone" ON header_content;
CREATE POLICY "Header content is viewable by everyone" ON header_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Header content is insertable by authenticated users" ON header_content;
CREATE POLICY "Header content is insertable by authenticated users" ON header_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Header content is updatable by authenticated users" ON header_content;
CREATE POLICY "Header content is updatable by authenticated users" ON header_content
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Header content is deletable by authenticated users" ON header_content;
CREATE POLICY "Header content is deletable by authenticated users" ON header_content
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - SPARROWS CLOSET CONTENT
-- ============================================

DROP POLICY IF EXISTS "Sparrows Closet content is viewable by everyone" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is viewable by everyone" ON sparrows_closet_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sparrows Closet content is insertable by authenticated users" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is insertable by authenticated users" ON sparrows_closet_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sparrows Closet content is deletable by authenticated users" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is deletable by authenticated users" ON sparrows_closet_content
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - ROLES
-- ============================================

DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Roles are insertable by authenticated users" ON roles;
CREATE POLICY "Roles are insertable by authenticated users" ON roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Roles are updatable by authenticated users" ON roles;
CREATE POLICY "Roles are updatable by authenticated users" ON roles
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Roles are deletable by authenticated users" ON roles;
CREATE POLICY "Roles are deletable by authenticated users" ON roles
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - USER ROLES
-- ============================================

DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON user_roles;
CREATE POLICY "User roles are viewable by authenticated users" ON user_roles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "User roles are insertable by authenticated users" ON user_roles;
CREATE POLICY "User roles are insertable by authenticated users" ON user_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "User roles are updatable by authenticated users" ON user_roles;
CREATE POLICY "User roles are updatable by authenticated users" ON user_roles
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "User roles are deletable by authenticated users" ON user_roles;
CREATE POLICY "User roles are deletable by authenticated users" ON user_roles
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - ANALYTICS
-- ============================================

DROP POLICY IF EXISTS "Page views are insertable by anyone" ON page_views;
CREATE POLICY "Page views are insertable by anyone" ON page_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Page views are viewable by authenticated users" ON page_views;
CREATE POLICY "Page views are viewable by authenticated users" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Page views are not updatable" ON page_views;
CREATE POLICY "Page views are not updatable" ON page_views
  FOR UPDATE USING (false);

DROP POLICY IF EXISTS "Page views are not deletable" ON page_views;
CREATE POLICY "Page views are not deletable" ON page_views
  FOR DELETE USING (false);

DROP POLICY IF EXISTS "Unique visitors are insertable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are insertable by anyone" ON unique_visitors
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Unique visitors are updatable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are updatable by anyone" ON unique_visitors
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Unique visitors are viewable by authenticated users" ON unique_visitors;
CREATE POLICY "Unique visitors are viewable by authenticated users" ON unique_visitors
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Unique visitors are not deletable" ON unique_visitors;
CREATE POLICY "Unique visitors are not deletable" ON unique_visitors
  FOR DELETE USING (false);

DROP POLICY IF EXISTS "Analytics events are insertable by anyone" ON analytics_events;
CREATE POLICY "Analytics events are insertable by anyone" ON analytics_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Analytics events are viewable by authenticated users" ON analytics_events;
CREATE POLICY "Analytics events are viewable by authenticated users" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Analytics events are not updatable" ON analytics_events;
CREATE POLICY "Analytics events are not updatable" ON analytics_events
  FOR UPDATE USING (false);

DROP POLICY IF EXISTS "Analytics events are not deletable" ON analytics_events;
CREATE POLICY "Analytics events are not deletable" ON analytics_events
  FOR DELETE USING (false);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (
      r.permissions->>'all' = 'true'
      OR r.permissions->>permission_name = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- View for daily page views summary
CREATE OR REPLACE VIEW daily_page_views AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
GROUP BY DATE(created_at), page_path
ORDER BY date DESC, views DESC;

-- View for analytics summary
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_page_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'desktop' THEN visitor_id END) as desktop_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'mobile' THEN visitor_id END) as mobile_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'tablet' THEN visitor_id END) as tablet_visitors
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View for top pages
CREATE OR REPLACE VIEW top_pages AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY total_views DESC
LIMIT 20;

-- View for event analytics
CREATE OR REPLACE VIEW event_analytics AS
SELECT 
  event_type,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  DATE(created_at) as date
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_type, event_name, DATE(created_at)
ORDER BY date DESC, event_count DESC;

-- ============================================
-- SECTION LAYOUTS
-- ============================================

-- Section layouts table
CREATE TABLE IF NOT EXISTS section_layouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  layout_type TEXT NOT NULL DEFAULT 'default',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_section_layouts_section ON section_layouts(section);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsors_order ON sponsors(order_index);

-- Enable RLS
ALTER TABLE section_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for section_layouts
DROP POLICY IF EXISTS "Section layouts are viewable by everyone" ON section_layouts;
CREATE POLICY "Section layouts are viewable by everyone" ON section_layouts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Section layouts are updatable by authenticated users" ON section_layouts;
CREATE POLICY "Section layouts are updatable by authenticated users" ON section_layouts
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Section layouts are insertable by authenticated users" ON section_layouts;
CREATE POLICY "Section layouts are insertable by authenticated users" ON section_layouts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for sponsors
DROP POLICY IF EXISTS "Sponsors are viewable by everyone" ON sponsors;
CREATE POLICY "Sponsors are viewable by everyone" ON sponsors
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sponsors are insertable by authenticated users" ON sponsors;
CREATE POLICY "Sponsors are insertable by authenticated users" ON sponsors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sponsors are updatable by authenticated users" ON sponsors;
CREATE POLICY "Sponsors are updatable by authenticated users" ON sponsors
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sponsors are deletable by authenticated users" ON sponsors;
CREATE POLICY "Sponsors are deletable by authenticated users" ON sponsors
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default layouts
INSERT INTO section_layouts (section, layout_type) VALUES
  ('hero', 'default'),
  ('mission', 'default'),
  ('help', 'default'),
  ('story', 'default'),
  ('impact', 'default')
ON CONFLICT (section) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables, policies, functions, and views have been created.
-- Next steps:
-- 1. Create storage bucket 'images' in Storage section
-- 2. Assign roles to users via admin dashboard
-- ============================================

