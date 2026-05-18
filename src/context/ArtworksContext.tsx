import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ArtworkCopy, Image } from '../components/types';
import { staticImages } from '../data/images';
import {
  deleteArtwork,
  fetchArtworksFromDb,
  updateArtwork,
  uploadArtwork,
} from '../services/artworks';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchFeaturedArtworkId,
  setFeaturedArtworkId,
} from '../services/siteSettings';
import { useAuth } from './AuthContext';

interface ArtworksContextValue {
  images: Image[];
  featuredId: string | null;
  featuredImage: Image | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setFeaturedImage: (artworkId: string) => Promise<void>;
  addImage: (input: ArtworkCopy & { file: File }) => Promise<void>;
  removeImage: (image: Image) => Promise<void>;
  updateImage: (id: string, data: ArtworkCopy) => Promise<void>;
}

const ArtworksContext = createContext<ArtworksContextValue | null>(null);

const resolveFeaturedImage = (
  images: Image[],
  featuredId: string | null
): Image | null => {
  if (images.length === 0) return null;
  if (featuredId) {
    const match = images.find((img) => img.id === featuredId);
    if (match) return match;
  }
  return images[0];
};

export const ArtworksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [images, setImages] = useState<Image[]>(staticImages);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedId = useCallback(async (gallery: Image[]) => {
    try {
      const stored = await fetchFeaturedArtworkId();
      const resolved = resolveFeaturedImage(gallery, stored);
      setFeaturedId(resolved?.id ?? null);
    } catch {
      setFeaturedId(resolveFeaturedImage(gallery, null)?.id ?? null);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setImages(staticImages);
      await loadFeaturedId(staticImages);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dbImages = await fetchArtworksFromDb();
      const gallery = dbImages.length > 0 ? dbImages : staticImages;
      setImages(gallery);
      await loadFeaturedId(gallery);
    } catch (err) {
      setImages(staticImages);
      await loadFeaturedId(staticImages);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [loadFeaturedId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setFeaturedImage = useCallback(
    async (artworkId: string) => {
      const exists = images.some((img) => img.id === artworkId);
      if (!exists) {
        throw new Error('Artwork not found');
      }

      await setFeaturedArtworkId(artworkId);
      setFeaturedId(artworkId);
    },
    [images]
  );

  const addImage = useCallback(
    async (input: ArtworkCopy & { file: File }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const created = await uploadArtwork({
        ...input,
        userId: user.id,
      });

      setImages((prev) => [...prev, created]);
    },
    [user]
  );

  const updateImage = useCallback(async (id: string, data: ArtworkCopy) => {
    const localized = {
      titleEn: data.titleEn.trim(),
      titlePl: data.titlePl.trim(),
      descriptionEn: data.descriptionEn.trim(),
      descriptionPl: data.descriptionPl.trim(),
    };

    if (isSupabaseConfigured) {
      const updated = await updateArtwork(id, localized);
      setImages((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return;
    }

    setImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...localized } : item))
    );
  }, []);

  const removeImage = useCallback(
    async (image: Image) => {
      await deleteArtwork(image);

      setImages((prev) => {
        const next = prev.filter((item) => item.id !== image.id);
        if (featuredId === image.id) {
          const fallback = next[0];
          if (fallback) {
            void setFeaturedArtworkId(fallback.id);
            setFeaturedId(fallback.id);
          } else {
            setFeaturedId(null);
          }
        }
        return next;
      });
    },
    [featuredId]
  );

  const featuredImage = useMemo(
    () => resolveFeaturedImage(images, featuredId),
    [images, featuredId]
  );

  const value = useMemo(
    () => ({
      images,
      featuredId: featuredImage?.id ?? featuredId,
      featuredImage,
      loading,
      error,
      refresh,
      setFeaturedImage,
      addImage,
      removeImage,
      updateImage,
    }),
    [
      images,
      featuredId,
      featuredImage,
      loading,
      error,
      refresh,
      setFeaturedImage,
      addImage,
      removeImage,
      updateImage,
    ]
  );

  return (
    <ArtworksContext.Provider value={value}>
      {children}
    </ArtworksContext.Provider>
  );
};

export const useArtworks = (): ArtworksContextValue => {
  const ctx = useContext(ArtworksContext);
  if (!ctx) {
    throw new Error('useArtworks must be used within ArtworksProvider');
  }
  return ctx;
};
