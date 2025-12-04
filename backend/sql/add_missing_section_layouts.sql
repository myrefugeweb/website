-- Add Missing Section Layouts
-- Run this in Supabase Dashboard → SQL Editor
-- This adds default layouts for sections that weren't included in the initial setup

-- Insert missing sections with default layouts
INSERT INTO section_layouts (section, layout_type) VALUES
  ('contact', 'default'),
  ('sparrows-closet', 'default'),
  ('sparrows-closet-hero', 'default'),
  ('sparrows-closet-info', 'default'),
  ('sparrows-closet-impact', 'default'),
  ('sparrows-closet-cta', 'default')
ON CONFLICT (section) DO NOTHING;

