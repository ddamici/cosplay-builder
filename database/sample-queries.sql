-- ============================================
-- SAMPLE QUERIES FOR COSPLAY BUILDER API
-- ============================================
-- These queries match what your React app needs
-- Use these in your API endpoints

-- ============================================
-- QUERY 1: Get All Characters (Simple List)
-- ============================================
-- Use for: Character selection page
-- API Endpoint: GET /api/characters

SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category
FROM characters
ORDER BY popularity_score DESC, name ASC;

-- With pagination (recommended for production):
SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category
FROM characters
ORDER BY popularity_score DESC, name ASC
LIMIT 20 OFFSET 0;  -- OFFSET = (page - 1) * limit

-- ============================================
-- QUERY 2: Search Characters by Name
-- ============================================
-- Use for: Search box functionality
-- API Endpoint: GET /api/characters?search=spider

SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category
FROM characters
WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')  -- $1 = search term
ORDER BY name ASC;

-- ============================================
-- QUERY 3: Get Single Character with ALL Data
-- ============================================
-- Use for: When user selects a character
-- API Endpoint: GET /api/characters/:id
-- Returns JSON in same format as your current characters.js!

SELECT 
    c.id,
    c.name,
    c.image_url as image,
    c.franchise,
    c.category,
    COALESCE(
        json_agg(
            json_build_object(
                'id', a.id,
                'title', a.title,
                'outfitName', a.outfit_name,
                'description', a.description,
                'outfitPieces', (
                    SELECT COALESCE(json_agg(op.piece_name ORDER BY op.display_order), '[]'::json)
                    FROM outfit_pieces op
                    WHERE op.appearance_id = a.id
                )
            ) ORDER BY a.release_year DESC, a.title
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'::json
    ) as appearances
FROM characters c
LEFT JOIN appearances a ON a.character_id = c.id
WHERE c.id = $1  -- $1 = character ID
GROUP BY c.id, c.name, c.image_url, c.franchise, c.category;

-- ============================================
-- QUERY 4: Get All Appearances for Character
-- ============================================
-- Use for: Appearance selection dropdown/list
-- API Endpoint: GET /api/characters/:characterId/appearances

SELECT 
    a.id,
    a.title,
    a.outfit_name as "outfitName",
    a.description,
    a.image_url,
    a.release_year as "releaseYear"
FROM appearances a
WHERE a.character_id = $1  -- $1 = character ID
ORDER BY a.release_year DESC, a.title ASC;

-- ============================================
-- QUERY 5: Get Single Appearance with Outfit Pieces
-- ============================================
-- Use for: When user selects an appearance
-- API Endpoint: GET /api/appearances/:id

SELECT 
    a.id,
    a.title,
    a.outfit_name as "outfitName",
    a.description,
    a.image_url,
    COALESCE(
        json_agg(
            json_build_object(
                'id', op.id,
                'name', op.piece_name,
                'type', op.piece_type,
                'isOptional', op.is_optional,
                'estimatedCostMin', op.estimated_cost_min,
                'estimatedCostMax', op.estimated_cost_max,
                'difficultyLevel', op.difficulty_level,
                'notes', op.notes
            ) ORDER BY op.display_order
        ) FILTER (WHERE op.id IS NOT NULL),
        '[]'::json
    ) as "outfitPieces"
FROM appearances a
LEFT JOIN outfit_pieces op ON op.appearance_id = a.id
WHERE a.id = $1  -- $1 = appearance ID
GROUP BY a.id, a.title, a.outfit_name, a.description, a.image_url;

-- ============================================
-- QUERY 6: Get Outfit Pieces for Appearance
-- ============================================
-- Use for: Outfit builder component
-- API Endpoint: GET /api/appearances/:appearanceId/outfit-pieces

SELECT 
    id,
    piece_name as name,
    piece_type as type,
    difficulty_level as "difficultyLevel",
    estimated_cost_min as "estimatedCostMin",
    estimated_cost_max as "estimatedCostMax",
    is_optional as "isOptional",
    notes,
    display_order as "displayOrder"
FROM outfit_pieces
WHERE appearance_id = $1  -- $1 = appearance ID
ORDER BY display_order ASC;

-- ============================================
-- QUERY 7: Search Characters by Franchise
-- ============================================
-- Use for: Filter by Marvel, Star Wars, etc.
-- API Endpoint: GET /api/characters?franchise=Marvel

SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category
FROM characters
WHERE franchise = $1  -- $1 = franchise name
ORDER BY name ASC;

-- ============================================
-- QUERY 8: Get Popular Characters
-- ============================================
-- Use for: Homepage "Trending" section
-- API Endpoint: GET /api/characters/popular

SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category,
    popularity_score
FROM characters
WHERE popularity_score > 0
ORDER BY popularity_score DESC
LIMIT 10;

-- ============================================
-- QUERY 9: Get Characters with Appearance Count
-- ============================================
-- Use for: Showing how many outfits each character has
-- API Endpoint: GET /api/characters/with-counts

SELECT 
    c.id,
    c.name,
    c.image_url as image,
    c.franchise,
    c.category,
    COUNT(a.id) as appearance_count
FROM characters c
LEFT JOIN appearances a ON a.character_id = c.id
GROUP BY c.id, c.name, c.image_url, c.franchise, c.category
ORDER BY appearance_count DESC, c.name ASC;

-- ============================================
-- QUERY 10: Get Recently Added Characters
-- ============================================
-- Use for: "New Additions" section
-- API Endpoint: GET /api/characters/recent

SELECT 
    id,
    name,
    image_url as image,
    franchise,
    category,
    created_at
FROM characters
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- QUERY 11: Get Franchises List
-- ============================================
-- Use for: Filter dropdown
-- API Endpoint: GET /api/franchises

SELECT DISTINCT 
    franchise,
    COUNT(*) as character_count
FROM characters
WHERE franchise IS NOT NULL
GROUP BY franchise
ORDER BY franchise ASC;

-- ============================================
-- QUERY 12: Get Categories List
-- ============================================
-- Use for: Filter dropdown
-- API Endpoint: GET /api/categories

SELECT DISTINCT 
    category,
    COUNT(*) as character_count
FROM characters
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category ASC;

-- ============================================
-- ADMIN QUERIES
-- ============================================

-- Count all data
SELECT 
    (SELECT COUNT(*) FROM characters) as total_characters,
    (SELECT COUNT(*) FROM appearances) as total_appearances,
    (SELECT COUNT(*) FROM outfit_pieces) as total_outfit_pieces;

-- Find characters without appearances
SELECT id, name 
FROM characters 
WHERE id NOT IN (SELECT DISTINCT character_id FROM appearances);

-- Find appearances without outfit pieces
SELECT a.id, a.title, c.name as character_name
FROM appearances a
JOIN characters c ON a.character_id = c.id
WHERE a.id NOT IN (SELECT DISTINCT appearance_id FROM outfit_pieces);

-- Get average number of outfit pieces per appearance
SELECT AVG(piece_count) as avg_pieces_per_outfit
FROM (
    SELECT appearance_id, COUNT(*) as piece_count
    FROM outfit_pieces
    GROUP BY appearance_id
) as subquery;
