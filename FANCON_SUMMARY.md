# 🎭 FanCon Cosplay Builder - Quick Summary

## ✅ What I Created for You

### 📄 Key Documents

1. **`FANCON_INTEGRATION.md`** - Complete integration guide
   - Revised database schema (no conflicts with your existing tables)
   - All API endpoint specifications
   - React → Python backend integration examples
   - Anonymous + logged-in user support

2. **`swagger.json`** - OpenAPI 3.0 specification
   - Ready to import into Swagger UI
   - Complete API documentation
   - Request/response examples
   - Can be used to generate Python FastAPI code

3. **`fancon-schema.sql`** - Database schema SQL
   - Drop-in ready for PostgreSQL
   - Includes sample data
   - Purchase links included!

---

## 🗄️ Database Tables (Renamed to Avoid Conflicts)

| New Table Name | Original Name | Purpose |
|----------------|---------------|---------|
| `cosplay_characters` | `characters` | Characters with costumes |
| `costume_appearances` | `appearances` | Different outfit versions |
| `costume_pieces` | `outfit_pieces` | Individual pieces **with purchase links** |
| `costume_builds` | `saved_builds` | User's saved builds |
| `costume_build_pieces` | `build_outfit_pieces` | Selected pieces per build |

**Key Addition:** `costume_pieces` now has:
- ✅ `purchase_url` - Link to buy the piece
- ✅ `vendor_name` - Where to buy it (Amazon, Etsy, etc.)
- ✅ `estimated_cost` - Price estimate
- ✅ `thumbnail_url` - Image of the piece

---

## 🔌 API Endpoints

Base URL: `https://api.fancon.ai/cosplay-builder`

### Characters
- `GET /characters` - List all (with search, pagination)
- `GET /characters/{id}` - Get character with appearances

### Costume Pieces
- `GET /appearances/{id}/pieces` - Get pieces **with purchase links**

### Builds (Logged In or Anonymous)
- `POST /builds` - Create new build
- `GET /builds/{id}` - Get build details
- `PUT /builds/{id}/pieces` - Update selected pieces
- `GET /my-builds` - Get user's builds
- `DELETE /builds/{id}` - Delete build

### Photo Rendering (Future)
- `POST /builds/{id}/upload-photo` - Upload user photo
- `GET /builds/{id}/render` - Get AI-rendered result

**Complete API spec in `swagger.json`!**

---

## 👤 User Support

### Logged-In Users
```json
{
  "user_id": 12345,
  "cosplay_character_id": 3,
  "costume_appearance_id": 1,
  "selected_piece_ids": [101, 102, 103]
}
```

### Anonymous Users
```json
{
  "user_id": null,
  "session_id": "session_abc123xyz",
  "cosplay_character_id": 3,
  "costume_appearance_id": 1,
  "selected_piece_ids": [101, 102, 103]
}
```

---

## 🎨 Key Features

1. ✅ **Purchase Links** - Each costume piece has a buy link
2. ✅ **Cost Tracking** - Automatic total cost calculation
3. ✅ **Anonymous Support** - Works without login (session-based)
4. ✅ **Photo Upload** - Ready for AI rendering integration
5. ✅ **User Builds** - Save multiple costume builds
6. ✅ **Search & Filter** - By name, franchise, category

---

## 🚀 Implementation Steps

### 1. Database Setup
```bash
psql -d fancon_db -f fancon-schema.sql
```

### 2. Python Backend (FastAPI Example)
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncpg

app = FastAPI()

# Database connection
DATABASE_URL = "postgresql://user:pass@localhost/fancon_db"

@app.get("/cosplay-builder/characters")
async def get_characters(search: str = None, page: int = 1, limit: int = 20):
    # Connect to database
    conn = await asyncpg.connect(DATABASE_URL)
    
    # Query
    if search:
        query = """
            SELECT id, name, image_url, franchise, category 
            FROM cosplay_characters 
            WHERE LOWER(name) LIKE LOWER($1) AND is_active = true
            ORDER BY name
            LIMIT $2 OFFSET $3
        """
        rows = await conn.fetch(query, f"%{search}%", limit, (page-1)*limit)
    else:
        query = """
            SELECT id, name, image_url, franchise, category 
            FROM cosplay_characters 
            WHERE is_active = true
            ORDER BY name
            LIMIT $1 OFFSET $2
        """
        rows = await conn.fetch(query, limit, (page-1)*limit)
    
    await conn.close()
    
    return {
        "data": [dict(row) for row in rows],
        "pagination": {
            "page": page,
            "limit": limit
        }
    }

