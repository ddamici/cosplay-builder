# Database Schema Recommendations for FanCon.ai Integration

## Overview
This document provides recommendations for structuring the database to support the Cosplay Builder application as a standalone app that will later integrate with fancon.ai.

## Key Requirements
- ✅ Separate table for characters with costume data (distinct from main characters table)
- ✅ Support for appearances/outfits with multiple pieces
- ✅ Purchase links for each outfit piece
- ✅ Optional user authentication (logged-in or anonymous)
- ✅ AI try-on image generation support
- ✅ Python backend integration ready

---

## Recommended Table Structure

### 1. **`cosplay_characters` Table**
Since fancon.ai already has a `characters` table, this separate table focuses on characters with costume data.

```sql
CREATE TABLE cosplay_characters (
    id BIGSERIAL PRIMARY KEY,
    
    -- Link to main characters table (if integrating later)
    fancon_character_id BIGINT,  -- Foreign key to fancon.characters.id (nullable for standalone)
    
    -- Character info
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    franchise VARCHAR(255),
    category VARCHAR(100),
    
    -- Metadata
    has_costume_data BOOLEAN DEFAULT true,
    popularity_score INTEGER DEFAULT 0,
    costume_count INTEGER DEFAULT 0,  -- Cached count of appearances
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT cosplay_characters_name_unique UNIQUE(name)
);

CREATE INDEX idx_cosplay_characters_franchise ON cosplay_characters(franchise);
CREATE INDEX idx_cosplay_characters_popularity ON cosplay_characters(popularity_score DESC);
CREATE INDEX idx_cosplay_characters_fancon_id ON cosplay_characters(fancon_character_id);
```

**Why this approach?**
- ✅ Keeps costume data separate from main character database
- ✅ Allows easy integration with existing fancon characters via `fancon_character_id`
- ✅ Can work standalone without fancon database
- ✅ Avoids conflicts with existing `characters` table

---

### 2. **`appearances` Table** (Unchanged from phase1-schema.sql)
```sql
CREATE TABLE appearances (
    id BIGSERIAL PRIMARY KEY,
    character_id BIGINT NOT NULL,  -- References cosplay_characters.id
    
    title VARCHAR(255) NOT NULL,
    outfit_name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    release_year INTEGER,
    popularity_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cosplay_character
        FOREIGN KEY(character_id) 
        REFERENCES cosplay_characters(id)
        ON DELETE CASCADE,
    
    CONSTRAINT appearances_unique UNIQUE(character_id, title, outfit_name)
);
```

---

### 3. **`outfit_pieces` Table** (Enhanced with purchase links)
```sql
CREATE TABLE outfit_pieces (
    id BIGSERIAL PRIMARY KEY,
    appearance_id BIGINT NOT NULL,
    
    -- Piece details
    piece_name VARCHAR(255) NOT NULL,
    piece_type VARCHAR(100),  -- "Clothing", "Accessory", "Wig", "Prop", "Footwear"
    difficulty_level VARCHAR(50),
    estimated_cost_min DECIMAL(10,2),
    estimated_cost_max DECIMAL(10,2),
    display_order INTEGER DEFAULT 0,
    is_optional BOOLEAN DEFAULT false,
    notes TEXT,
    
    -- NEW: Image for this specific piece
    image_url TEXT,  -- For showing what the piece looks like
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_outfit_pieces_appearance ON outfit_pieces(appearance_id);
CREATE INDEX idx_outfit_pieces_type ON outfit_pieces(piece_type);
```

---

### 4. **`purchase_links` Table** ⭐ NEW
Links where users can buy each outfit piece.

```sql
CREATE TABLE purchase_links (
    id BIGSERIAL PRIMARY KEY,
    outfit_piece_id BIGINT NOT NULL,
    
    -- Purchase info
    vendor VARCHAR(255) NOT NULL,  -- "Amazon", "Etsy", "AliExpress", etc.
    product_url TEXT NOT NULL,
    product_name TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    in_stock BOOLEAN DEFAULT true,
    is_affiliate BOOLEAN DEFAULT false,
    
    -- Metadata
    priority INTEGER DEFAULT 0,  -- Higher = show first
    click_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_purchase_links_piece ON purchase_links(outfit_piece_id);
CREATE INDEX idx_purchase_links_vendor ON purchase_links(vendor);
```

**Example data:**
```sql
INSERT INTO purchase_links (outfit_piece_id, vendor, product_url, price) VALUES
(1, 'Amazon', 'https://amazon.com/white-jumpsuit', 34.99),
(1, 'Etsy', 'https://etsy.com/custom-jumpsuit', 89.99);
```

---

### 5. **`user_builds` Table** ⭐ NEW
Saves user's costume selections (logged-in or anonymous).

