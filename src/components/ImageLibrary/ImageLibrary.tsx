import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ImageUpload } from '../../lib/supabase';
import { Button } from '../Button';
import './ImageLibrary.css';

interface ImageLibraryProps {
  onSelectImage: (imageUrl: string) => void;
  onUpload?: () => void;
  currentImageUrl?: string;
}

interface ImageWithUsage extends ImageUpload {
  activeSections?: string[];
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ 
  onSelectImage, 
  onUpload,
  currentImageUrl 
}) => {
  const [images, setImages] = useState<ImageWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading images:', error);
      } else {
        // DEDUPLICATE: Show only unique images by URL (not by section+URL)
        // Group all images by URL to find duplicates
        const imagesByUrl = new Map<string, ImageUpload[]>();
        (data || []).forEach((img: ImageUpload) => {
          const existing = imagesByUrl.get(img.url) || [];
          existing.push(img);
          imagesByUrl.set(img.url, existing);
        });

        // For each unique URL, keep only ONE entry (prefer active, then most recent)
        const uniqueImages: ImageUpload[] = [];
        const activeSectionsByUrl = new Map<string, string[]>();

        imagesByUrl.forEach((imagesWithSameUrl, url) => {
          // Sort: active first, then by created_at (newest first)
          imagesWithSameUrl.sort((a, b) => {
            if (a.is_active !== b.is_active) {
              return a.is_active ? -1 : 1;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });

          // Keep only the first (best) entry
          const bestImage = imagesWithSameUrl[0];
          uniqueImages.push(bestImage);

          // Collect all active sections that use this URL
          const activeSections: string[] = [];
          imagesWithSameUrl.forEach((img) => {
            if (img.is_active && !activeSections.includes(img.section)) {
              activeSections.push(img.section);
            }
          });
          activeSectionsByUrl.set(url, activeSections);
        });

        // Add active sections info to each unique image
        const imagesWithUsage: ImageWithUsage[] = uniqueImages.map((img: ImageUpload) => ({
          ...img,
          activeSections: activeSectionsByUrl.get(img.url) || [],
        }));

        // Sort by created_at (newest first)
        imagesWithUsage.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setImages(imagesWithUsage);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('You must be logged in to upload images.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `image-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Add to database with a generic section (can be reassigned later)
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          section: 'library',
          url: publicUrl,
          alt_text: file.name,
          order_index: 0,
          is_active: true,
        });

      if (dbError) throw dbError;

      await loadImages();
      if (onUpload) onUpload();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image? This will remove it from all sections.')) return;

    try {
      // Find the image to get its URL
      const { data: imageToDelete } = await supabase
        .from('images')
        .select('url')
        .eq('id', id)
        .single();

      if (imageToDelete) {
        // Delete ALL entries with this URL (removes duplicates too)
        const { error } = await supabase
          .from('images')
          .delete()
          .eq('url', imageToDelete.url);
        
        if (error) throw error;
      } else {
        // Fallback: just delete by ID
        const { error } = await supabase.from('images').delete().eq('id', id);
        if (error) throw error;
      }
      
      await loadImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      alert(`Error deleting image: ${error.message}`);
    }
  };

  const handleCleanupDuplicates = async () => {
    if (!confirm('This will remove duplicate images (same section + URL). Continue?')) return;

    try {
      // Get all images
      const { data: allImages } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: true }); // Keep oldest

      if (!allImages) return;

      // Group by section+url and find duplicates
      const seen = new Map<string, string[]>();
      const idsToDelete: string[] = [];

      allImages.forEach((img) => {
        const key = `${img.section}:${img.url}`;
        if (!seen.has(key)) {
          seen.set(key, [img.id]);
        } else {
          // This is a duplicate - mark for deletion
          idsToDelete.push(img.id);
        }
      });

      if (idsToDelete.length > 0) {
        const { error } = await supabase
          .from('images')
          .delete()
          .in('id', idsToDelete);
        
        if (error) throw error;
        alert(`Removed ${idsToDelete.length} duplicate image(s).`);
        await loadImages();
      } else {
        alert('No duplicates found.');
      }
    } catch (error: any) {
      console.error('Error cleaning up duplicates:', error);
      alert(`Error cleaning up duplicates: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="image-library__loading">
        <p>Loading images...</p>
      </div>
    );
  }

  return (
    <div className="image-library">
      <div className="image-library__header">
        <h3 className="image-library__title">Image Library</h3>
        <div className="image-library__actions">
          <button
            className="image-library__cleanup-button"
            onClick={handleCleanupDuplicates}
            title="Remove duplicate images"
          >
            🧹 Clean Duplicates
          </button>
          <input
            type="file"
            id="image-library-upload"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-library-upload" className="image-library__upload-label">
            <span className="image-library__upload-button">
              {uploading ? 'Uploading...' : '📤 Upload New'}
            </span>
          </label>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="image-library__empty">
          <p>No images uploaded yet.</p>
          <p className="image-library__empty-hint">Upload your first image to get started!</p>
        </div>
      ) : (
        <div className="image-library__grid">
          {images.map((image) => (
            <div
              key={image.id}
              className={`image-library__item ${currentImageUrl === image.url ? 'image-library__item--selected' : ''}`}
              onClick={() => onSelectImage(image.url)}
            >
              <div className="image-library__item-preview">
                <img src={image.url} alt={image.alt_text || 'Image'} />
                {currentImageUrl === image.url && (
                  <div className="image-library__item-selected-badge">✓ Selected</div>
                )}
              </div>
              <div className="image-library__item-info">
                <div className="image-library__item-meta">
                  {image.activeSections && image.activeSections.length > 0 ? (
                    <p className="image-library__item-usage">
                      <span className="image-library__item-usage-label">✓ In use:</span>{' '}
                      <span className="image-library__item-usage-sections">
                        {image.activeSections.join(', ')}
                      </span>
                    </p>
                  ) : (
                    <p className="image-library__item-section">
                      <span className="image-library__item-section-label">Stored as:</span> {image.section}
                    </p>
                  )}
                  {image.is_active === false && (
                    <p className="image-library__item-inactive">⚠️ Inactive</p>
                  )}
                </div>
                <div className="image-library__item-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

