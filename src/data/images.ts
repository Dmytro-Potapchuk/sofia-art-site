import { Image } from '../components/types';

export const staticImages: Image[] = [
  {
    id: '1',
    title: 'Morning Light',
    description:
      'Delicate interplay of dawn hues on canvas — a quiet meditation on light and stillness.',
    url: '/images/IMG_20230420_063717.jpg',
  },
  {
    id: '2',
    title: 'Urban Echo',
    description:
      'Bold strokes capture the rhythm of the city — movement frozen in pigment.',
    url: '/images/1682015760703.jpg',
  },
  {
    id: '3',
    title: 'Forest Whisper',
    description:
      'Layers of green and shadow evoke the hush of woodland paths at dusk.',
    url: '/images/1682015744120.jpg',
  },
  {
    id: '4',
    title: 'Horizon Line',
    description:
      'A sweeping vista where sky meets earth — color fields in harmonious tension.',
    url: '/images/1682015771796.jpg',
  },
  {
    id: '5',
    title: 'Portrait Study',
    description:
      'Intimate character study exploring form, gaze, and emotional depth.',
    url: '/images/Carlik.png',
  },
  {
    id: '6',
    title: 'Nature Suite',
    description:
      'Organic textures and botanical forms rendered with expressive brushwork.',
    url: '/images/nat.png',
  },
  {
    id: '7',
    title: 'Coastal Dream',
    description:
      'Sea and sky merge in fluid blues — a cinematic seascape in oil.',
    url: '/images/morze.png',
  },
  {
    id: '8',
    title: 'Ethereal Form',
    description:
      'Abstract figuration dissolving into atmosphere — dreamlike and luminous.',
    url: '/images/feja.png',
  },
];

/** @deprecated Use useArtworks() or staticImages */
export const images = staticImages;
