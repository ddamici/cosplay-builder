# Database Schema Recommendations for Cosplay Builder

## 📊 Overview
This document provides database schema recommendations for the Cosplay Builder application. The schema is designed to be scalable, normalized, and support future features.

---

## 🎯 Core Tables (Phase 1 - Current Application)

### 1. **characters**
Stores information about cosplay characters (e.g., Spider-Gwen, Yelena Belova).

```sql
CREATE TABLE characters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    franchise VARCHAR(255),              -- e.g., "Marvel", "Star Wars", "Pokemon"
    category VARCHAR(100),                -- e.g., "Superhero", "Anime", "Video Game"
    popularity_score INTEGER DEFAULT 0,   -- For sorting/trending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT characters_name_unique UNIQUE(name)
);

-- Indexes for performance
CREATE INDEX idx_characters_franchise ON characters(franchise);
CREATE INDEX idx_characters_category ON characters(category);
CREATE INDEX idx_characters_popularity ON characters(popularity_score DESC);
```

**Why these fields?**
- `franchise` and `category`: Enable filtering/grouping characters
- `popularity_score`: Track trending characters, enable sorting by popularity
- `created_at`/`updated_at`: Audit trail for data changes

---

### 2. **appearances**
Stores different outfits/versions of a character (e.g., "Black Widow 2021 Tactical Gear").

```sql
CREATE TABLE appearances (
    id BIGSERIAL PRIMARY KEY,
    character_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,          -- e.g., "Black Widow (2021)"
    outfit_name VARCHAR(255) NOT NULL,    -- e.g., "Tactical Gear"
    description TEXT,
    image_url TEXT,                       -- Optional: Image of this specific appearance
    release_year INTEGER,                 -- Year the movie/game was released
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_character
        FOREIGN KEY(character_id) 
        REFERENCES characters(id)
        ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT appearances_unique UNIQUE(character_id, title, outfit_name)
);

-- Indexes
CREATE INDEX idx_appearances_character ON appearances(character_id);
CREATE INDEX idx_appearances_year ON appearances(release_year DESC);
```

**Relationships:**
- Many-to-One with `characters`: One character can have multiple appearances

---

### 3. **outfit_pieces**
Stores individual pieces that make up an outfit (e.g., "White Jumpsuit", "Tactical Vest").

```sql
CREATE TABLE outfit_pieces (
    id BIGSERIAL PRIMARY KEY,
    appearance_id BIGINT NOT NULL,
    piece_name VARCHAR(255) NOT NULL,     -- e.g., "White Jumpsuit"
    piece_type VARCHAR(100),              -- e.g., "Clothing", "Accessory", "Wig", "Prop"
    difficulty_level VARCHAR(50),         -- e.g., "Easy", "Medium", "Hard"
    estimated_cost_min DECIMAL(10,2),     -- Min price estimate
    estimated_cost_max DECIMAL(10,2),     -- Max price estimate
    display_order INTEGER DEFAULT 0,      -- For consistent ordering in UI
    is_optional BOOLEAN DEFAULT false,    -- Is this piece optional?
    notes TEXT,                           -- Additional notes/tips
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_outfit_pieces_appearance ON outfit_pieces(appearance_id);
CREATE INDEX idx_outfit_pieces_type ON outfit_pieces(piece_type);
CREATE INDEX idx_outfit_pieces_order ON outfit_pieces(appearance_id, display_order);
```

**Why these fields?**
- `piece_type`: Enable filtering by accessory vs clothing
- `difficulty_level`: Help users gauge complexity
- `estimated_cost`: Budget planning
- `display_order`: Consistent ordering (head to toe, or importance)
- `is_optional`: Some pieces are core, others are optional

---

## 👤 User & Personalization Tables (Phase 2 - Future)

### 4. **users**
Store user accounts for saving builds and preferences.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,  -- Use bcrypt or similar
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    experience_level VARCHAR(50),         -- "Beginner", "Intermediate", "Advanced"
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

---

### 5. **saved_builds**
Store user's saved cosplay builds.

```sql
CREATE TABLE saved_builds (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    appearance_id BIGINT NOT NULL,
    build_name VARCHAR(255),              -- e.g., "My Yelena Build for ComicCon 2026"
    notes TEXT,                           -- Personal notes about the build
    target_event VARCHAR(255),            -- e.g., "San Diego Comic-Con 2026"
    target_date DATE,
    budget DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'planning', -- "planning", "in_progress", "completed"
    is_public BOOLEAN DEFAULT false,      -- Allow others to view?
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_character
        FOREIGN KEY(character_id) 
        REFERENCES characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_saved_builds_user ON saved_builds(user_id);
CREATE INDEX idx_saved_builds_character ON saved_builds(character_id);
CREATE INDEX idx_saved_builds_status ON saved_builds(status);
CREATE INDEX idx_saved_builds_public ON saved_builds(is_public) WHERE is_public = true;
```