```sql
CREATE TABLE user_builds (
    id BIGSERIAL PRIMARY KEY,
    
    -- User (optional for anonymous)
    user_id BIGINT,  -- NULL = anonymous build
    session_id VARCHAR(255),  -- For tracking anonymous users
    
    -- Build details
    character_id BIGINT NOT NULL,
    appearance_id BIGINT NOT NULL,
    build_name VARCHAR(255),
    notes TEXT,
    
    -- Settings
    is_public BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_build_character
        FOREIGN KEY(character_id) 
        REFERENCES cosplay_characters(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_user_build_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_builds_user ON user_builds(user_id);
CREATE INDEX idx_user_builds_character ON user_builds(character_id);
CREATE INDEX idx_user_builds_session ON user_builds(session_id);
```

---

### 6. **`build_outfit_selections` Table** ⭐ NEW
Junction table: which pieces are selected in each build.

```sql
CREATE TABLE build_outfit_selections (
    id BIGSERIAL PRIMARY KEY,
    build_id BIGINT NOT NULL,
    outfit_piece_id BIGINT NOT NULL,
    
    -- User customization
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    actual_cost DECIMAL(10,2),
    purchased_from_link_id BIGINT,  -- Which link they used
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_build
        FOREIGN KEY(build_id) 
        REFERENCES user_builds(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_outfit_piece_selection
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_purchase_link_used
        FOREIGN KEY(purchased_from_link_id) 
        REFERENCES purchase_links(id)
        ON DELETE SET NULL,
    
    -- Prevent duplicate selections
    CONSTRAINT build_outfit_unique UNIQUE(build_id, outfit_piece_id)
);

CREATE INDEX idx_build_selections_build ON build_outfit_selections(build_id);
CREATE INDEX idx_build_selections_piece ON build_outfit_selections(outfit_piece_id);
```

---

### 7. **`ai_tryon_renders` Table** ⭐ NEW
Stores AI-generated try-on images.

```sql
CREATE TABLE ai_tryon_renders (
    id BIGSERIAL PRIMARY KEY,
    
    -- Link to build
    build_id BIGINT,
    user_id BIGINT,
    
    -- Input
    user_photo_url TEXT NOT NULL,  -- Original photo uploaded
    appearance_id BIGINT NOT NULL,
    
    -- Output
    rendered_image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, failed
    error_message TEXT,
    
    -- AI model info
    model_version VARCHAR(100),
    processing_time_seconds DECIMAL(5,2),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT fk_tryon_build
        FOREIGN KEY(build_id) 
        REFERENCES user_builds(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_tryon_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_ai_tryon_user ON ai_tryon_renders(user_id);
CREATE INDEX idx_ai_tryon_build ON ai_tryon_renders(build_id);
CREATE INDEX idx_ai_tryon_status ON ai_tryon_renders(status);
```

---

## API Integration Flow

### Frontend → Backend Integration

**1. User selects character:**
```
GET /api/v1/cosplay-characters?search=yelena
```

**2. Frontend shows appearances:**
```
GET /api/v1/cosplay-characters/3
```
Returns character with all appearances nested.

**3. User selects appearance and pieces:**
```
POST /api/v1/user-builds
{
  "character_id": 3,
  "appearance_id": 1,
  "build_name": "My Yelena Costume",
  "selected_pieces": [1, 2, 3, 5, 7]
}
```

**4. Get purchase links for pieces:**
```
GET /api/v1/outfit-pieces/1  # Returns piece with purchase_links array
```

**5. User uploads photo for AI try-on:**
```
POST /api/v1/ai-tryon
FormData: { user_photo: file, build_id: 42 }
```

---

## Python Backend Structure Recommendation

