-- Add Section Content Table for Text Editing
-- Run this in Supabase Dashboard → SQL Editor
-- This adds support for editable text content with staging/publishing

-- Section content table for storing editable text
CREATE TABLE IF NOT EXISTS section_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  content_key TEXT NOT NULL, -- e.g., 'title', 'description', 'text-1', 'text-2'
  content_value TEXT NOT NULL DEFAULT '',
  published_content_value TEXT NOT NULL DEFAULT '',
  has_unpublished_changes BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(section, content_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_section_content_section ON section_content(section);
CREATE INDEX IF NOT EXISTS idx_section_content_key ON section_content(section, content_key);
CREATE INDEX IF NOT EXISTS idx_section_content_unpublished ON section_content(has_unpublished_changes);

-- Enable RLS
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for section_content
DROP POLICY IF EXISTS "Section content is viewable by everyone" ON section_content;
CREATE POLICY "Section content is viewable by everyone" ON section_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Section content is updatable by authenticated users" ON section_content;
CREATE POLICY "Section content is updatable by authenticated users" ON section_content
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Section content is insertable by authenticated users" ON section_content;
CREATE POLICY "Section content is insertable by authenticated users" ON section_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

