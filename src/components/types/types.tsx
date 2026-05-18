export interface Image {
  id: string;
  url: string;
  titleEn: string;
  titlePl: string;
  descriptionEn: string;
  descriptionPl: string;
  storagePath?: string | null;
}

export interface ArtworkCopy {
  titleEn: string;
  titlePl: string;
  descriptionEn: string;
  descriptionPl: string;
}

export interface GalleryProps {
  images: Image[];
}
export interface ProductDetailsProps {
  image: Image;
}
