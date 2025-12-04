import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStagingMode } from '../contexts/StagingContext';

export const useSectionLayout = (section: string, stagingModeOverride?: boolean) => {
  const { stagingMode: contextStagingMode } = useStagingMode();
  const stagingMode = stagingModeOverride !== undefined ? stagingModeOverride : contextStagingMode;
  const [layout, setLayout] = useState<string>('default');
  const [loading, setLoading] = useState(true);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);

  useEffect(() => {
    loadLayout();
  }, [section, stagingMode]);

  const loadLayout = async () => {
    try {
      const { data, error } = await supabase
        .from('section_layouts')
        .select('layout_type, published_layout_type, has_unpublished_changes')
        .eq('section', section)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading layout:', error);
        // Default to 'default' on error
        setLayout('default');
        setHasUnpublishedChanges(false);
      } else if (data) {
        // In staging mode (admin), use layout_type (draft)
        // In public mode, use published_layout_type (published)
        const layoutToUse = stagingMode 
          ? (data.layout_type || 'default')
          : (data.published_layout_type || data.layout_type || 'default');
        
        setLayout(layoutToUse);
        setHasUnpublishedChanges(data.has_unpublished_changes || false);
      } else {
        // No data found, default to 'default'
        setLayout('default');
        setHasUnpublishedChanges(false);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      // Default to 'default' on error
      setLayout('default');
      setHasUnpublishedChanges(false);
    } finally {
      setLoading(false);
    }
  };

  const updateLayout = async (newLayout: string) => {
    try {
      // First, check if the section exists
      const { data: existing } = await supabase
        .from('section_layouts')
        .select('section, published_layout_type')
        .eq('section', section)
        .maybeSingle();

      const publishedLayout = existing?.published_layout_type || 'default';
      const hasChanges = newLayout !== publishedLayout;

      if (existing) {
        // Update existing - save to staging (layout_type), mark as unpublished if different from published
        const { error } = await supabase
          .from('section_layouts')
          .update({
            layout_type: newLayout,
            has_unpublished_changes: hasChanges,
            updated_at: new Date().toISOString(),
          })
          .eq('section', section);

        if (error) throw error;
      } else {
        // Insert new - set both staging and published to same value initially
        const { error } = await supabase
          .from('section_layouts')
          .insert({
            section,
            layout_type: newLayout,
            published_layout_type: newLayout,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setLayout(newLayout);
      setHasUnpublishedChanges(hasChanges);
      return true;
    } catch (error) {
      console.error('Error updating layout:', error);
      return false;
    }
  };

  const publishLayout = async () => {
    try {
      const { data: current } = await supabase
        .from('section_layouts')
        .select('layout_type')
        .eq('section', section)
        .maybeSingle();

      if (!current) {
        throw new Error('Section layout not found');
      }

      // Copy staging layout to published
      const { error } = await supabase
        .from('section_layouts')
        .update({
          published_layout_type: current.layout_type,
          has_unpublished_changes: false,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('section', section);

      if (error) throw error;

      setHasUnpublishedChanges(false);
      return true;
    } catch (error) {
      console.error('Error publishing layout:', error);
      return false;
    }
  };

  return { layout, loading, updateLayout, publishLayout, hasUnpublishedChanges };
};

