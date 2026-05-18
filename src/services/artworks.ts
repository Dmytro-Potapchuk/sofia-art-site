import { ArtworkCopy, Image } from '../components/types';
import {
  ARTWORKS_BUCKET,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

interface ArtworkRow {
  id: string;
  title_en: string;
  title_pl: string;
  description_en: string;
  description_pl: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
}

const mapRow = (row: ArtworkRow): Image => ({
  id: row.id,
  titleEn: row.title_en,
  titlePl: row.title_pl ?? '',
  descriptionEn: row.description_en,
  descriptionPl: row.description_pl ?? '',
  url: row.url,
  storagePath: row.storage_path,
});

const formatDbError = (error: { message: string; details?: string }): string =>
  error.details ? `${error.message} (${error.details})` : error.message;

const artworkSelect =
  'id, title_en, title_pl, description_en, description_pl, url, storage_path, sort_order';

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
    .select(artworkSelect)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as ArtworkRow[]).map(mapRow);
};

export interface UploadArtworkInput extends ArtworkCopy {
  file: File;
  userId: string;
}

const trimCopy = (copy: ArtworkCopy): ArtworkCopy => ({
  titleEn: copy.titleEn.trim(),
  titlePl: copy.titlePl.trim(),
  descriptionEn: copy.descriptionEn.trim(),
  descriptionPl: copy.descriptionPl.trim(),
});

export const uploadArtwork = async ({
  file,
  userId,
  ...copy
}: UploadArtworkInput): Promise<Image> => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const localized = trimCopy(copy);

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
      title_en: localized.titleEn,
      title_pl: localized.titlePl,
      description_en: localized.descriptionEn,
      description_pl: localized.descriptionPl,
      url: publicData.publicUrl,
      storage_path: storagePath,
      sort_order: sortOrder,
    })
    .select(artworkSelect)
    .single();

  if (error) {
    await supabase.storage.from(ARTWORKS_BUCKET).remove([storagePath]);
    throw new Error(formatDbError(error));
  }

  return mapRow(data as ArtworkRow);
};

export const updateArtwork = async (
  id: string,
  copy: ArtworkCopy
): Promise<Image> => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const localized = trimCopy(copy);

  const { data, error } = await supabase
    .from('artworks')
    .update({
      title_en: localized.titleEn,
      title_pl: localized.titlePl,
      description_en: localized.descriptionEn,
      description_pl: localized.descriptionPl,
    })
    .eq('id', id)
    .select(artworkSelect)
    .single();

  if (error) throw new Error(formatDbError(error));
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