---

### 6. **build_outfit_pieces**
Junction table: Which outfit pieces are selected for each saved build.

```sql
CREATE TABLE build_outfit_pieces (
    id BIGSERIAL PRIMARY KEY,
    build_id BIGINT NOT NULL,
    outfit_piece_id BIGINT NOT NULL,
    is_completed BOOLEAN DEFAULT false,   -- Has user finished this piece?
    actual_cost DECIMAL(10,2),            -- How much did it actually cost?
    purchase_url TEXT,                    -- Where they bought/plan to buy it
    notes TEXT,                           -- Notes specific to this piece in this build
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_build
        FOREIGN KEY(build_id) 
        REFERENCES saved_builds(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE CASCADE,
    
    -- Unique constraint: Each piece can only be added once per build
    CONSTRAINT build_outfit_pieces_unique UNIQUE(build_id, outfit_piece_id)
);

-- Indexes
CREATE INDEX idx_build_outfit_pieces_build ON build_outfit_pieces(build_id);
CREATE INDEX idx_build_outfit_pieces_piece ON build_outfit_pieces(outfit_piece_id);
```

---

## 🔍 Search & Discovery Tables (Phase 3 - Enhancement)

### 7. **tags**
Tags for better search/filtering (e.g., "MCU", "anime", "beginner-friendly").

```sql
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,    -- URL-friendly version
    category VARCHAR(50),                  -- "franchise", "difficulty", "style", etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tags_category ON tags(category);
```

---

### 8. **character_tags**
Junction table: Many-to-Many relationship between characters and tags.

```sql
CREATE TABLE character_tags (
    character_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    
    PRIMARY KEY (character_id, tag_id),
    
    CONSTRAINT fk_character
        FOREIGN KEY(character_id) 
        REFERENCES characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tag
        FOREIGN KEY(tag_id) 
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_character_tags_tag ON character_tags(tag_id);
```

---

### 9. **appearance_tags**
Junction table: Tags for specific appearances.

```sql
CREATE TABLE appearance_tags (
    appearance_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    
    PRIMARY KEY (appearance_id, tag_id),
    
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tag
        FOREIGN KEY(tag_id) 
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_appearance_tags_tag ON appearance_tags(tag_id);
```

---

## 🛒 Shopping & Materials Tables (Phase 4 - Advanced)

### 10. **materials**
Catalog of materials/products that can be used for outfit pieces.

```sql
CREATE TABLE materials (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(100),           -- "Fabric", "Foam", "Resin", "Wig", etc.
    brand VARCHAR(100),
    average_cost DECIMAL(10,2),
    difficulty_to_work_with VARCHAR(50),  -- "Easy", "Medium", "Hard"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_materials_type ON materials(material_type);
```

---

### 11. **outfit_piece_materials**
Junction table: Which materials can be used for which outfit pieces.

```sql
CREATE TABLE outfit_piece_materials (
    outfit_piece_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity VARCHAR(100),                -- e.g., "2 yards", "1 sheet", "100g"
    is_recommended BOOLEAN DEFAULT false, -- Recommended material for this piece?
    notes TEXT,
    
    PRIMARY KEY (outfit_piece_id, material_id),
    
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_material
        FOREIGN KEY(material_id) 
        REFERENCES materials(id)
        ON DELETE CASCADE
);
```

---

### 12. **vendors**
Store information about where to buy materials/pieces.

