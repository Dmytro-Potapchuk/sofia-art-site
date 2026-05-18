-- Uruchom TYLKO jesli tabele juz istnieja, ale seed sie nie wykonal
insert into public.artworks (title, description, url, sort_order)
select v.title, v.description, v.url, v.sort_order
from (
  values
    (
      'Morning Light',
      'Delicate interplay of dawn hues on canvas - a quiet meditation on light and stillness.',
      '/images/IMG_20230420_063717.jpg',
      1
    ),
    (
      'Urban Echo',
      'Bold strokes capture the rhythm of the city - movement frozen in pigment.',
      '/images/1682015760703.jpg',
      2
    ),
    (
      'Forest Whisper',
      'Layers of green and shadow evoke the hush of woodland paths at dusk.',
      '/images/1682015744120.jpg',
      3
    ),
    (
      'Horizon Line',
      'A sweeping vista where sky meets earth - color fields in harmonious tension.',
      '/images/1682015771796.jpg',
      4
    ),
    (
      'Portrait Study',
      'Intimate character study exploring form, gaze, and emotional depth.',
      '/images/Carlik.png',
      5
    ),
    (
      'Nature Suite',
      'Organic textures and botanical forms rendered with expressive brushwork.',
      '/images/nat.png',
      6
    ),
    (
      'Coastal Dream',
      'Sea and sky merge in fluid blues - a cinematic seascape in oil.',
      '/images/morze.png',
      7
    ),
    (
      'Ethereal Form',
      'Abstract figuration dissolving into atmosphere - dreamlike and luminous.',
      '/images/feja.png',
      8
    )
) as v(title, description, url, sort_order)
where not exists (select 1 from public.artworks limit 1);
