DROP TABLE IF EXISTS produse;
DROP TYPE IF EXISTS categorie_enum;
DROP TYPE IF EXISTS trupa_enum;
DROP TYPE IF EXISTS firma_enum;
DROP TYPE IF EXISTS culoare_enum;

CREATE TYPE categorie_enum AS ENUM ('TRICOURI','ROCHII','FUSTE','PANTALONI','INCALTAMINTE');

CREATE TYPE trupa_enum AS ENUM('KORN','LIMP BIZKIT','LINKIN PARK','SLIPKNOT','DEFTONES','PAPA ROACH','SYSTEM OF A DOWN',
'METALLICA','RADIOHEAD','RED HOT CHILI PEPPERS','FOO FIGHTERS','GREEN DAY','THE DOORS','PEARL JAM','THE BEATLES',
'THE SISTERS OF MERCY','BAUHAUS','SIOUXSIE AND THE BANSHEES','FIELDS OF THE NEPHILIM','TYPE O NEGATIVE');

CREATE TYPE firma_enum AS ENUM('ASHWRAITH','NEON BURIAL','SHATTERFRAME','VELVET STIGMA','CRYPTFLOWER','OBSIDIAN HUSH','WIDOWSPEAKER',
'FERAL HYMN','VIOLET HEMLOCK','SCARSTATIC','DEAD SKY ECHO','RUSTLORD','BLACK MORROW','NOIR ASSEMBLY','ECHOES OF FLESH',
'THE BLEEDING VELVET','GRAVE TIDE','LUX CANCER','GLOOMHAVEN','NAILMAZE');

CREATE TYPE culoare_enum AS ENUM ('NEGRU','ROSU','MOV','ALB','GRI');


CREATE TABLE produse(
    id                  SERIAL PRIMARY KEY,
    nume                VARCHAR(50) NOT NULL,
    descriere           VARCHAR(200),
    cale_imagine        VARCHAR(50),
    categorie           categorie_enum NOT NULL,
    trupa               trupa_enum, -- poate lua o sg val
    firma               firma_enum NOT NULL, --categ secundara
    pret                NUMERIC(10, 2) NOT NULL CHECK (pret > 0),
    an_lansare          INT CHECK (an_lansare >= 1900 AND an_lansare <= EXTRACT(YEAR FROM current_date)),
    data_intrare        DATE DEFAULT CURRENT_DATE, 
    culoare             culoare_enum NOT NULL, -- poate lua o sg val (in plus)
    materiale           VARCHAR(50), -- poate lua mai multe val
    pentru_membri     BOOLEAN DEFAULT FALSE
);


