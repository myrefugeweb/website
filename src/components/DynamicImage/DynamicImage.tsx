import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './DynamicImage.css';

export interface DynamicImageProps {
  section: string;
  className?: string;
  fallback?: string;
  alt?: string;
}

export const DynamicImage: React.FC<DynamicImageProps> = ({
  section,
  className = '',
  fallback,
  alt,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Check if Supabase is properly configured
        if (!supabase) {
          setLoading(false);
          return;
        }

        // Check if we have a valid anon key (not dummy)
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        if (!anonKey || anonKey === 'dummy-key-for-initialization') {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('images')
          .select('url, alt_text')
          .eq('section', section)
          .eq('is_active', true)
          .order('order_index', { ascending: true })
          .limit(1)
          .single();

        // PGRST116 is "no rows returned" - this is expected if no image exists
        if (error && error.code !== 'PGRST116') {
          // Only log if it's not a missing key error
          if (!error.message.includes('JWT') && !error.message.includes('key')) {
            console.error('Error loading image:', error);
          }
        }

        if (data) {
          setImageUrl(data.url);
        }
      } catch (error: any) {
        // Silently handle errors - just show placeholder
        // Don't log if it's a Supabase auth error
        if (error?.message && !error.message.includes('JWT') && !error.message.includes('key')) {
          console.error('Error loading image:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [section]);

  if (loading) {
    return (
      <div className={`dynamic-image dynamic-image--loading ${className}`}>
        <div className="dynamic-image__placeholder">Loading...</div>
      </div>
    );
  }

  if (!imageUrl && !fallback) {
    return (
      <div className={`dynamic-image dynamic-image--placeholder ${className}`}>
        <div className="dynamic-image__placeholder">No image available</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl || fallback}
      alt={alt || `Image for ${section}`}
      className={`dynamic-image ${className}`}
      loading="lazy"
    />
  );
};

