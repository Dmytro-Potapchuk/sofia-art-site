import { Image } from '../components/types';
import {
  ARTWORKS_BUCKET,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

interface ArtworkRow {
  id: string;
  title: string;
  description: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
}

const mapRow = (row: ArtworkRow): Image => ({
  id: row.id,
  title: row.title,
  description: row.description,
  url: row.url,
  storagePath: row.storage_path,
});

const formatDbError = (error: { message: string; details?: string }): string =>
  error.details ? `${error.message} (${error.details})` : error.message;

/** PostgreSQL integer max; Date.now() to za duze na sort_order */
const getNextSortOrder = async (): Promise<number> => {
  if (!supabase) return 1;

  const { data, error } = await supabase
    .from('artworks')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const current = data?.sort_order ?? 0;
  return typeof current === 'number' ? current + 1 : 1;
};

export const fetchArtworksFromDb = async (): Promise<Image[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('artworks')
    .select('id, title, description, url, storage_path, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as ArtworkRow[]).map(mapRow);
};

export interface UploadArtworkInput {
  title: string;
  description: string;
  file: File;
  userId: string;
}

export const uploadArtwork = async ({
  title,
  description,
  file,
  userId,
}: UploadArtworkInput): Promise<Image> => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${Date.now()}-${safeName || `image.${extension}`}`;

  const { error: uploadError } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage
    .from(ARTWORKS_BUCKET)
    .getPublicUrl(storagePath);

  const sortOrder = await getNextSortOrder();

  const { data, error } = await supabase
    .from('artworks')
    .insert({
      title: title.trim(),
      description: description.trim(),
      url: publicData.publicUrl,
      storage_path: storagePath,
      sort_order: sortOrder,
    })
    .select('id, title, description, url, storage_path, sort_order')
    .single();

  if (error) {
    await supabase.storage.from(ARTWORKS_BUCKET).remove([storagePath]);
    throw new Error(formatDbError(error));
  }

  return mapRow(data as ArtworkRow);
};

export const deleteArtwork = async (image: Image): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  if (image.storagePath) {
    const { error: storageError } = await supabase.storage
      .from(ARTWORKS_BUCKET)
      .remove([image.storagePath]);

    if (storageError) throw storageError;
  }

  const { error } = await supabase.from('artworks').delete().eq('id', image.id);

  if (error) throw error;
};

export const artworksAvailable = (): boolean => isSupabaseConfigured;
