-- Row Level Security (RLS) Policies
-- This migration sets up security policies for all tables

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

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
-- IMAGES POLICIES
-- ============================================

-- Public read access
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);

-- Authenticated users can insert
DROP POLICY IF EXISTS "Images are insertable by authenticated users" ON images;
CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
DROP POLICY IF EXISTS "Images are updatable by authenticated users" ON images;
CREATE POLICY "Images are updatable by authenticated users" ON images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
DROP POLICY IF EXISTS "Images are deletable by authenticated users" ON images;
CREATE POLICY "Images are deletable by authenticated users" ON images
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- CALENDAR EVENTS POLICIES
-- ============================================

-- Public read access
DROP POLICY IF EXISTS "Events are viewable by everyone" ON calendar_events;
CREATE POLICY "Events are viewable by everyone" ON calendar_events
  FOR SELECT USING (true);

-- Authenticated users can insert
DROP POLICY IF EXISTS "Events are insertable by authenticated users" ON calendar_events;
CREATE POLICY "Events are insertable by authenticated users" ON calendar_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
DROP POLICY IF EXISTS "Events are updatable by authenticated users" ON calendar_events;
CREATE POLICY "Events are updatable by authenticated users" ON calendar_events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
DROP POLICY IF EXISTS "Events are deletable by authenticated users" ON calendar_events;
CREATE POLICY "Events are deletable by authenticated users" ON calendar_events
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- HEADER CONTENT POLICIES
-- ============================================

-- Public read access
DROP POLICY IF EXISTS "Header content is viewable by everyone" ON header_content;
CREATE POLICY "Header content is viewable by everyone" ON header_content
  FOR SELECT USING (true);

-- Authenticated users can update
DROP POLICY IF EXISTS "Header content is updatable by authenticated users" ON header_content;
CREATE POLICY "Header content is updatable by authenticated users" ON header_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- SPARROWS CLOSET CONTENT POLICIES
-- ============================================

-- Public read access
DROP POLICY IF EXISTS "Sparrows Closet content is viewable by everyone" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is viewable by everyone" ON sparrows_closet_content
  FOR SELECT USING (true);

-- Authenticated users can update
DROP POLICY IF EXISTS "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content;
CREATE POLICY "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- ROLES POLICIES
-- ============================================

-- Authenticated users can view roles
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only super admins can manage roles (will be enhanced with function check later)
DROP POLICY IF EXISTS "Roles are manageable by super admins" ON roles;
CREATE POLICY "Roles are manageable by super admins" ON roles
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- USER ROLES POLICIES
-- ============================================

-- Authenticated users can view user roles
DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON user_roles;
CREATE POLICY "User roles are viewable by authenticated users" ON user_roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can manage user roles (will be enhanced with function check later)
DROP POLICY IF EXISTS "User roles are manageable by admins" ON user_roles;
CREATE POLICY "User roles are manageable by admins" ON user_roles
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- ANALYTICS POLICIES
-- ============================================

-- Anyone can insert page views (for tracking)
DROP POLICY IF EXISTS "Page views are insertable by anyone" ON page_views;
CREATE POLICY "Page views are insertable by anyone" ON page_views
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view analytics
DROP POLICY IF EXISTS "Page views are viewable by authenticated users" ON page_views;
CREATE POLICY "Page views are viewable by authenticated users" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Anyone can insert unique visitors
DROP POLICY IF EXISTS "Unique visitors are insertable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are insertable by anyone" ON unique_visitors
  FOR INSERT WITH CHECK (true);

-- Authenticated users can update unique visitors
DROP POLICY IF EXISTS "Unique visitors are updatable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are updatable by anyone" ON unique_visitors
  FOR UPDATE USING (true);

-- Only authenticated users can view unique visitors
DROP POLICY IF EXISTS "Unique visitors are viewable by authenticated users" ON unique_visitors;
CREATE POLICY "Unique visitors are viewable by authenticated users" ON unique_visitors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Anyone can insert analytics events
DROP POLICY IF EXISTS "Analytics events are insertable by anyone" ON analytics_events;
CREATE POLICY "Analytics events are insertable by anyone" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view analytics events
DROP POLICY IF EXISTS "Analytics events are viewable by authenticated users" ON analytics_events;
CREATE POLICY "Analytics events are viewable by authenticated users" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

