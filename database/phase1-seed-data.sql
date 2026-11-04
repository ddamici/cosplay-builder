-- ============================================
-- PHASE 1: Seed Data
-- ============================================
-- This file imports your existing characters.js data into the database
-- Run this AFTER phase1-schema.sql

-- ============================================
-- INSERT CHARACTERS
-- ============================================

-- Doctor Doom
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (1, 'Doctor Doom', 'https://fancon.s3.us-east-2.amazonaws.com/characters/doctor%20doom.webp', 'Marvel', 'Superhero');

-- Spider-Gwen
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (2, 'Spider-Gwen', 'https://fancon.s3.us-east-2.amazonaws.com/characters/spider-gwen.webp', 'Marvel', 'Superhero');

-- Yelena Belova
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (3, 'Yelena Belova', 'https://fancon.s3.us-east-2.amazonaws.com/characters/yelena%20belova.webp', 'Marvel', 'Superhero');

-- Abby Anderson
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (4, 'Abby Anderson', 'https://fancon.s3.us-east-2.amazonaws.com/characters/abby%20anderson.webp', 'The Last of Us', 'Video Game');

-- Ahsoka Tano
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (5, 'Ahsoka Tano', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ahsoka%20tano.webp', 'Star Wars', 'Sci-Fi');

-- Storm
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (6, 'Storm', 'https://fancon.s3.us-east-2.amazonaws.com/characters/storm.webp', 'Marvel', 'Superhero');

-- Ghost Rider
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (7, 'Ghost Rider', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ghost%20rider.webp', 'Marvel', 'Superhero');

-- Ash Ketchum
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (8, 'Ash Ketchum', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ash%20ketchum.webp', 'Pokemon', 'Anime');

-- Blade
INSERT INTO characters (id, name, image_url, franchise, category) 
VALUES (9, 'Blade', 'https://fancon.s3.us-east-2.amazonaws.com/characters/blade.webp', 'Marvel', 'Superhero');

-- ============================================
-- INSERT APPEARANCES (Yelena Belova)
-- ============================================

-- Black Widow (2021) Appearance
INSERT INTO appearances (id, character_id, title, outfit_name, description, release_year) 
VALUES (1, 3, 'Black Widow (2021)', 'Tactical Gear', 'Worn during main fight sequences', 2021);

-- Thunderbolts* (2025) Appearance
INSERT INTO appearances (id, character_id, title, outfit_name, description, release_year) 
VALUES (2, 3, 'Thunderbolts* (2025)', 'Tactical Gear', 'Worn during main fight sequences', 2025);

-- ============================================
-- INSERT OUTFIT PIECES (Black Widow 2021)
-- ============================================

INSERT INTO outfit_pieces (appearance_id, piece_name, piece_type, display_order, is_optional) 
VALUES 
    (1, 'White Jumpsuit', 'Clothing', 1, false),
    (1, 'Tactical Vest', 'Clothing', 2, false),
    (1, 'Utility Belt', 'Accessory', 3, false),
    (1, 'White Lace-up Boots', 'Footwear', 4, false),
    (1, 'Fingerless Gloves', 'Accessory', 5, true),
    (1, 'Holster', 'Accessory', 6, true),
    (1, 'Wig', 'Wig', 7, true);

-- ============================================
-- INSERT OUTFIT PIECES (Thunderbolts 2025)
-- ============================================

INSERT INTO outfit_pieces (appearance_id, piece_name, piece_type, display_order, is_optional) 
VALUES 
    (2, 'Black Bodysuit', 'Clothing', 1, false),
    (2, 'Utility Belt', 'Accessory', 2, false),
    (2, 'Black Boots', 'Footwear', 3, false),
    (2, 'Fingerless Gloves', 'Accessory', 4, true),
    (2, 'Holster', 'Accessory', 5, true),
    (2, 'Wig', 'Wig', 6, true);

-- ============================================
-- RESET SEQUENCE COUNTERS
-- ============================================
-- Important: Make sure auto-increment IDs continue from the right place

SELECT setval('characters_id_seq', (SELECT MAX(id) FROM characters));
SELECT setval('appearances_id_seq', (SELECT MAX(id) FROM appearances));
SELECT setval('outfit_pieces_id_seq', (SELECT MAX(id) FROM outfit_pieces));

-- ============================================
-- VERIFY DATA
-- ============================================

DO $$ 
DECLARE 
    char_count INTEGER;
    app_count INTEGER;
    piece_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO char_count FROM characters;
    SELECT COUNT(*) INTO app_count FROM appearances;
    SELECT COUNT(*) INTO piece_count FROM outfit_pieces;
    
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Data import complete!';
    RAISE NOTICE 'Characters inserted: %', char_count;
    RAISE NOTICE 'Appearances inserted: %', app_count;
    RAISE NOTICE 'Outfit pieces inserted: %', piece_count;
    RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- SAMPLE QUERIES TO TEST
-- ============================================

-- Test 1: List all characters
-- SELECT * FROM characters ORDER BY name;

-- Test 2: Get Yelena with all appearances
-- SELECT c.*, a.* 
-- FROM characters c 
-- LEFT JOIN appearances a ON c.id = a.character_id 
-- WHERE c.name = 'Yelena Belova';

-- Test 3: Get all outfit pieces for Black Widow appearance
-- SELECT op.* 
-- FROM outfit_pieces op 
-- JOIN appearances a ON op.appearance_id = a.id 
-- WHERE a.title = 'Black Widow (2021)' 
-- ORDER BY op.display_order;

-- Test 4: Search characters by name (case-insensitive)
-- SELECT * FROM characters WHERE LOWER(name) LIKE '%yelena%';
