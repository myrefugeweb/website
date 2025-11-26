import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSectionLayout = (section: string) => {
  const [layout, setLayout] = useState<string>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLayout();
  }, [section]);

  const loadLayout = async () => {
    try {
      const { data, error } = await supabase
        .from('section_layouts')
        .select('layout_type')
        .eq('section', section)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading layout:', error);
      } else if (data) {
        setLayout(data.layout_type || 'default');
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLayout = async (newLayout: string) => {
    try {
      const { error } = await supabase
        .from('section_layouts')
        .upsert({
          section,
          layout_type: newLayout,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setLayout(newLayout);
      return true;
    } catch (error) {
      console.error('Error updating layout:', error);
      return false;
    }
  };

  return { layout, loading, updateLayout };
};

