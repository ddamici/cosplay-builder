-- ============================================
-- PHASE 1: MVP Database Schema
-- ============================================
-- Core tables to replace characters.js file
-- Run this file first to set up the basic structure
-- Database: PostgreSQL (recommended)

-- Drop tables if they exist (for clean re-runs during development)
DROP TABLE IF EXISTS outfit_pieces CASCADE;
DROP TABLE IF EXISTS appearances CASCADE;
DROP TABLE IF EXISTS characters CASCADE;

-- ============================================
-- TABLE: characters
-- ============================================
CREATE TABLE characters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    franchise VARCHAR(255),                    -- e.g., "Marvel", "Star Wars", "Pokemon"
    category VARCHAR(100),                      -- e.g., "Superhero", "Anime", "Video Game"
    popularity_score INTEGER DEFAULT 0,         -- For sorting/trending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT characters_name_unique UNIQUE(name)
);

-- Indexes for better query performance
CREATE INDEX idx_characters_franchise ON characters(franchise);
CREATE INDEX idx_characters_category ON characters(category);
CREATE INDEX idx_characters_popularity ON characters(popularity_score DESC);
CREATE INDEX idx_characters_name ON characters(name);

-- ============================================
-- TABLE: appearances
-- ============================================
CREATE TABLE appearances (
    id BIGSERIAL PRIMARY KEY,
    character_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,                -- e.g., "Black Widow (2021)"
    outfit_name VARCHAR(255) NOT NULL,          -- e.g., "Tactical Gear"
    description TEXT,
    image_url TEXT,                             -- Optional: specific appearance image
    release_year INTEGER,
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_character
        FOREIGN KEY(character_id) 
        REFERENCES characters(id)
        ON DELETE CASCADE,                      -- If character deleted, delete appearances too
    
    -- Unique Constraint
    CONSTRAINT appearances_unique UNIQUE(character_id, title, outfit_name)
);

-- Indexes
CREATE INDEX idx_appearances_character ON appearances(character_id);
CREATE INDEX idx_appearances_year ON appearances(release_year DESC);

-- ============================================
-- TABLE: outfit_pieces
-- ============================================
CREATE TABLE outfit_pieces (
    id BIGSERIAL PRIMARY KEY,
    appearance_id BIGINT NOT NULL,
    piece_name VARCHAR(255) NOT NULL,           -- e.g., "White Jumpsuit"
    piece_type VARCHAR(100),                    -- e.g., "Clothing", "Accessory", "Wig", "Prop"
    difficulty_level VARCHAR(50),               -- e.g., "Easy", "Medium", "Hard"
    estimated_cost_min DECIMAL(10,2),           -- Min price estimate
    estimated_cost_max DECIMAL(10,2),           -- Max price estimate
    display_order INTEGER DEFAULT 0,            -- For consistent UI ordering
    is_optional BOOLEAN DEFAULT false,          -- Is this piece optional?
    notes TEXT,                                 -- Additional notes/tips
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE                       -- If appearance deleted, delete pieces too
);

-- Indexes
CREATE INDEX idx_outfit_pieces_appearance ON outfit_pieces(appearance_id);
CREATE INDEX idx_outfit_pieces_type ON outfit_pieces(piece_type);
CREATE INDEX idx_outfit_pieces_order ON outfit_pieces(appearance_id, display_order);

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to characters table
CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to appearances table
CREATE TRIGGER update_appearances_updated_at 
    BEFORE UPDATE ON appearances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE 'Phase 1 tables created successfully!';
    RAISE NOTICE 'Next step: Run phase1-seed-data.sql to import your characters';
END $$;
