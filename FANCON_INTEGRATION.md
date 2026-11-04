# FanCon.ai Cosplay Builder Integration

## 🎯 Overview

This document outlines how the Cosplay Builder integrates with FanCon.ai's existing Python backend.

---

## 📊 Revised Database Schema

### ⚠️ Important: Table Naming

Since FanCon already has a `characters` table, we'll use **different names** to avoid conflicts:

```
cosplay_characters      ← Instead of "characters"
costume_appearances     ← Instead of "appearances"  
costume_pieces         ← Instead of "outfit_pieces"
costume_builds         ← User's saved builds
costume_build_pieces   ← Which pieces selected per build
```

---

## 🗄️ Database Tables

### 1. `cosplay_characters`
Characters that have costumes available for building.

```sql
CREATE TABLE cosplay_characters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    franchise VARCHAR(255),                    -- e.g., "Marvel", "Star Wars"
    category VARCHAR(100),                      -- e.g., "Superhero", "Anime"
    is_active BOOLEAN DEFAULT true,             -- Show in app?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cosplay_characters_name_unique UNIQUE(name)
);

CREATE INDEX idx_cosplay_characters_franchise ON cosplay_characters(franchise);
CREATE INDEX idx_cosplay_characters_active ON cosplay_characters(is_active) WHERE is_active = true;
```

---

### 2. `costume_appearances`
Different versions/outfits of a character (e.g., Yelena in Black Widow vs Thunderbolts).

```sql
CREATE TABLE costume_appearances (
    id BIGSERIAL PRIMARY KEY,
    cosplay_character_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,                -- e.g., "Black Widow (2021)"
    outfit_name VARCHAR(255) NOT NULL,          -- e.g., "Tactical Gear"
    description TEXT,
    image_url TEXT,
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

CREATE INDEX idx_costume_appearances_character ON costume_appearances(cosplay_character_id);
CREATE INDEX idx_costume_appearances_active ON costume_appearances(is_active) WHERE is_active = true;
```

---

### 3. `costume_pieces`
Individual pieces that make up a costume (with purchase links).

```sql
CREATE TABLE costume_pieces (
    id BIGSERIAL PRIMARY KEY,
    costume_appearance_id BIGINT NOT NULL,
    piece_name VARCHAR(255) NOT NULL,           -- e.g., "White Jumpsuit"
    piece_type VARCHAR(100),                    -- e.g., "Clothing", "Accessory", "Wig"
    difficulty_level VARCHAR(50),               -- e.g., "Easy", "Medium", "Hard"
    estimated_cost DECIMAL(10,2),               -- Estimated price
    purchase_url TEXT,                          -- 🔗 Link to buy this piece
    vendor_name VARCHAR(255),                   -- e.g., "Amazon", "Etsy"
    display_order INTEGER DEFAULT 0,
    is_optional BOOLEAN DEFAULT false,
    thumbnail_url TEXT,                         -- Image of this specific piece
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_costume_appearance
        FOREIGN KEY(costume_appearance_id) 
        REFERENCES costume_appearances(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_costume_pieces_appearance ON costume_pieces(costume_appearance_id);
CREATE INDEX idx_costume_pieces_active ON costume_pieces(is_active) WHERE is_active = true;
```

**Key Addition:** `purchase_url` and `vendor_name` fields for buy links! 🛒

---

### 4. `costume_builds`
User's saved costume builds (logged in or anonymous).

