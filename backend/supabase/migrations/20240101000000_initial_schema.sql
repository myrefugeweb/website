-- Initial Schema Migration
-- This migration creates all the base tables for My Refuge

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

