import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useStagingMode } from '../contexts/StagingContext';

export interface SectionContent {
  [key: string]: string; // content_key -> content_value
}

export const useSectionContent = (section: string) => {
  const [content, setContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const { stagingMode } = useStagingMode();

  const loadContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('section_content')
        .select('content_key, content_value, published_content_value, has_unpublished_changes')
        .eq('section', section)
        .order('order_index', { ascending: true });

      // Handle table not found gracefully (PGRST205 = table doesn't exist)
      if (error) {
        if (error.code === 'PGRST205' || error.code === 'PGRST116') {
          // Table doesn't exist yet or no rows - this is expected before migration
          // Silently use empty content
          setContent({});
          setHasUnpublishedChanges(false);
        } else {
          // Only log unexpected errors
          console.error('Error loading content:', error);
          setContent({});
          setHasUnpublishedChanges(false);
        }
      } else if (data) {
        const contentMap: SectionContent = {};
        let hasUnpublished = false;

        data.forEach((item) => {
          // In staging mode (admin), use content_value (draft)
          // In public mode, use published_content_value (published)
          const valueToUse = stagingMode
            ? (item.content_value || '')
            : (item.published_content_value || item.content_value || '');
          
          contentMap[item.content_key] = valueToUse;
          
          if (item.has_unpublished_changes) {
            hasUnpublished = true;
          }
        });

        setContent(contentMap);
        setHasUnpublishedChanges(hasUnpublished);
      } else {
        setContent({});
        setHasUnpublishedChanges(false);
      }
    } catch (error: any) {
      // Handle table not found in catch block too
      if (error?.code === 'PGRST205' || error?.code === 'PGRST116') {
        setContent({});
        setHasUnpublishedChanges(false);
      } else {
        console.error('Error loading content:', error);
        setContent({});
        setHasUnpublishedChanges(false);
      }
    } finally {
      setLoading(false);
    }
  }, [section, stagingMode]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Listen for content update events to reload immediately
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { section: updatedSection } = event.detail;
      // Reload if this section was updated
      if (updatedSection === section) {
        loadContent();
      }
    };

    window.addEventListener('content-updated', handleContentUpdate as EventListener);
    return () => {
      window.removeEventListener('content-updated', handleContentUpdate as EventListener);
    };
  }, [section, loadContent]);


  const updateContent = async (contentKey: string, newValue: string) => {
    try {
      // First, check if the content exists
      const { data: existing } = await supabase
        .from('section_content')
        .select('published_content_value')
        .eq('section', section)
        .eq('content_key', contentKey)
        .maybeSingle();

      const publishedValue = existing?.published_content_value || '';
      const hasChanges = newValue !== publishedValue;

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('section_content')
          .update({
            content_value: newValue,
            has_unpublished_changes: hasChanges,
            updated_at: new Date().toISOString(),
          })
          .eq('section', section)
          .eq('content_key', contentKey);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('section_content')
          .insert({
            section,
            content_key: contentKey,
            content_value: newValue,
            published_content_value: newValue,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setContent(prev => ({ ...prev, [contentKey]: newValue }));
      setHasUnpublishedChanges(hasChanges);
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      return false;
    }
  };

  const publishContent = async () => {
    try {
      // Get all current staging content for this section
      const { data: stagingContent } = await supabase
        .from('section_content')
        .select('content_key, content_value')
        .eq('section', section);

      if (!stagingContent) return true;

      // Publish all staging content
      for (const item of stagingContent) {
        const { error } = await supabase
          .from('section_content')
          .update({
            published_content_value: item.content_value,
            has_unpublished_changes: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('section', section)
          .eq('content_key', item.content_key);

        if (error) {
          console.error(`Error publishing ${item.content_key}:`, error);
        }
      }

      setHasUnpublishedChanges(false);
      return true;
    } catch (error) {
      console.error('Error publishing content:', error);
      return false;
    }
  };

  return { content, loading, updateContent, publishContent, hasUnpublishedChanges };
};