```sql
CREATE TABLE costume_builds (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,                             -- NULL if anonymous, FK to FanCon users table
    cosplay_character_id BIGINT NOT NULL,
    costume_appearance_id BIGINT NOT NULL,
    build_name VARCHAR(255),                    -- e.g., "My Yelena Build"
    session_id VARCHAR(255),                    -- For anonymous users (cookie/session)
    uploaded_photo_url TEXT,                    -- 🖼️ User's photo for AI rendering
    rendered_photo_url TEXT,                    -- 🎨 AI-rendered result
    total_cost DECIMAL(10,2),                   -- Sum of selected pieces
    status VARCHAR(50) DEFAULT 'draft',         -- 'draft', 'completed', 'purchased'
    is_public BOOLEAN DEFAULT false,            -- Share with community?
    notes TEXT,
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
    
    -- Optional: Add FK to users table if it exists
    -- CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_costume_builds_user ON costume_builds(user_id);
CREATE INDEX idx_costume_builds_session ON costume_builds(session_id);
CREATE INDEX idx_costume_builds_character ON costume_builds(cosplay_character_id);
CREATE INDEX idx_costume_builds_public ON costume_builds(is_public) WHERE is_public = true;
```

**Key Features:**
- ✅ Supports **logged-in users** (`user_id`)
- ✅ Supports **anonymous users** (`session_id`)
- ✅ Stores **uploaded photo** for AI rendering
- ✅ Stores **rendered result**
- ✅ Tracks **total cost**

---

### 5. `costume_build_pieces`
Junction table: Which pieces the user selected for their build.

```sql
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
    
    CONSTRAINT costume_build_pieces_unique UNIQUE(costume_build_id, costume_piece_id)
);

CREATE INDEX idx_costume_build_pieces_build ON costume_build_pieces(costume_build_id);
CREATE INDEX idx_costume_build_pieces_piece ON costume_build_pieces(costume_piece_id);
```

---

## 🔗 Table Relationships

```
cosplay_characters (1) ─────< (M) costume_appearances (1) ─────< (M) costume_pieces
       ↓                                  ↓                                  ↓
       |                                  |                                  |
       └────< costume_builds >────────────┘                                  |
                    ↓                                                        |
                    └────< costume_build_pieces >────────────────────────────┘
```

---

## 📡 API Endpoints (Python/FastAPI)

### Base URL
```
https://api.fancon.ai/cosplay-builder
```

### 1. **GET /characters**
Get all characters available for cosplay building.

**Query Params:**
- `search` (optional): Filter by name
- `franchise` (optional): Filter by franchise
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Yelena Belova",
      "image_url": "https://...",
      "franchise": "Marvel",
      "category": "Superhero"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

---

### 2. **GET /characters/{character_id}**
Get single character with all appearances.

**Response:**
```json
{
  "id": 3,
  "name": "Yelena Belova",
  "image_url": "https://...",
  "franchise": "Marvel",
  "appearances": [
    {
      "id": 1,
      "title": "Black Widow (2021)",
      "outfit_name": "Tactical Gear",
      "description": "Worn during main fight sequences",
      "image_url": "https://..."
    },
    {
      "id": 2,
      "title": "Thunderbolts* (2025)",
      "outfit_name": "Tactical Gear",
      "description": "Worn during main fight sequences"
    }
  ]
}
```

---

### 3. **GET /appearances/{appearance_id}/pieces**
Get all costume pieces for an appearance (with purchase links!).

**Response:**
```json
{
  "appearance": {
    "id": 1,
    "title": "Black Widow (2021)",
    "outfit_name": "Tactical Gear"
  },
  "pieces": [
    {
      "id": 101,
      "piece_name": "White Jumpsuit",
      "piece_type": "Clothing",
      "difficulty_level": "Medium",
      "estimated_cost": 89.99,
      "purchase_url": "https://amazon.com/...",
      "vendor_name": "Amazon",
      "thumbnail_url": "https://...",
      "is_optional": false,
      "display_order": 1
    },
    {
      "id": 102,
      "piece_name": "Tactical Vest",
      "piece_type": "Clothing",
      "estimated_cost": 45.00,
      "purchase_url": "https://etsy.com/...",
      "vendor_name": "Etsy",
      "is_optional": false,
      "display_order": 2
    }
  ],
  "total_estimated_cost": 350.00
}
```

---

### 4. **POST /builds**
Create a new costume build (logged in or anonymous).

**Request Body:**
```json
{
  "cosplay_character_id": 3,
  "costume_appearance_id": 1,
  "build_name": "My Yelena Costume",
  "user_id": 12345,           // Optional (null if anonymous)
  "session_id": "abc123xyz",  // Required if anonymous
  "selected_piece_ids": [101, 102, 103, 105]
}
```

