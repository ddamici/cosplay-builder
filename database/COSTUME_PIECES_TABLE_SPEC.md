# Costume Pieces Table Specification

## Overview
This document shows the exact structure needed for the costume pieces database table and API endpoint. The frontend is already built to consume this structure.

---

## Database Table: `outfit_pieces`

### Table Schema (PostgreSQL)

```sql
CREATE TABLE outfit_pieces (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Keys
    appearance_id BIGINT NOT NULL,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,  -- "Clothing", "Accessory", "Footwear", "Wig", "Prop"
    
    -- Image
    image_url TEXT,  -- URL to product reference image
    
    -- Pricing
    estimated_cost_min DECIMAL(10,2),
    estimated_cost_max DECIMAL(10,2),
    
    -- Metadata
    difficulty_level VARCHAR(50),  -- "Easy", "Medium", "Hard"
    is_optional BOOLEAN DEFAULT false,
    notes TEXT,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_appearance
        FOREIGN KEY(appearance_id) 
        REFERENCES appearances(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_outfit_pieces_appearance ON outfit_pieces(appearance_id);
CREATE INDEX idx_outfit_pieces_type ON outfit_pieces(piece_type);
```

---

## Related Table: `purchase_links`

```sql
CREATE TABLE purchase_links (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Key
    outfit_piece_id BIGINT NOT NULL,
    
    -- Purchase Info
    vendor VARCHAR(255) NOT NULL,  -- "Amazon", "Etsy", etc.
    url TEXT NOT NULL,
    price DECIMAL(10,2),
    
    -- Status
    in_stock BOOLEAN DEFAULT true,
    is_affiliate BOOLEAN DEFAULT false,
    
    -- Metadata
    priority INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_outfit_piece
        FOREIGN KEY(outfit_piece_id) 
        REFERENCES outfit_pieces(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_purchase_links_piece ON purchase_links(outfit_piece_id);
```

---

## API Endpoint Required

### `GET /api/v1/appearances/:appearanceId/outfit-pieces`

**What the frontend expects:**

```javascript
// Example request:
// GET /api/v1/appearances/1/outfit-pieces

// Expected response format:
{
  "data": [
    {
      "id": 1,
      "name": "White Jumpsuit",
      "type": "Clothing",
      "imageUrl": "https://yourcdn.com/images/white-jumpsuit.jpg",
      "estimatedCostMin": 34.99,
      "estimatedCostMax": 89.99,
      "difficultyLevel": "Medium",
      "isOptional": false,
      "notes": "Core piece of the costume",
      "purchaseLinks": [
        {
          "id": 1,
          "vendor": "Amazon",
          "url": "https://amazon.com/...",
          "price": 34.99,
          "inStock": true,
          "isAffiliate": false
        },
        {
          "id": 2,
          "vendor": "Etsy",
          "url": "https://etsy.com/...",
          "price": 89.99,
          "inStock": true,
          "isAffiliate": false
        }
      ]
    },
    {
      "id": 2,
      "name": "Tactical Vest",
      "type": "Clothing",
      "imageUrl": "https://yourcdn.com/images/tactical-vest.jpg",
      "estimatedCostMin": 19.99,
      "estimatedCostMax": 29.99,
      "difficultyLevel": "Easy",
      "isOptional": false,
      "notes": "Worn over jumpsuit",
      "purchaseLinks": [
        {
          "id": 3,
          "vendor": "Amazon",
          "url": "https://amazon.com/...",
          "price": 29.99,
          "inStock": true,
          "isAffiliate": false
        }
      ]
    }
    // ... more pieces
  ]
}
```

---

## Example SQL Query

```sql
-- Get all outfit pieces for an appearance with purchase links
SELECT 
  op.id,
  op.name,
  op.type,
  op.image_url as "imageUrl",
  op.estimated_cost_min as "estimatedCostMin",
  op.estimated_cost_max as "estimatedCostMax",
  op.difficulty_level as "difficultyLevel",
  op.is_optional as "isOptional",
  op.notes,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pl.id,
        'vendor', pl.vendor,
        'url', pl.url,
        'price', pl.price,
        'inStock', pl.in_stock,
        'isAffiliate', pl.is_affiliate
      ) ORDER BY pl.priority DESC, pl.price ASC
    ) FILTER (WHERE pl.id IS NOT NULL),
    '[]'::json
  ) as "purchaseLinks"
FROM outfit_pieces op
LEFT JOIN purchase_links pl ON pl.outfit_piece_id = op.id
WHERE op.appearance_id = $1
GROUP BY op.id, op.name, op.type, op.image_url, 
         op.estimated_cost_min, op.estimated_cost_max,
         op.difficulty_level, op.is_optional, op.notes
ORDER BY op.display_order ASC, op.name ASC;
```

