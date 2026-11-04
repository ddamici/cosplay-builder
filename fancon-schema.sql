-- ============================================
-- FANCON COSPLAY BUILDER - DATABASE SCHEMA
-- ============================================
-- Updated schema to avoid conflicts with existing FanCon tables
-- Use these table names instead of the originals

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS costume_build_pieces CASCADE;
DROP TABLE IF EXISTS costume_builds CASCADE;
DROP TABLE IF EXISTS costume_pieces CASCADE;
DROP TABLE IF EXISTS costume_appearances CASCADE;
DROP TABLE IF EXISTS cosplay_characters CASCADE;

-- ============================================
-- TABLE 1: cosplay_characters
-- ============================================
-- Characters available for cosplay building
-- (Renamed from "characters" to avoid conflict with FanCon's existing characters table)

CREATE TABLE cosplay_characters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    franchise VARCHAR(255),                    -- e.g., "Marvel", "Star Wars", "Pokemon"
    category VARCHAR(100),                      -- e.g., "Superhero", "Anime", "Video Game"
    is_active BOOLEAN DEFAULT true,             -- Show in cosplay builder?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cosplay_characters_name_unique UNIQUE(name)
);

-- Indexes
CREATE INDEX idx_cosplay_characters_franchise ON cosplay_characters(franchise);
CREATE INDEX idx_cosplay_characters_category ON cosplay_characters(category);
CREATE INDEX idx_cosplay_characters_name ON cosplay_characters(name);
CREATE INDEX idx_cosplay_characters_active ON cosplay_characters(is_active) WHERE is_active = true;

-- ============================================
-- TABLE 2: costume_appearances
-- ============================================
-- Different costume versions for each character
-- (e.g., Yelena in Black Widow vs Thunderbolts)

CREATE TABLE costume_appearances (
    id BIGSERIAL PRIMARY KEY,
    cosplay_character_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,                -- e.g., "Black Widow (2021)"
    outfit_name VARCHAR(255) NOT NULL,          -- e.g., "Tactical Gear"
    description TEXT,
    image_url TEXT,                             -- Image of this specific outfit
    release_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cosplay_character
        FOREIGN KEY(cosplay_character_id) 
        REFERENCES cosplay_characters(id)
        ON DELETE CASCADE,
    
    CONSTRAINT costume_appearances_unique UNIQUE(cosplay_character_id, title, outfit_name)
);

-- Indexes
CREATE INDEX idx_costume_appearances_character ON costume_appearances(cosplay_character_id);
CREATE INDEX idx_costume_appearances_year ON costume_appearances(release_year DESC);
CREATE INDEX idx_costume_appearances_active ON costume_appearances(is_active) WHERE is_active = true;

-- ============================================
-- TABLE 3: costume_pieces
-- ============================================
-- Individual pieces that make up a costume
-- INCLUDES PURCHASE LINKS! 🛒