**Response:**
```json
{
  "id": 789,
  "cosplay_character_id": 3,
  "costume_appearance_id": 1,
  "build_name": "My Yelena Costume",
  "total_cost": 245.99,
  "status": "draft",
  "created_at": "2026-11-03T19:41:00Z"
}
```

---

### 5. **GET /builds/{build_id}**
Get a saved build with all selected pieces.

**Response:**
```json
{
  "id": 789,
  "character": {
    "id": 3,
    "name": "Yelena Belova"
  },
  "appearance": {
    "id": 1,
    "title": "Black Widow (2021)"
  },
  "build_name": "My Yelena Costume",
  "selected_pieces": [
    {
      "id": 101,
      "piece_name": "White Jumpsuit",
      "estimated_cost": 89.99,
      "purchase_url": "https://amazon.com/..."
    },
    {
      "id": 102,
      "piece_name": "Tactical Vest",
      "estimated_cost": 45.00,
      "purchase_url": "https://etsy.com/..."
    }
  ],
  "total_cost": 245.99,
  "uploaded_photo_url": null,
  "rendered_photo_url": null,
  "status": "draft"
}
```

---

### 6. **PUT /builds/{build_id}/pieces**
Update selected pieces in a build.

**Request Body:**
```json
{
  "selected_piece_ids": [101, 102, 105, 107]
}
```

**Response:**
```json
{
  "id": 789,
  "total_cost": 280.50,
  "updated_at": "2026-11-03T19:45:00Z"
}
```

---

### 7. **POST /builds/{build_id}/upload-photo**
Upload user photo for AI rendering (future feature).

**Request:** `multipart/form-data`
- `photo`: Image file

**Response:**
```json
{
  "id": 789,
  "uploaded_photo_url": "https://fancon.s3.amazonaws.com/uploads/789.jpg",
  "status": "processing"
}
```

---

### 8. **GET /builds/{build_id}/render**
Get AI-rendered photo result (future feature).

**Response:**
```json
{
  "id": 789,
  "uploaded_photo_url": "https://...",
  "rendered_photo_url": "https://...",
  "status": "completed"
}
```

---

### 9. **GET /my-builds**
Get all builds for logged-in user.

**Query Params:**
- `user_id` (required if logged in)
- `session_id` (required if anonymous)

**Response:**
```json
{
  "builds": [
    {
      "id": 789,
      "character_name": "Yelena Belova",
      "appearance_title": "Black Widow (2021)",
      "build_name": "My Yelena Costume",
      "total_cost": 245.99,
      "status": "draft",
      "created_at": "2026-11-03T19:41:00Z"
    }
  ]
}
```

---

### 10. **DELETE /builds/{build_id}**
Delete a build.

**Response:**
```json
{
  "message": "Build deleted successfully"
}
```

---

## 📄 Swagger/OpenAPI JSON

See `swagger.json` file for complete API specification!

---

## 🔌 React Frontend Integration

### Example: Fetching Characters

```javascript
// src/services/api.js
const API_BASE = 'https://api.fancon.ai/cosplay-builder';

export const fetchCharacters = async (searchTerm = '') => {
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  
  const response = await fetch(`${API_BASE}/characters?${params}`);
  if (!response.ok) throw new Error('Failed to fetch characters');
  
  const data = await response.json();
  return data.data; // Array of characters
};

export const fetchCharacterDetails = async (characterId) => {
  const response = await fetch(`${API_BASE}/characters/${characterId}`);
  if (!response.ok) throw new Error('Failed to fetch character');
  
  return await response.json();
};

export const fetchCostumePieces = async (appearanceId) => {
  const response = await fetch(`${API_BASE}/appearances/${appearanceId}/pieces`);
  if (!response.ok) throw new Error('Failed to fetch pieces');
  
  return await response.json();
};

export const createBuild = async (buildData) => {
  const response = await fetch(`${API_BASE}/builds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildData),
  });
  
  if (!response.ok) throw new Error('Failed to create build');
  return await response.json();
};