INSERT INTO produse (id, nume, descriere, cale_imagine, categorie, trupa, firma, pret, an_lansare, data_intrare, culoare, materiale, pentru_membri) VALUES
(1, 'Tricou Urban Oversize', 'Perfect pentru stilul casual de zi cu zi.', '1', 'TRICOURI', 'THE DOORS', 'SHATTERFRAME', 72.94, 2006, '2022-09-09', 'ROSU', 'elastan, matase, poliester', TRUE),
(2, 'Bocanci Midnight Pulse', 'Conceput pentru activități urbane.', '2', 'INCALTAMINTE', 'TYPE O NEGATIVE', 'SHATTERFRAME', 187.95, 2020, '2025-05-09', 'GRI', 'matase', FALSE),
(3, 'Rochie Vaporoasă Eclipse', 'Inspirat din stilul ocazii elegante.', '3', 'ROCHII', 'KORN', 'LUX CANCER', 162.24, 2021, '2023-09-16', 'GRI', 'poliester, bumbac', TRUE),
(4, 'Fustă Asimetrică Velvet', 'Inspirat din stilul ieșiri de seară.', '4', 'FUSTE', NULL, 'THE BLEEDING VELVET', 60.46, 2018, '2023-06-23', 'GRI', 'poliester', TRUE),
(5, 'Pantaloni Slim Noir', 'Articol vestimentar perfect pentru festivaluri de muzică.', '5', 'PANTALONI', 'KORN', 'VELVET STIGMA', 434.48, 2014, '2024-08-27', 'NEGRU', 'matase', TRUE),
(6, 'Tricou Neon Distorsion', 'Perfect pentru ieșiri de seară.', '6', 'TRICOURI', 'LIMP BIZKIT', 'BLACK MORROW', 320.51, 2024, '2023-04-18', 'NEGRU', 'piele, in, poliester, bumbac', TRUE),
(7, 'Ghete Rebel Edge', 'Conceput pentru ocazii elegante.', '7', 'INCALTAMINTE', 'PAPA ROACH', 'NEON BURIAL', 307.76, 2020, '2024-04-06', 'MOV', 'in, matase', TRUE),
(8, 'Tricou Shadowline', 'Articol vestimentar perfect pentru festivaluri de muzică.', '8', 'TRICOURI', 'SLIPKNOT', 'ECHOES OF FLESH', 364.63, 2017, '2024-05-15', 'NEGRU', 'poliester, matase, bumbac', TRUE),
(9, 'Camasa Minimal Steel', 'Inspirat din stilul zilele călduroase.', '9', 'TRICOURI', NULL, 'GRAVE TIDE', 273.67, 2018, '2023-01-02', 'GRI', 'poliester, elastan, matase', FALSE),
(10, 'Rochie Layered Flow', 'Conceput pentru ieșiri de seară.', '10', 'ROCHII', 'RADIOHEAD', 'VIOLET HEMLOCK', 252.46, 2019, '2023-07-08', 'NEGRU', 'elastan', TRUE),
(11, 'Tricou Statement Core', 'Inspirat din stilul zilele călduroase.', '11', 'TRICOURI', 'GREEN DAY', 'SCARSTATIC', 391.54, 2019, '2023-09-03', 'GRI', 'bumbac, piele, matase, in', TRUE),
(12, 'Fustă Plisată Moonlight', 'Inspirat din stilul ieșiri de seară.', '12', 'FUSTE', NULL, 'FERAL HYMN', 155.37, 2018, '2023-02-16', 'ALB', 'nylon, in', TRUE),
(13, 'Pantaloni Cargo Nightshade', 'Ideal pentru ocazii elegante.', '13', 'PANTALONI', 'BAUHAUS', 'THE BLEEDING VELVET', 279.05, 2011, '2024-10-17', 'MOV', 'in, nylon, bumbac', FALSE),
(14, 'Maieu Graphic Chaos', 'Articol vestimentar perfect pentru ieșiri de seară.', '14', 'TRICOURI', 'KORN', 'BLACK MORROW', 459.27, 2012, '2024-03-08', 'MOV', 'piele', FALSE),
(15, 'Pantaloni Mesh Industrial', 'Articol vestimentar perfect pentru ieșiri de seară.', '15', 'PANTALONI', NULL, 'FERAL HYMN', 119.33, 2023, '2023-12-12', 'MOV', 'poliester, bumbac, nylon', FALSE),
(16, 'Pantaloni Raven Gotici', 'Perfect pentru ocazii elegante.', '16', 'PANTALONI', 'SIOUXSIE AND THE BANSHEES', 'WIDOWSPEAKER', 123.82, 2023, '2025-03-12', 'NEGRU', 'elastan, nylon, piele', TRUE),
(17, 'Sandale Street Muse', 'Inspirat din stilul festivaluri de muzică.', '17', 'INCALTAMINTE', NULL, 'RUSTLORD', 130.85, 2019, '2024-05-15', 'ROSU', 'nylon', TRUE),
(18, 'Tricou Wide Cut Stone', 'Ideal pentru ocazii elegante.', '18', 'TRICOURI', 'FIELDS OF THE NEPHILIM', 'SCARSTATIC', 151.66, 2018, '2025-04-13', 'ALB', 'poliester, matase, nylon, bumbac', TRUE),
(19, 'Mocasini Vibe Spectrum', 'Articol vestimentar perfect pentru festivaluri de muzică.', '19', 'INCALTAMINTE', NULL, 'SHATTERFRAME', 267.14, 2024, '2024-10-20', 'ROSU', 'poliester, bumbac', TRUE),
(20, 'Pantaloni scurti Denim Reborn', 'Articol vestimentar perfect pentru ocazii elegante.', '20', 'PANTALONI', NULL, 'VIOLET HEMLOCK', 157.74, 2024, '2023-08-18', 'GRI', 'in, nylon', TRUE);
