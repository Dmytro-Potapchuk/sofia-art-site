import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const FEATURED_ARTWORK_KEY = 'featured_artwork_id';
const FEATURED_STORAGE_KEY = 'sofia_featured_artwork_id';

type DbError = { message: string; code?: string; details?: string };

const formatDbError = (error: DbError): string =>
  error.details ? `${error.message} (${error.details})` : error.message;

const isMissingSiteSettings = (error: DbError): boolean =>
  error.code === '42P01' ||
  error.code === 'PGRST205' ||
  /site_settings/i.test(error.message ?? '');

const isRpcNotFound = (error: DbError): boolean =>
  error.code === 'PGRST202' ||
  /set_featured_artwork/i.test(error.message ?? '');

const saveToTable = async (artworkId: string): Promise<void> => {
  if (!supabase) return;

  const { data: existing, error: readError } = await supabase
    .from('site_settings')
    .select('key')
    .eq('key', FEATURED_ARTWORK_KEY)
    .maybeSingle();

  if (readError) {
    if (isMissingSiteSettings(readError)) {
      throw new Error(
        'Tabela site_settings nie istnieje. Uruchom supabase/sql-editor-featured-setting.sql w Supabase SQL Editor.'
      );
    }
    throw new Error(formatDbError(readError));
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        value: artworkId,
        updated_at: new Date().toISOString(),
      })
      .eq('key', FEATURED_ARTWORK_KEY);

    if (updateError) throw new Error(formatDbError(updateError));
    return;
  }

  const { error: insertError } = await supabase.from('site_settings').insert({
    key: FEATURED_ARTWORK_KEY,
    value: artworkId,
  });

  if (insertError) {
    if (isMissingSiteSettings(insertError)) {
      throw new Error(
        'Tabela site_settings nie istnieje. Uruchom supabase/sql-editor-featured-setting.sql w Supabase SQL Editor.'
      );
    }
    throw new Error(formatDbError(insertError));
  }
};

export const fetchFeaturedArtworkId = async (): Promise<string | null> => {
  const local = localStorage.getItem(FEATURED_STORAGE_KEY);

  if (!supabase) {
    return local;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', FEATURED_ARTWORK_KEY)
    .maybeSingle();

  if (error) {
    if (isMissingSiteSettings(error)) return local;
    throw new Error(formatDbError(error));
  }

  return data?.value ?? local;
};

export const setFeaturedArtworkId = async (artworkId: string): Promise<void> => {
  localStorage.setItem(FEATURED_STORAGE_KEY, artworkId);

  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error: rpcError } = await supabase.rpc('set_featured_artwork', {
    artwork_id: artworkId,
  });

  if (!rpcError) return;

  if (!isRpcNotFound(rpcError)) {
    throw new Error(formatDbError(rpcError));
  }

  await saveToTable(artworkId);
};
