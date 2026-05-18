-- Bilingual titles and descriptions for gallery artworks
alter table public.artworks rename column title to title_en;
alter table public.artworks rename column description to description_en;

alter table public.artworks
  add column title_pl text not null default '',
  add column description_pl text not null default '';

update public.artworks
set
  title_pl = v.title_pl,
  description_pl = v.description_pl
from (
  values
    (
      'Morning Light',
      'Poranny blask',
      'Delikatna gra świtu na płótnie — cicha medytacja nad światłem i bezruchem.'
    ),
    (
      'Urban Echo',
      'Miejski echo',
      'Odważne pociągnięcia oddają rytm miasta — ruch zatrzymany w pigmentach.'
    ),
    (
      'Forest Whisper',
      'Leśny szept',
      'Warstwy zieleni i cienia przywołują ciszę leśnych ścieżek o zmierzchu.'
    ),
    (
      'Horizon Line',
      'Linia horyzontu',
      'Rozległy widok, gdzie niebo spotyka ziemię — pola barw w harmonijnym napięciu.'
    ),
    (
      'Portrait Study',
      'Studium portretu',
      'Intymne studium postaci badające formę, spojrzenie i głębię emocji.'
    ),
    (
      'Nature Suite',
      'Suita natury',
      'Organiczne faktury i formy botaniczne oddane ekspresywnym pociągnięciem pędzla.'
    ),
    (
      'Coastal Dream',
      'Nadmorski sen',
      'Morze i niebo stapiają się w płynnych błękitach — filmowy pejzaż morski w oleju.'
    ),
    (
      'Ethereal Form',
      'Eteryczna forma',
      'Abstrakcyjna figuracja rozpuszczająca się w atmosferze — jak ze snu i świetlista.'
    )
) as v(title_en, title_pl, description_pl)
where public.artworks.title_en = v.title_en;
