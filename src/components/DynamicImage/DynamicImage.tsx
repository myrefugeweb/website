import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStagingMode } from '../../contexts/StagingContext';
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
  const { stagingMode } = useStagingMode();

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

        // Fetch all images for this section (PostgREST has issues filtering on published_is_active)
        // We'll filter client-side based on staging mode
        const { data, error } = await supabase
          .from('images')
          .select('url, alt_text, is_active, published_is_active')
          .eq('section', section)
          .order('order_index', { ascending: true });

        // Filter client-side based on staging mode
        let filteredData = null;
        if (data && data.length > 0) {
          if (stagingMode) {
            // In staging mode, use is_active (draft)
            filteredData = data.find(img => img.is_active === true);
          } else {
            // In public mode, use published_is_active (published)
            filteredData = data.find(img => img.published_is_active === true);
          }
        }

        // PGRST116 is "no rows returned" - this is expected if no image exists
        // 406 errors are RLS policy issues - handled gracefully by showing placeholder
        // Suppress these errors in console to avoid spam
        if (error) {
          const isExpectedError = 
            error.code === 'PGRST116' || // No rows returned
            error.code === 'PGRST301' || // Not found
            error.message?.includes('406') || // RLS policy issue
            error.message?.includes('JWT') || // Auth issue
            error.message?.includes('key'); // Config issue
          
          // Only log unexpected errors
          if (!isExpectedError) {
            console.error('Error loading image:', error);
          }
        }

        if (filteredData) {
          setImageUrl(filteredData.url);
        }
      } catch (error: any) {
        // Silently handle errors - just show placeholder
        // Suppress expected errors (RLS, auth, config issues)
        const isExpectedError = 
          error?.message?.includes('406') || // RLS policy issue
          error?.message?.includes('JWT') || // Auth issue
          error?.message?.includes('key') || // Config issue
          error?.code === 'PGRST116' || // No rows
          error?.code === 'PGRST301'; // Not found
        
        if (!isExpectedError && error?.message) {
          console.error('Error loading image:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [section, stagingMode]);

  if (loading) {
    return (
      <div className={`dynamic-image dynamic-image--loading ${className}`}>
        <div className="dynamic-image__placeholder">Loading...</div>
      </div>
    );
  }

  if (!imageUrl && !fallback) {
    return (
      <div 
        className={`dynamic-image dynamic-image--placeholder ${className}`}
        data-section={section}
        data-editable-type="image"
        data-editable={`img-${section}-0`}
        data-editable-section={section}
      >
        <div className="dynamic-image__placeholder">No image available</div>
      </div>
    );
  }

  const handleImageError = () => {
    // If image fails to load, set to null to show placeholder
    setImageUrl(null);
  };

  return (
    <img
      src={imageUrl || fallback}
      alt={alt || `Image for ${section}`}
      className={`dynamic-image ${className}`}
      loading="lazy"
      data-section={section}
      data-editable-type="image"
      onError={handleImageError}
    />
  );
};

