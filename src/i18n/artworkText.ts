import { Image } from '../components/types';
import { Language } from './translations';

export interface LocalizedArtworkText {
  title: string;
  description: string;
}

export const getLocalizedArtwork = (
  image: Image,
  language: Language
): LocalizedArtworkText => {
  if (language === 'pl') {
    return {
      title: image.titlePl.trim() || image.titleEn,
      description: image.descriptionPl.trim() || image.descriptionEn,
    };
  }

  return {
    title: image.titleEn.trim() || image.titlePl,
    description: image.descriptionEn.trim() || image.descriptionPl,
  };
};
