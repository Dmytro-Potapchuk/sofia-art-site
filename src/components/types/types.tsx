export interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  storagePath?: string | null;
}

export interface GalleryProps {
  images: Image[];
}
export interface ProductDetailsProps {
  image: Image;
}