```sql
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website_url TEXT,
    vendor_type VARCHAR(100),             -- "Online", "Local", "Marketplace"
    average_shipping_time_days INTEGER,
    average_rating DECIMAL(3,2),          -- 0.00 to 5.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 13. **product_links**
Links to purchase specific materials/pieces.

```sql
CREATE TABLE product_links (
    id BIGSERIAL PRIMARY KEY,
    material_id BIGINT,
    outfit_piece_id BIGINT,
    vendor_id BIGINT NOT NULL,
    product_url TEXT NOT NULL,
    product_name VARCHAR(255),
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_affiliate_link BOOLEAN DEFAULT false,
    last_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_material
        FOREIGN KEY(material_id) 
        REFERENCES materials(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_vendor
        FOREIGN KEY(vendor_id) 
        REFERENCES vendors(id)
        ON DELETE CASCADE,
    
    -- Either material_id or outfit_piece_id must be set
    CONSTRAINT product_link_check CHECK (material_id IS NOT NULL OR outfit_piece_id IS NOT NULL)
);
```

---

## 📚 Community & Social Tables (Phase 5 - Community Features)

### 14. **tutorials**
User-submitted tutorials for creating outfit pieces.

```sql
CREATE TABLE tutorials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    outfit_piece_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,                         -- Tutorial steps (could be JSON)
    video_url TEXT,
    difficulty_level VARCHAR(50),
    estimated_time_hours INTEGER,
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_tutorials_user ON tutorials(user_id);
CREATE INDEX idx_tutorials_piece ON tutorials(outfit_piece_id);
CREATE INDEX idx_tutorials_published ON tutorials(is_published) WHERE is_published = true;
```

---

### 15. **build_photos**
Photos uploaded by users of their completed builds.

```sql
CREATE TABLE build_photos (
    id BIGSERIAL PRIMARY KEY,
    build_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,     -- Main photo for this build
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_build
        FOREIGN KEY(build_id) 
        REFERENCES saved_builds(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_build_photos_build ON build_photos(build_id);
```

---

### 16. **reviews**
User reviews/ratings for characters, appearances, or builds.

```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT,
    appearance_id BIGINT,
    saved_build_id BIGINT,                -- Review another user's public build
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_character
        FOREIGN KEY(character_id) 
        REFERENCES characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_saved_build
        FOREIGN KEY(saved_build_id) 
        REFERENCES saved_builds(id)
        ON DELETE CASCADE,
    
    -- Must review something
    CONSTRAINT review_target_check CHECK (
        character_id IS NOT NULL OR 
        appearance_id IS NOT NULL OR 
        saved_build_id IS NOT NULL
    )
);
```

---

## 📊 Entity Relationship Diagram (ERD)

```
CHARACTERS (1) ─────< (M) APPEARANCES (1) ─────< (M) OUTFIT_PIECES
    │                       │                           │
    │                       │                           │
    │                       │                           ├─────< BUILD_OUTFIT_PIECES >─────┐
    │                       │                           │                                  │
    │                       │                           └─────< OUTFIT_PIECE_MATERIALS >───┤
    │                       │                                                              │
    ├─────< CHARACTER_TAGS >─────┐                                                        │
    │                              │                                                       │
    └─────< SAVED_BUILDS >────────┼─────< BUILD_PHOTOS                                   │
            ↑                      │                                                       │
            │                      │                                                       │
            │                      │                                                       │
        USERS ─────< TUTORIALS     TAGS ─────< APPEARANCE_TAGS                            │
            │                                                                               │
            └─────< REVIEWS                                                                │
                                                                                            │
                                                                                        MATERIALS
                                                                                            │
                                                                                            └─────< PRODUCT_LINKS
                                                                                                        │
                                                                                                        │
                                                                                                    VENDORS
```

---

## 🔧 Implementation Recommendations

### Phase 1: MVP (Minimum Viable Product)
**Tables to implement first:**
1. `characters`
2. `appearances`
3. `outfit_pieces`

**Why?** These directly replace your current `characters.js` file and provide immediate value.

---

### Phase 2: User Features
**Add when you're ready for user accounts:**
4. `users`
5. `saved_builds`
6. `build_outfit_pieces`

**Features enabled:** User accounts, saving builds, tracking progress

---

### Phase 3: Discovery & Search
**Add for better UX:**
7. `tags`
8. `character_tags`
9. `appearance_tags`

**Features enabled:** Advanced filtering, categorization, recommendations

---

### Phase 4: Shopping & Materials
**Add for comprehensive planning:**
10. `materials`
11. `outfit_piece_materials`
12. `vendors`
13. `product_links`

**Features enabled:** Shopping lists, material recommendations, budget tracking

---

### Phase 5: Community
**Add for social features:**
14. `tutorials`
15. `build_photos`
16. `reviews`

**Features enabled:** Community sharing, learning resources, inspiration

---

## 🚀 Database Technology Recommendations

### Option 1: **PostgreSQL** (Recommended)
**Pros:**
- Excellent for complex relationships
- Great JSON support (for flexible fields)
- Strong data integrity with foreign keys
- Free and open-source
- Excellent full-text search capabilities

**Best for:** Production applications with complex data

---

### Option 2: **MySQL/MariaDB**
**Pros:**
- Widely supported
- Great performance
- Large community

**Best for:** Traditional web applications

---

### Option 3: **SQLite**
**Pros:**
- No server needed
- Perfect for development
- Easy to get started

**Best for:** Development/testing, not production

---

## 🔐 Security Considerations

1. **Never store plain text passwords** - Use bcrypt, scrypt, or Argon2
2. **Use parameterized queries** - Prevent SQL injection
3. **Implement rate limiting** - Prevent abuse
4. **Validate all inputs** - Never trust user data
5. **Use HTTPS** - Encrypt data in transit
6. **Regular backups** - Automated daily backups
7. **Row-level security** - Users can only access their own data

---

## 📈 Performance Optimization Tips

1. **Add indexes** on frequently queried columns (already included in schema)
2. **Use connection pooling** for database connections
3. **Implement caching** (Redis) for frequently accessed data
4. **Paginate large result sets** - Don't load all characters at once
5. **Use database views** for complex queries you run often
6. **Monitor slow queries** - Use query analysis tools
7. **Consider read replicas** for high traffic

---

## 🔄 Migration Strategy

### Step 1: Export Current Data
```javascript
// Create a script to export characters.js to JSON
const characters = require('./src/data/characters.js');
const fs = require('fs');
fs.writeFileSync('characters-export.json', JSON.stringify(characters, null, 2));
```

### Step 2: Create Database & Tables
Run the SQL CREATE TABLE statements above.

### Step 3: Import Data
Create a migration script to populate tables from your exported JSON:

```javascript
// Example: Node.js script with PostgreSQL
const { Pool } = require('pg');
const characters = require('./characters-export.json');

const pool = new Pool({ /* connection config */ });

async function migrate() {
  for (const character of characters) {
    // Insert character
    const charResult = await pool.query(
      'INSERT INTO characters (name, image_url) VALUES ($1, $2) RETURNING id',
      [character.name, character.image]
    );
    const characterId = charResult.rows[0].id;
    
    // Insert appearances if they exist
    if (character.appearances) {
      for (const appearance of character.appearances) {
        const appResult = await pool.query(
          'INSERT INTO appearances (character_id, title, outfit_name, description) VALUES ($1, $2, $3, $4) RETURNING id',
          [characterId, appearance.title, appearance.outfitName, appearance.description]
        );
        const appearanceId = appResult.rows[0].id;
        
        // Insert outfit pieces
        for (let i = 0; i < appearance.outfitPieces.length; i++) {
          await pool.query(
            'INSERT INTO outfit_pieces (appearance_id, piece_name, display_order) VALUES ($1, $2, $3)',
            [appearanceId, appearance.outfitPieces[i], i]
          );
        }
      }
    }
  }
}

migrate().then(() => console.log('Migration complete!'));
```

---

## 📝 API Endpoint Recommendations

Once you have the database, create these REST API endpoints:

### Characters
- `GET /api/characters` - List all characters (with pagination & search)
- `GET /api/characters/:id` - Get single character with appearances
- `POST /api/characters` - Create character (admin only)
- `PUT /api/characters/:id` - Update character (admin only)
- `DELETE /api/characters/:id` - Delete character (admin only)

### Appearances
- `GET /api/characters/:characterId/appearances` - List appearances for character
- `GET /api/appearances/:id` - Get single appearance with outfit pieces
- `POST /api/appearances` - Create appearance (admin only)

### Saved Builds (Authenticated)
- `GET /api/builds` - Get current user's saved builds
- `GET /api/builds/:id` - Get specific build
- `POST /api/builds` - Create new build
- `PUT /api/builds/:id` - Update build
- `DELETE /api/builds/:id` - Delete build

### Public Builds
- `GET /api/public-builds` - Browse public builds (pagination, filters)
- `GET /api/public-builds/:id` - View single public build

---

## 🎯 Example Query: Get Character with Full Details

```sql
-- Get character with all appearances and outfit pieces
SELECT 
    c.id as character_id,
    c.name as character_name,
    c.image_url as character_image,
    json_agg(
        json_build_object(
            'id', a.id,
            'title', a.title,
            'outfitName', a.outfit_name,
            'description', a.description,
            'outfitPieces', (
                SELECT json_agg(
                    json_build_object(
                        'id', op.id,
                        'name', op.piece_name,
                        'type', op.piece_type,
                        'isOptional', op.is_optional
                    ) ORDER BY op.display_order
                )
                FROM outfit_pieces op
                WHERE op.appearance_id = a.id
            )
        )
    ) as appearances
FROM characters c
LEFT JOIN appearances a ON a.character_id = c.id
WHERE c.id = $1
GROUP BY c.id, c.name, c.image_url;
```

This returns the exact same structure as your current `characters.js` file!

---

## ✅ Checklist for Backend Engineer

- [ ] Choose database technology (PostgreSQL recommended)
- [ ] Set up database server (local for dev, cloud for production)
- [ ] Create Phase 1 tables (characters, appearances, outfit_pieces)
- [ ] Create indexes for performance
- [ ] Migrate existing characters.js data to database
- [ ] Set up connection pooling
- [ ] Create REST API endpoints
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up automated backups
- [ ] Plan Phase 2 user features

---

## 📚 Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Database Design Best Practices:** https://www.vertabelo.com/blog/database-design-best-practices/
- **SQL Style Guide:** https://www.sqlstyle.guide/
- **Node.js PostgreSQL Tutorial:** https://node-postgres.com/

---

**Questions?** Have your backend engineer reach out if they need clarification on any table structure or relationships!
