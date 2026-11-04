# Entity Relationship Diagram (ERD)

## Phase 1: Core Tables (MVP)

This diagram shows the relationships between the core database tables.

```mermaid
erDiagram
    characters ||--o{ appearances : "has many"
    appearances ||--o{ outfit_pieces : "contains"
    
    characters {
        bigint id PK
        varchar name UK
        text image_url
        varchar franchise
        varchar category
        integer popularity_score
        timestamp created_at
        timestamp updated_at
    }
    
    appearances {
        bigint id PK
        bigint character_id FK
        varchar title
        varchar outfit_name
        text description
        text image_url
        integer release_year
        integer popularity_score
        timestamp created_at
        timestamp updated_at
    }
    
    outfit_pieces {
        bigint id PK
        bigint appearance_id FK
        varchar piece_name
        varchar piece_type
        varchar difficulty_level
        decimal estimated_cost_min
        decimal estimated_cost_max
        integer display_order
        boolean is_optional
        text notes
        timestamp created_at
    }
```

---

## Phase 2: User & Saved Builds

```mermaid
erDiagram
    users ||--o{ saved_builds : "creates"
    characters ||--o{ saved_builds : "featured in"
    appearances ||--o{ saved_builds : "used in"
    saved_builds ||--o{ build_outfit_pieces : "contains"
    outfit_pieces ||--o{ build_outfit_pieces : "included in"
    
    users {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        varchar first_name
        varchar last_name
        text profile_image_url
        varchar experience_level
        text bio
        boolean is_active
        boolean email_verified
        timestamp created_at
        timestamp updated_at
        timestamp last_login_at
    }
    
    saved_builds {
        bigint id PK
        bigint user_id FK
        bigint character_id FK
        bigint appearance_id FK
        varchar build_name
        text notes
        varchar target_event
        date target_date
        decimal budget
        varchar status
        boolean is_public
        boolean is_favorite
        timestamp created_at
        timestamp updated_at
    }
    
    build_outfit_pieces {
        bigint id PK
        bigint build_id FK
        bigint outfit_piece_id FK
        boolean is_completed
        decimal actual_cost
        text purchase_url
        text notes
        timestamp completed_at
        timestamp created_at
    }
```

---

## Phase 3: Tags & Search

```mermaid
erDiagram
    tags ||--o{ character_tags : "applied to"
    tags ||--o{ appearance_tags : "applied to"
    characters ||--o{ character_tags : "tagged with"
    appearances ||--o{ appearance_tags : "tagged with"
    
    tags {
        bigint id PK
        varchar name UK
        varchar slug UK
        varchar category
        timestamp created_at
    }
    
    character_tags {
        bigint character_id PK,FK
        bigint tag_id PK,FK
    }
    
    appearance_tags {
        bigint appearance_id PK,FK
        bigint tag_id PK,FK
    }
```

---

## Complete System Architecture

```mermaid
erDiagram
    %% Core entities
    characters ||--o{ appearances : has
    appearances ||--o{ outfit_pieces : contains
    
    %% User system
    users ||--o{ saved_builds : creates
    users ||--o{ tutorials : writes
    users ||--o{ reviews : writes
    
    %% Saved builds
    saved_builds }o--|| characters : features
    saved_builds }o--|| appearances : uses
    saved_builds ||--o{ build_outfit_pieces : includes
    saved_builds ||--o{ build_photos : displays
    
    %% Outfit pieces relationships
    outfit_pieces ||--o{ build_outfit_pieces : selected_in
    outfit_pieces ||--o{ outfit_piece_materials : made_from
    outfit_pieces ||--o{ tutorials : explained_by
    outfit_pieces ||--o{ product_links : purchasable_from
    
    %% Materials & shopping
    materials ||--o{ outfit_piece_materials : used_in
    materials ||--o{ product_links : sold_as
    vendors ||--o{ product_links : sells
    
    %% Tags
    tags ||--o{ character_tags : categorizes
    tags ||--o{ appearance_tags : categorizes
    characters ||--o{ character_tags : tagged_with
    appearances ||--o{ appearance_tags : tagged_with
    
    %% Reviews
    characters ||--o{ reviews : reviewed
    appearances ||--o{ reviews : reviewed
    saved_builds ||--o{ reviews : reviewed
```

---

## Relationship Types Explained

| Symbol | Meaning |
|--------|---------|
| `||--o{` | One-to-Many (one parent, many children) |
| `}o--||` | Many-to-One (many children, one parent) |
| `||--||` | One-to-One |
| `}o--o{` | Many-to-Many |

---

## Key Relationships

### 1. **Characters → Appearances → Outfit Pieces**
- **One character** can have **many appearances** (e.g., Yelena in Black Widow vs Thunderbolts)
- **One appearance** contains **many outfit pieces** (e.g., White Jumpsuit, Tactical Vest, etc.)

### 2. **Users → Saved Builds**
- **One user** can create **many saved builds** (multiple cosplay projects)
- **One build** belongs to **one user**

### 3. **Saved Builds → Outfit Pieces (via junction table)**
- **Many-to-Many** relationship
- A build can have multiple pieces selected
- A piece can be used in multiple builds
- Junction table `build_outfit_pieces` tracks the relationship

### 4. **Tags System**
- **Many-to-Many** through junction tables
- Characters can have multiple tags (e.g., "MCU", "female", "villain")
- Tags can apply to multiple characters
- Same pattern for appearances

### 5. **Materials & Products**
- **One outfit piece** can use **many materials**
- **One material** can be used in **many outfit pieces**
- **One vendor** sells **many products**

---

## Cascade Delete Behavior

When you delete a parent record, what happens to children?

| Parent | Child | Action |
|--------|-------|--------|
| character | appearances | **CASCADE** - Delete all appearances |
| appearance | outfit_pieces | **CASCADE** - Delete all outfit pieces |
| user | saved_builds | **CASCADE** - Delete all user's builds |
| saved_build | build_outfit_pieces | **CASCADE** - Delete selections |
| saved_build | build_photos | **CASCADE** - Delete photos |

**Note:** Materials, vendors, and products use `SET NULL` or `RESTRICT` to prevent accidental data loss.

---

## Indexes for Performance

All foreign keys have indexes automatically:
- `character_id` in `appearances`
- `appearance_id` in `outfit_pieces`
- `user_id` in `saved_builds`
- etc.

Additional indexes on frequently queried columns:
- `characters.name` - for search
- `characters.franchise` - for filtering
- `characters.popularity_score` - for sorting
- `outfit_pieces.piece_type` - for filtering by type

---

## Database Normalization

This schema follows **Third Normal Form (3NF)**:

✅ **1NF**: All columns contain atomic values (no arrays in columns)  
✅ **2NF**: All non-key columns depend on the entire primary key  
✅ **3NF**: No transitive dependencies (no column depends on another non-key column)

**Example of good normalization:**
- Instead of storing outfit piece names directly in `saved_builds`, we use a junction table `build_outfit_pieces` that references the `outfit_pieces` table
- This prevents data duplication and ensures consistency

---

## How to View This Diagram

### Option 1: GitHub
Push this file to GitHub - it will automatically render the Mermaid diagrams.

### Option 2: VS Code
Install the "Markdown Preview Mermaid Support" extension.

### Option 3: Online
Copy the Mermaid code and paste it into [mermaid.live](https://mermaid.live/)

---

## Next Steps

1. Review the Phase 1 tables (characters, appearances, outfit_pieces)
2. Understand the relationships and foreign keys
3. Run the schema SQL to create tables
4. Query the data using joins to test relationships
5. Plan for Phase 2 (users and saved builds) when ready