@app.get("/cosplay-builder/appearances/{appearance_id}/pieces")
async def get_costume_pieces(appearance_id: int):
    conn = await asyncpg.connect(DATABASE_URL)
    
    # Get appearance
    appearance = await conn.fetchrow(
        "SELECT * FROM costume_appearances WHERE id = $1", 
        appearance_id
    )
    
    if not appearance:
        raise HTTPException(status_code=404, detail="Appearance not found")
    
    # Get pieces with purchase links
    pieces = await conn.fetch("""
        SELECT 
            id, piece_name, piece_type, difficulty_level,
            estimated_cost, purchase_url, vendor_name,
            thumbnail_url, is_optional, display_order, notes
        FROM costume_pieces
        WHERE costume_appearance_id = $1 AND is_active = true
        ORDER BY display_order
    """, appearance_id)
    
    total_cost = sum(p['estimated_cost'] or 0 for p in pieces)
    
    await conn.close()
    
    return {
        "appearance": dict(appearance),
        "pieces": [dict(p) for p in pieces],
        "total_estimated_cost": total_cost
    }
```

### 3. React Integration
```javascript
// src/services/api.js
const API_BASE = 'https://api.fancon.ai/cosplay-builder';

export const fetchCharacters = async (search = '') => {
  const params = new URLSearchParams({ search });
  const response = await fetch(`${API_BASE}/characters?${params}`);
  const data = await response.json();
  return data.data;
};

export const fetchCostumePieces = async (appearanceId) => {
  const response = await fetch(`${API_BASE}/appearances/${appearanceId}/pieces`);
  return await response.json();
};

export const createBuild = async (buildData) => {
  const response = await fetch(`${API_BASE}/builds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildData)
  });
  return await response.json();
};
```

---

## 📊 Data Flow

```
User selects character
    ↓
GET /characters/{id} → Returns appearances
    ↓
User selects appearance
    ↓
GET /appearances/{id}/pieces → Returns pieces WITH purchase links
    ↓
User selects pieces they want
    ↓
POST /builds → Create build (logged in or anonymous)
    ↓
User clicks "Buy" links → Redirected to vendor sites
    ↓
[FUTURE] User uploads photo → POST /builds/{id}/upload-photo
    ↓
[FUTURE] AI renders costume → GET /builds/{id}/render
```

---

## 🎯 What Your Backend Team Needs to Do

1. **Add tables to FanCon database**
   - Run `fancon-schema.sql`
   - Verify with test queries

2. **Create Python API endpoints**
   - Use FastAPI or Flask
   - Follow the Swagger spec (`swagger.json`)
   - Connect to PostgreSQL

3. **Set up CORS**
   - Allow React app domain
   - Configure headers

4. **Test with Swagger UI**
   - Import `swagger.json`
   - Test all endpoints
   - Document edge cases

5. **Deploy to fancon.ai**
   - Mount at `/cosplay-builder` path
   - Set up database connection
   - Configure environment variables

---

## 🛒 Purchase Links Example

When displaying costume pieces:

```javascript
// Each piece looks like this:
{
  "id": 101,
  "piece_name": "White Jumpsuit",
  "estimated_cost": 89.99,
  "purchase_url": "https://amazon.com/...",
  "vendor_name": "Amazon",
  "thumbnail_url": "https://...",
  "is_optional": false
}

// In your UI:
<div className="costume-piece">
  <img src={piece.thumbnail_url} alt={piece.piece_name} />
  <h3>{piece.piece_name}</h3>
  <p>${piece.estimated_cost}</p>
  
  {piece.purchase_url && (
    <a href={piece.purchase_url} target="_blank">
      Buy on {piece.vendor_name} →
    </a>
  )}
  
  <button onClick={() => selectPiece(piece.id)}>
    Add to Build
  </button>
</div>
```

---

## 🔐 Anonymous vs Logged-In Flow

### Anonymous User
1. Generate session ID on first visit: `session_abc123xyz`
2. Store in localStorage
3. Send `session_id` in all API calls
4. Builds tied to session (can convert to user account later)

### Logged-In User
1. Get user ID from FanCon auth: `user_id: 12345`
2. Send `user_id` in all API calls
3. Builds tied to user account permanently

---

## 📝 Next Steps

- [ ] Review `swagger.json` with backend team
- [ ] Run `fancon-schema.sql` on dev database
- [ ] Implement Python endpoints (use FastAPI)
- [ ] Update React components to call API
- [ ] Test anonymous user flow
- [ ] Test logged-in user flow
- [ ] Add purchase links to costume pieces data
- [ ] Set up photo upload (S3/storage)
- [ ] Plan AI rendering integration

---

## 📚 Files Reference

| File | Purpose | Audience |
|------|---------|----------|
| `FANCON_INTEGRATION.md` | Complete integration guide | Backend + Frontend |
| `swagger.json` | API specification | Backend team |
| `fancon-schema.sql` | Database schema | Database admin |
| `FANCON_SUMMARY.md` | This file - quick reference | Everyone |

---

## ❓ Questions?

- **Database conflicts?** → Tables renamed (cosplay_*, costume_*)
- **API format?** → See `swagger.json`
- **User auth?** → Supports both logged-in and anonymous
- **Purchase links?** → Stored in `costume_pieces.purchase_url`
- **Photo rendering?** → Fields ready, integrate later

---

**Ready to build! 🚀**

Everything is designed to integrate cleanly with FanCon's existing Python backend and infrastructure.