export const updateBuildPieces = async (buildId, selectedPieceIds) => {
  const response = await fetch(`${API_BASE}/builds/${buildId}/pieces`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selected_piece_ids: selectedPieceIds }),
  });
  
  if (!response.ok) throw new Error('Failed to update build');
  return await response.json();
};
```

---

### Example: Update CharacterSelection Component

```javascript
// src/components/CharacterSelection.jsx
import { useState, useEffect } from "react";
import { fetchCharacters } from "../services/api";
import CharacterCard from "./CharacterCard";

function CharacterSelection({ selectedCharacter, onSelectCharacter }) {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, [searchTerm]);

  async function loadCharacters() {
    setLoading(true);
    try {
      const data = await fetchCharacters(searchTerm);
      setCharacters(data);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Choose Your Character</h2>
      
      <input
        type="text"
        placeholder="🔍 Search for a character"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={selectedCharacter?.id === character.id}
              onSelect={() => onSelectCharacter(character)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CharacterSelection;
```

---

### Example: Session Tracking for Anonymous Users

```javascript
// src/utils/session.js
export function getSessionId() {
  let sessionId = localStorage.getItem('cosplay_session_id');
  
  if (!sessionId) {
    // Generate unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cosplay_session_id', sessionId);
  }
  
  return sessionId;
}

export function getUserId() {
  // Get from FanCon auth context/state
  // Return null if not logged in
  return window.fanconAuth?.userId || null;
}

// Use in build creation:
import { getSessionId, getUserId } from '../utils/session';

const buildData = {
  cosplay_character_id: characterId,
  costume_appearance_id: appearanceId,
  selected_piece_ids: selectedPieces,
  user_id: getUserId(),      // null if anonymous
  session_id: getSessionId(), // always present
};

await createBuild(buildData);
```

---

## 🎨 Purchase Links Feature

When displaying costume pieces, show buy buttons:

```javascript
// src/components/CostumePiece.jsx
function CostumePiece({ piece, isSelected, onToggle }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
      />
      
      <img src={piece.thumbnail_url} alt={piece.piece_name} />
      <h3>{piece.piece_name}</h3>
      <p>${piece.estimated_cost}</p>
      
      {piece.purchase_url && (
        <a 
          href={piece.purchase_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="buy-button"
        >
          Buy on {piece.vendor_name || 'Website'} →
        </a>
      )}
    </div>
  );
}
```

---

## 🚀 Deployment Checklist

- [ ] Add new tables to FanCon database
- [ ] Create Python API endpoints (FastAPI/Flask)
- [ ] Set up CORS for React app
- [ ] Deploy Swagger UI for API documentation
- [ ] Test anonymous user flows (session tracking)
- [ ] Test logged-in user flows (user_id)
- [ ] Add S3/storage for photo uploads
- [ ] Set up AI rendering pipeline (future)
- [ ] Add authentication middleware
- [ ] Monitor API performance

---

## 🔐 Authentication Flow

```javascript
// If user is logged in to FanCon, include auth token:
const API_BASE = 'https://api.fancon.ai/cosplay-builder';

async function apiRequest(endpoint, options = {}) {
  const token = getFanConAuthToken(); // Get from FanCon auth
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return await response.json();
}
```

---

## 📊 Summary

### What's Different from Original Design:
1. ✅ **Table names changed** to avoid conflicts with existing FanCon schema
2. ✅ **Purchase links** added to costume pieces
3. ✅ **User/anonymous support** with session tracking
4. ✅ **Photo upload fields** for AI rendering
5. ✅ **Python/FastAPI** instead of Node.js
6. ✅ **Integration with FanCon auth** (optional)

### Next Steps:
1. Review Swagger JSON spec
2. Create Python endpoints
3. Update React components to use API
4. Test end-to-end flow
5. Deploy to fancon.ai infrastructure

Ready to build! 🎉
