-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('super_admin', 'Full access to all features', '{"all": true}'::jsonb),
  ('admin', 'Can manage content and images', '{"manage_content": true, "manage_images": true, "manage_events": true}'::jsonb),
  ('editor', 'Can edit content only', '{"manage_content": true}'::jsonb),
  ('viewer', 'Read-only access', '{"view": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default header content
INSERT INTO header_content (page, title, description) VALUES
  ('home', 'A PLACE TO BELONG', 'My Refuge in Bartlesville, Oklahoma, is an organization empowering at-risk youth through Christian mentoring, providing meals, clothing, and crisis aid to children and families in Washington County.')
ON CONFLICT (page) DO NOTHING;

-- Insert default Sparrows Closet content
INSERT INTO sparrows_closet_content (title, description) VALUES
  ('Sparrows Closet', 'A dedicated branch of My Refuge, providing free clothing and hygiene items to low-income and foster families.')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE header_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sparrows_closet_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images (public read, authenticated write)
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);

CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Images are updatable by authenticated users" ON images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Images are deletable by authenticated users" ON images
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for calendar_events (public read, authenticated write)
CREATE POLICY "Events are viewable by everyone" ON calendar_events
  FOR SELECT USING (true);

CREATE POLICY "Events are insertable by authenticated users" ON calendar_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events are updatable by authenticated users" ON calendar_events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Events are deletable by authenticated users" ON calendar_events
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for header_content (public read, authenticated write)
CREATE POLICY "Header content is viewable by everyone" ON header_content
  FOR SELECT USING (true);

CREATE POLICY "Header content is updatable by authenticated users" ON header_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for sparrows_closet_content (public read, authenticated write)
CREATE POLICY "Sparrows Closet content is viewable by everyone" ON sparrows_closet_content
  FOR SELECT USING (true);

CREATE POLICY "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for roles (authenticated read, super_admin write)
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for user_roles (authenticated read, admin write)
CREATE POLICY "User roles are viewable by authenticated users" ON user_roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "User roles are manageable by admins" ON user_roles
  FOR ALL USING (auth.role() = 'authenticated');

