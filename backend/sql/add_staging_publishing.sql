-- Add Staging/Publishing Support
-- Run this in Supabase Dashboard → SQL Editor
-- This adds support for staging changes before publishing them live

-- Add staging columns to section_layouts
ALTER TABLE section_layouts 
  ADD COLUMN IF NOT EXISTS published_layout_type TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Initialize published_layout_type with current layout_type for existing records
UPDATE section_layouts 
SET published_layout_type = layout_type,
    has_unpublished_changes = false,
    published_at = updated_at
WHERE published_layout_type IS NULL;

-- Set published_at for records that don't have it
UPDATE section_layouts 
SET published_at = updated_at
WHERE published_at IS NULL AND updated_at IS NOT NULL;

-- Add staging columns to images table
ALTER TABLE images
  ADD COLUMN IF NOT EXISTS published_is_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

-- Initialize published_is_active with current is_active for existing records
UPDATE images 
SET published_is_active = is_active,
    has_unpublished_changes = false
WHERE published_is_active IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_section_layouts_unpublished ON section_layouts(has_unpublished_changes);
CREATE INDEX IF NOT EXISTS idx_images_unpublished ON images(has_unpublished_changes);