```python
# models.py (using SQLAlchemy ORM)

class CosplayCharacter(Base):
    __tablename__ = 'cosplay_characters'
    
    id = Column(BigInteger, primary_key=True)
    fancon_character_id = Column(BigInteger, nullable=True)
    name = Column(String(255), nullable=False, unique=True)
    image_url = Column(Text, nullable=False)
    franchise = Column(String(255))
    category = Column(String(100))
    has_costume_data = Column(Boolean, default=True)
    popularity_score = Column(Integer, default=0)
    costume_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    appearances = relationship("Appearance", back_populates="character", cascade="all, delete-orphan")

class Appearance(Base):
    __tablename__ = 'appearances'
    
    id = Column(BigInteger, primary_key=True)
    character_id = Column(BigInteger, ForeignKey('cosplay_characters.id'), nullable=False)
    title = Column(String(255), nullable=False)
    outfit_name = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(Text)
    release_year = Column(Integer)
    popularity_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    character = relationship("CosplayCharacter", back_populates="appearances")
    outfit_pieces = relationship("OutfitPiece", back_populates="appearance", cascade="all, delete-orphan")

class OutfitPiece(Base):
    __tablename__ = 'outfit_pieces'
    
    id = Column(BigInteger, primary_key=True)
    appearance_id = Column(BigInteger, ForeignKey('appearances.id'), nullable=False)
    piece_name = Column(String(255), nullable=False)
    piece_type = Column(String(100))
    difficulty_level = Column(String(50))
    estimated_cost_min = Column(Numeric(10, 2))
    estimated_cost_max = Column(Numeric(10, 2))
    display_order = Column(Integer, default=0)
    is_optional = Column(Boolean, default=False)
    notes = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    appearance = relationship("Appearance", back_populates="outfit_pieces")
    purchase_links = relationship("PurchaseLink", back_populates="outfit_piece", cascade="all, delete-orphan")

class PurchaseLink(Base):
    __tablename__ = 'purchase_links'
    
    id = Column(BigInteger, primary_key=True)
    outfit_piece_id = Column(BigInteger, ForeignKey('outfit_pieces.id'), nullable=False)
    vendor = Column(String(255), nullable=False)
    product_url = Column(Text, nullable=False)
    product_name = Column(Text)
    price = Column(Numeric(10, 2))
    currency = Column(String(3), default='USD')
    in_stock = Column(Boolean, default=True)
    is_affiliate = Column(Boolean, default=False)
    priority = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    last_verified_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    outfit_piece = relationship("OutfitPiece", back_populates="purchase_links")

class UserBuild(Base):
    __tablename__ = 'user_builds'
    
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, nullable=True)
    session_id = Column(String(255))
    character_id = Column(BigInteger, ForeignKey('cosplay_characters.id'), nullable=False)
    appearance_id = Column(BigInteger, ForeignKey('appearances.id'), nullable=False)
    build_name = Column(String(255))
    notes = Column(Text)
    is_public = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    character = relationship("CosplayCharacter")
    appearance = relationship("Appearance")
    selections = relationship("BuildOutfitSelection", back_populates="build", cascade="all, delete-orphan")

class BuildOutfitSelection(Base):
    __tablename__ = 'build_outfit_selections'
    
    id = Column(BigInteger, primary_key=True)
    build_id = Column(BigInteger, ForeignKey('user_builds.id'), nullable=False)
    outfit_piece_id = Column(BigInteger, ForeignKey('outfit_pieces.id'), nullable=False)
    notes = Column(Text)
    is_completed = Column(Boolean, default=False)
    actual_cost = Column(Numeric(10, 2))
    purchased_from_link_id = Column(BigInteger, ForeignKey('purchase_links.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    build = relationship("UserBuild", back_populates="selections")
    outfit_piece = relationship("OutfitPiece")
    purchase_link = relationship("PurchaseLink")
```

---

## Key Recommendations Summary

### ✅ DO:
1. **Use `cosplay_characters` instead of `characters`** to avoid conflicts
2. **Add `purchase_links` table** for buy links (Amazon, Etsy, etc.)
3. **Add `user_builds` table** to track user selections (anonymous or logged-in)
4. **Add `ai_tryon_renders` table** for AI-generated images
5. **Use junction table** (`build_outfit_selections`) for many-to-many relationships
6. **Add `image_url` to `outfit_pieces`** so each piece can have a reference image
7. **Support anonymous users** via `session_id` in `user_builds`
8. **Use cascade deletes** to maintain referential integrity

### ❌ DON'T:
1. Don't reuse the main `characters` table - keep costume data separate
2. Don't store purchase URLs directly in `outfit_pieces` - use separate table for flexibility
3. Don't require authentication - support anonymous builds
4. Don't hard-code outfit pieces in frontend - fetch from API

---

## Migration Strategy

When integrating into fancon.ai later:

1. **Link existing records**: Populate `fancon_character_id` in `cosplay_characters`
2. **Merge users**: Associate anonymous builds with user accounts
3. **Keep separate**: Don't merge tables - use foreign keys
4. **API versioning**: Use `/api/v1/cosplay-builder/...` namespace

---

## Next Steps for Backend Engineer

1. ✅ Review this schema and Swagger spec
2. Create migration scripts for these 7 tables
3. Implement Python endpoints (see `api-example.js` for reference)
4. Add FastAPI/Flask routes matching Swagger spec
5. Set up CORS for frontend integration
6. Add authentication middleware (optional for now)
7. Implement AI try-on integration (future phase)

---

## Questions to Answer

**For the backend engineer:**
1. Do you want to use SQLAlchemy ORM or raw SQL queries?
2. Should we add full-text search on character names?
3. Do you need rate limiting on AI try-on endpoint?
4. Should purchase links have tracking/analytics?
5. Do you want to cache character data in Redis?

Let me know if you need the full SQL migration scripts or FastAPI/Flask boilerplate!