---

## Sample Data (for Yelena Belova - Black Widow 2021)

### outfit_pieces table:

| id | appearance_id | name | type | image_url | estimated_cost_min | estimated_cost_max | difficulty_level | is_optional | notes | display_order |
|----|---------------|------|------|-----------|-------------------|-------------------|------------------|-------------|-------|---------------|
| 1 | 1 | White Jumpsuit | Clothing | /images/jumpsuit.webp | 34.99 | 89.99 | Medium | false | Core piece | 1 |
| 2 | 1 | Tactical Vest | Clothing | /images/vest.jpg | 19.99 | 29.99 | Easy | false | Worn over jumpsuit | 2 |
| 3 | 1 | Utility Belt | Accessory | /images/belt.jpg | 15.99 | 24.99 | Easy | false | Tactical belt | 3 |
| 4 | 1 | White Lace-up Boots | Footwear | /images/boots.jpg | 45.99 | 79.99 | Easy | false | Combat boots | 4 |
| 5 | 1 | Fingerless Gloves | Accessory | /images/gloves.webp | 12.99 | 18.99 | Easy | true | Tactical gloves | 5 |
| 6 | 1 | Holster | Accessory | /images/holster.jpg | 19.99 | 32.99 | Easy | true | Leg holster | 6 |
| 7 | 1 | Wig | Wig | /images/wig.jpg | 24.99 | 42.99 | Medium | false | Blonde short wig | 7 |

### purchase_links table:

| id | outfit_piece_id | vendor | url | price | in_stock | is_affiliate | priority |
|----|----------------|--------|-----|-------|----------|--------------|----------|
| 1 | 1 | Amazon | https://amazon.com/... | 34.99 | true | false | 10 |
| 2 | 1 | Etsy | https://etsy.com/... | 89.99 | true | false | 5 |
| 3 | 2 | Amazon | https://amazon.com/... | 29.99 | true | false | 10 |
| 4 | 2 | AliExpress | https://aliexpress.com/... | 19.99 | true | false | 5 |

---

## Frontend Integration

The frontend currently uses this mock data structure in:
- **File:** `/src/data/outfitPieceImages.js`
- **Function:** `getCostumePiece(pieceName)`

### How Frontend Will Switch to API:

**Current (mock):**
```javascript
import { getCostumePiece } from '../data/outfitPieceImages';

const pieceData = getCostumePiece("White Jumpsuit");
```

**Future (API):**
```javascript
// Fetch from API
const response = await fetch(`/api/v1/appearances/${appearanceId}/outfit-pieces`);
const { data } = await response.json();

// Data is already in the right format!
data.forEach(pieceData => {
  console.log(pieceData.name, pieceData.imageUrl, pieceData.purchaseLinks);
});
```

---

## Key Points for Backend Engineer

### ✅ Must Have:
1. Each outfit piece has an array of `purchaseLinks` nested within it
2. Purchase links should be ordered by priority (highest first) then price (lowest first)
3. All field names use camelCase in the JSON response (matches frontend)
4. The `imageUrl` field can be null if no image is available yet
5. The `isOptional` field indicates if the piece is required for the costume

### ⚠️ Important:
- Do NOT return separate endpoints for pieces and links - nest them together
- The frontend expects the purchase links array to be included in each piece object
- Empty purchase links should return `[]`, not `null`
- Image URLs should be absolute paths (full CDN URL)

### 🔄 Migration Path:
1. Create tables using SQL above
2. Migrate data from `costumePiecesData` in `/src/data/outfitPieceImages.js`
3. Update frontend to call API instead of mock data
4. Test that response matches the exact structure shown above

---

## Testing the API

### Using curl:
```bash
curl http://localhost:3000/api/v1/appearances/1/outfit-pieces | jq
```

### Expected output should match:
See the JSON example in the "API Endpoint Required" section above.

---

## Questions for Backend Engineer:

1. Will images be stored on CDN or served from backend?
2. Should we cache these responses (they change infrequently)?
3. Do we need authentication for this endpoint?
4. Should purchase links track click-through analytics?

---

**Last Updated:** November 9, 2026  
**Frontend Ready:** ✅ Yes, already consuming this structure in mock form  
**Backend TODO:** Implement tables and API endpoint as specified above
