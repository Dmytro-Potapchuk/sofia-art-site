import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Image } from '../components/types';
import { staticImages } from '../data/images';
import {
  deleteArtwork,
  fetchArtworksFromDb,
  uploadArtwork,
} from '../services/artworks';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ArtworksContextValue {
  images: Image[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addImage: (input: {
    title: string;
    description: string;
    file: File;
  }) => Promise<void>;
  removeImage: (image: Image) => Promise<void>;
}

const ArtworksContext = createContext<ArtworksContextValue | null>(null);

export const ArtworksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [images, setImages] = useState<Image[]>(staticImages);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setImages(staticImages);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dbImages = await fetchArtworksFromDb();
      setImages(dbImages.length > 0 ? dbImages : staticImages);
    } catch (err) {
      setImages(staticImages);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addImage = useCallback(
    async (input: { title: string; description: string; file: File }) => {
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

  const removeImage = useCallback(async (image: Image) => {
    await deleteArtwork(image);
    setImages((prev) => prev.filter((item) => item.id !== image.id));
  }, []);

  const value = useMemo(
    () => ({
      images,
      loading,
      error,
      refresh,
      addImage,
      removeImage,
    }),
    [images, loading, error, refresh, addImage, removeImage]
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
