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

        // Fetch all images for this section
        // Try to get both is_active and published_is_active, but fallback to just is_active if needed
        let query = supabase
          .from('images')
          .select('url, alt_text, is_active, published_is_active')
          .eq('section', section)
          .order('order_index', { ascending: true });

        const { data, error } = await query;

        // Log errors for debugging
        if (error) {
          console.error(`[DynamicImage ${section}] Query error:`, error);
          
          // If the error is about missing columns, try a simpler query
          if (error.message?.includes('column') || error.code === '42703') {
            console.warn(`[DynamicImage ${section}] Retrying with simpler query (is_active only)`);
            const { data: simpleData, error: simpleError } = await supabase
              .from('images')
              .select('url, alt_text, is_active')
              .eq('section', section)
              .eq('is_active', true)
              .order('order_index', { ascending: true })
              .limit(1)
              .maybeSingle();
            
            if (simpleError) {
              console.error(`[DynamicImage ${section}] Simple query also failed:`, simpleError);
            } else if (simpleData) {
              setImageUrl(simpleData.url);
              setLoading(false);
              return;
            }
          }
          
          // For other errors, check if they're expected
          const isExpectedError = 
            error.code === 'PGRST116' || // No rows returned
            error.code === 'PGRST301' || // Not found
            error.message?.includes('406') || // RLS policy issue
            error.message?.includes('JWT') || // Auth issue
            error.message?.includes('key'); // Config issue
          
          if (!isExpectedError) {
            console.error(`[DynamicImage ${section}] Unexpected error:`, error);
          }
        }

        // Filter client-side based on staging mode
        let filteredData = null;
        if (data && data.length > 0) {
          console.log(`[DynamicImage ${section}] Found ${data.length} image(s), stagingMode: ${stagingMode}`);
          
          if (stagingMode) {
            // In staging mode, use is_active (draft)
            filteredData = data.find(img => img.is_active === true);
            console.log(`[DynamicImage ${section}] Staging mode - looking for is_active=true`);
          } else {
            // In public mode, try published_is_active first, fallback to is_active
            filteredData = data.find(img => {
              // Check if published_is_active exists and is true
              if (img.published_is_active !== undefined && img.published_is_active !== null) {
                return img.published_is_active === true;
              }
              // Fallback: if published_is_active doesn't exist or is null, use is_active
              return img.is_active === true;
            });
            console.log(`[DynamicImage ${section}] Public mode - looking for published_is_active=true or is_active=true`);
          }
          
          console.log(`[DynamicImage ${section}] Filtered result:`, filteredData ? filteredData.url : 'none');
        } else {
          console.log(`[DynamicImage ${section}] No data returned from query`);
        }

        if (filteredData) {
          console.log(`[DynamicImage ${section}] Found image:`, filteredData.url);
          setImageUrl(filteredData.url);
        } else {
          console.warn(`[DynamicImage ${section}] No matching image found. Data:`, data);
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

