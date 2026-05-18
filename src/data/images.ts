import { Image } from '../components/types';

export const staticImages: Image[] = [
  {
    id: '1',
    titleEn: 'Morning Light',
    titlePl: 'Poranny blask',
    descriptionEn:
      'Delicate interplay of dawn hues on canvas — a quiet meditation on light and stillness.',
    descriptionPl:
      'Delikatna gra świtu na płótnie — cicha medytacja nad światłem i bezruchem.',
    url: '/images/IMG_20230420_063717.jpg',
  },
  {
    id: '2',
    titleEn: 'Urban Echo',
    titlePl: 'Miejski echo',
    descriptionEn:
      'Bold strokes capture the rhythm of the city — movement frozen in pigment.',
    descriptionPl:
      'Odważne pociągnięcia oddają rytm miasta — ruch zatrzymany w pigmentach.',
    url: '/images/1682015760703.jpg',
  },
  {
    id: '3',
    titleEn: 'Forest Whisper',
    titlePl: 'Leśny szept',
    descriptionEn:
      'Layers of green and shadow evoke the hush of woodland paths at dusk.',
    descriptionPl:
      'Warstwy zieleni i cienia przywołują ciszę leśnych ścieżek o zmierzchu.',
    url: '/images/1682015744120.jpg',
  },
  {
    id: '4',
    titleEn: 'Horizon Line',
    titlePl: 'Linia horyzontu',
    descriptionEn:
      'A sweeping vista where sky meets earth — color fields in harmonious tension.',
    descriptionPl:
      'Rozległy widok, gdzie niebo spotyka ziemię — pola barw w harmonijnym napięciu.',
    url: '/images/1682015771796.jpg',
  },
  {
    id: '5',
    titleEn: 'Portrait Study',
    titlePl: 'Studium portretu',
    descriptionEn:
      'Intimate character study exploring form, gaze, and emotional depth.',
    descriptionPl:
      'Intymne studium postaci badające formę, spojrzenie i głębię emocji.',
    url: '/images/Carlik.png',
  },
  {
    id: '6',
    titleEn: 'Nature Suite',
    titlePl: 'Suita natury',
    descriptionEn:
      'Organic textures and botanical forms rendered with expressive brushwork.',
    descriptionPl:
      'Organiczne faktury i formy botaniczne oddane ekspresywnym pociągnięciem pędzla.',
    url: '/images/nat.png',
  },
  {
    id: '7',
    titleEn: 'Coastal Dream',
    titlePl: 'Nadmorski sen',
    descriptionEn:
      'Sea and sky merge in fluid blues — a cinematic seascape in oil.',
    descriptionPl:
      'Morze i niebo stapiają się w płynnych błękitach — filmowy pejzaż morski w oleju.',
    url: '/images/morze.png',
  },
  {
    id: '8',
    titleEn: 'Ethereal Form',
    titlePl: 'Eteryczna forma',
    descriptionEn:
      'Abstract figuration dissolving into atmosphere — dreamlike and luminous.',
    descriptionPl:
      'Abstrakcyjna figuracja rozpuszczająca się w atmosferze — jak ze snu i świetlista.',
    url: '/images/feja.png',
  },
];

/** @deprecated Use useArtworks() or staticImages */
export const images = staticImages;
