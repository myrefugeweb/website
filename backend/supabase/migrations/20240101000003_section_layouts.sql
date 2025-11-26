-- Section Layouts Migration
-- This migration adds support for multiple layout options per section

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