CREATE TABLE costume_pieces (
    id BIGSERIAL PRIMARY KEY,
    costume_appearance_id BIGINT NOT NULL,
    piece_name VARCHAR(255) NOT NULL,           -- e.g., "White Jumpsuit"
    piece_type VARCHAR(100),                    -- e.g., "Clothing", "Accessory", "Wig", "Prop"
    difficulty_level VARCHAR(50),               -- e.g., "Easy", "Medium", "Hard"
    estimated_cost DECIMAL(10,2),               -- Estimated price
    purchase_url TEXT,                          -- 🔗 WHERE TO BUY THIS PIECE
    vendor_name VARCHAR(255),                   -- e.g., "Amazon", "Etsy", "Spirit Halloween"
    display_order INTEGER DEFAULT 0,            -- Order to display in UI (head to toe)
    is_optional BOOLEAN DEFAULT false,          -- Is this piece optional?
    thumbnail_url TEXT,                         -- Image of this specific piece
    notes TEXT,                                 -- Additional notes/tips
    is_active BOOLEAN DEFAULT true,             -- Show in builder?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_costume_appearance
        FOREIGN KEY(costume_appearance_id) 
        REFERENCES costume_appearances(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_costume_pieces_appearance ON costume_pieces(costume_appearance_id);
CREATE INDEX idx_costume_pieces_type ON costume_pieces(piece_type);
CREATE INDEX idx_costume_pieces_order ON costume_pieces(costume_appearance_id, display_order);
CREATE INDEX idx_costume_pieces_active ON costume_pieces(is_active) WHERE is_active = true;

-- ============================================
-- TABLE 4: costume_builds
-- ============================================
-- User's saved costume builds
-- Supports BOTH logged-in and anonymous users!

CREATE TABLE costume_builds (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,                             -- FanCon user ID (NULL if anonymous)
    cosplay_character_id BIGINT NOT NULL,
    costume_appearance_id BIGINT NOT NULL,
    build_name VARCHAR(255),                    -- e.g., "My Yelena Costume for Comic-Con"
    session_id VARCHAR(255),                    -- For anonymous users (browser session)
    uploaded_photo_url TEXT,                    -- 🖼️ User's uploaded photo
    rendered_photo_url TEXT,                    -- 🎨 AI-rendered result (future feature)
    total_cost DECIMAL(10,2),                   -- Sum of selected pieces' costs
    status VARCHAR(50) DEFAULT 'draft',         -- 'draft', 'completed', 'purchased'
    is_public BOOLEAN DEFAULT false,            -- Allow others to view?
    notes TEXT,                                 -- User's personal notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cosplay_character
        FOREIGN KEY(cosplay_character_id) 
        REFERENCES cosplay_characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_costume_appearance
        FOREIGN KEY(costume_appearance_id) 
        REFERENCES costume_appearances(id)
        ON DELETE CASCADE
    
    -- Add this constraint if you have a users table:
    -- CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_costume_builds_user ON costume_builds(user_id);
CREATE INDEX idx_costume_builds_session ON costume_builds(session_id);
CREATE INDEX idx_costume_builds_character ON costume_builds(cosplay_character_id);
CREATE INDEX idx_costume_builds_appearance ON costume_builds(costume_appearance_id);
CREATE INDEX idx_costume_builds_public ON costume_builds(is_public) WHERE is_public = true;
CREATE INDEX idx_costume_builds_status ON costume_builds(status);

-- ============================================
-- TABLE 5: costume_build_pieces
-- ============================================
-- Junction table: Which pieces the user selected for their build

CREATE TABLE costume_build_pieces (
    id BIGSERIAL PRIMARY KEY,
    costume_build_id BIGINT NOT NULL,
    costume_piece_id BIGINT NOT NULL,
    is_selected BOOLEAN DEFAULT true,           -- User selected this piece
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_costume_build
        FOREIGN KEY(costume_build_id) 
        REFERENCES costume_builds(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_costume_piece
        FOREIGN KEY(costume_piece_id) 
        REFERENCES costume_pieces(id)
        ON DELETE CASCADE,
    
    -- Each piece can only be in a build once
    CONSTRAINT costume_build_pieces_unique UNIQUE(costume_build_id, costume_piece_id)
);

-- Indexes
CREATE INDEX idx_costume_build_pieces_build ON costume_build_pieces(costume_build_id);
CREATE INDEX idx_costume_build_pieces_piece ON costume_build_pieces(costume_piece_id);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to cosplay_characters
CREATE TRIGGER update_cosplay_characters_updated_at 
    BEFORE UPDATE ON cosplay_characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to costume_appearances
CREATE TRIGGER update_costume_appearances_updated_at 
    BEFORE UPDATE ON costume_appearances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to costume_builds
CREATE TRIGGER update_costume_builds_updated_at 
    BEFORE UPDATE ON costume_builds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (from your current characters.js)
-- ============================================

-- Insert characters
INSERT INTO cosplay_characters (id, name, image_url, franchise, category) VALUES
(1, 'Doctor Doom', 'https://fancon.s3.us-east-2.amazonaws.com/characters/doctor%20doom.webp', 'Marvel', 'Superhero'),
(2, 'Spider-Gwen', 'https://fancon.s3.us-east-2.amazonaws.com/characters/spider-gwen.webp', 'Marvel', 'Superhero'),
(3, 'Yelena Belova', 'https://fancon.s3.us-east-2.amazonaws.com/characters/yelena%20belova.webp', 'Marvel', 'Superhero'),
(4, 'Abby Anderson', 'https://fancon.s3.us-east-2.amazonaws.com/characters/abby%20anderson.webp', 'The Last of Us', 'Video Game'),
(5, 'Ahsoka Tano', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ahsoka%20tano.webp', 'Star Wars', 'Sci-Fi'),
(6, 'Storm', 'https://fancon.s3.us-east-2.amazonaws.com/characters/storm.webp', 'Marvel', 'Superhero'),
(7, 'Ghost Rider', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ghost%20rider.webp', 'Marvel', 'Superhero'),
(8, 'Ash Ketchum', 'https://fancon.s3.us-east-2.amazonaws.com/characters/ash%20ketchum.webp', 'Pokemon', 'Anime'),
(9, 'Blade', 'https://fancon.s3.us-east-2.amazonaws.com/characters/blade.webp', 'Marvel', 'Superhero');

-- Insert appearances for Yelena Belova
INSERT INTO costume_appearances (id, cosplay_character_id, title, outfit_name, description, release_year) VALUES
(1, 3, 'Black Widow (2021)', 'Tactical Gear', 'Worn during main fight sequences', 2021),
(2, 3, 'Thunderbolts* (2025)', 'Tactical Gear', 'Worn during main fight sequences', 2025);

-- Insert costume pieces for Black Widow (2021)
INSERT INTO costume_pieces (costume_appearance_id, piece_name, piece_type, display_order, is_optional, estimated_cost, purchase_url, vendor_name) VALUES
(1, 'White Jumpsuit', 'Clothing', 1, false, 89.99, 'https://amazon.com/white-tactical-jumpsuit', 'Amazon'),
(1, 'Tactical Vest', 'Clothing', 2, false, 45.00, 'https://etsy.com/tactical-vest', 'Etsy'),
(1, 'Utility Belt', 'Accessory', 3, false, 25.00, 'https://amazon.com/utility-belt', 'Amazon'),
(1, 'White Lace-up Boots', 'Footwear', 4, false, 65.00, 'https://amazon.com/white-boots', 'Amazon'),
(1, 'Fingerless Gloves', 'Accessory', 5, true, 15.00, 'https://amazon.com/fingerless-gloves', 'Amazon'),
(1, 'Holster', 'Accessory', 6, true, 20.00, 'https://amazon.com/holster', 'Amazon'),
(1, 'Wig', 'Wig', 7, true, 35.00, 'https://amazon.com/blonde-wig', 'Amazon');

-- Insert costume pieces for Thunderbolts (2025)
INSERT INTO costume_pieces (costume_appearance_id, piece_name, piece_type, display_order, is_optional, estimated_cost, purchase_url, vendor_name) VALUES
(2, 'Black Bodysuit', 'Clothing', 1, false, 75.00, 'https://amazon.com/black-bodysuit', 'Amazon'),
(2, 'Utility Belt', 'Accessory', 2, false, 25.00, 'https://amazon.com/utility-belt', 'Amazon'),
(2, 'Black Boots', 'Footwear', 3, false, 55.00, 'https://amazon.com/black-boots', 'Amazon'),
(2, 'Fingerless Gloves', 'Accessory', 4, true, 15.00, 'https://amazon.com/fingerless-gloves', 'Amazon'),
(2, 'Holster', 'Accessory', 5, true, 20.00, 'https://amazon.com/holster', 'Amazon'),
(2, 'Wig', 'Wig', 6, true, 35.00, 'https://amazon.com/blonde-wig', 'Amazon');

-- Reset sequence counters
SELECT setval('cosplay_characters_id_seq', (SELECT MAX(id) FROM cosplay_characters));
SELECT setval('costume_appearances_id_seq', (SELECT MAX(id) FROM costume_appearances));
SELECT setval('costume_pieces_id_seq', (SELECT MAX(id) FROM costume_pieces));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count records
SELECT 
    (SELECT COUNT(*) FROM cosplay_characters) as characters,
    (SELECT COUNT(*) FROM costume_appearances) as appearances,
    (SELECT COUNT(*) FROM costume_pieces) as pieces;

-- Get Yelena with appearances and pieces
SELECT 
    c.name,
    a.title,
    COUNT(cp.id) as piece_count,
    SUM(cp.estimated_cost) as total_cost
FROM cosplay_characters c
JOIN costume_appearances a ON c.id = a.cosplay_character_id
JOIN costume_pieces cp ON a.id = cp.costume_appearance_id
WHERE c.name = 'Yelena Belova'
GROUP BY c.name, a.title;

-- ============================================
-- SUCCESS
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ FanCon Cosplay Builder schema created successfully!';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - cosplay_characters';
    RAISE NOTICE '  - costume_appearances';
    RAISE NOTICE '  - costume_pieces (with purchase links!)';
    RAISE NOTICE '  - costume_builds';
    RAISE NOTICE '  - costume_build_pieces';
END $$;
