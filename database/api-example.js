/**
 * ============================================
 * SAMPLE EXPRESS API IMPLEMENTATION
 * ============================================
 * This is a complete example of how to build a REST API
 * for the Cosplay Builder application using Express and PostgreSQL
 * 
 * Prerequisites:
 * 1. npm install express pg dotenv cors
 * 2. Create .env file with database credentials
 * 3. Database tables created and populated
 * 
 * Usage:
 *   node api-example.js
 *   Server will run on http://localhost:3000
 */

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');

// ============================================
// APP SETUP
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests (for React frontend)
app.use(express.json()); // Parse JSON request bodies

// ============================================
// DATABASE CONNECTION
// ============================================

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cosplay_builder',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// ============================================
// API ROUTES - CHARACTERS
// ============================================

/**
 * GET /api/characters
 * Get all characters (with optional search and pagination)
 * 
 * Query params:
 *   - search: Filter by name (optional)
 *   - franchise: Filter by franchise (optional)
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 20)
 * 
 * Example: GET /api/characters?search=spider&page=1&limit=10
 */
app.get('/api/characters', async (req, res) => {
  try {
    const { search, franchise, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        id, 
        name, 
        image_url as image, 
        franchise, 
        category,
        popularity_score
      FROM characters
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Add search filter
    if (search) {
      query += ` AND LOWER(name) LIKE LOWER($${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Add franchise filter
    if (franchise) {
      query += ` AND franchise = $${paramIndex}`;
      params.push(franchise);
      paramIndex++;
    }
    
    // Add ordering and pagination
    query += ` ORDER BY popularity_score DESC, name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM characters WHERE 1=1';
    const countParams = [];
    let countIndex = 1;
    
    if (search) {
      countQuery += ` AND LOWER(name) LIKE LOWER($${countIndex})`;
      countParams.push(`%${search}%`);
      countIndex++;
    }
    
    if (franchise) {
      countQuery += ` AND franchise = $${countIndex}`;
      countParams.push(franchise);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/characters/:id
 * Get a single character with all appearances and outfit pieces
 * Returns data in the same format as your characters.js file!
 * 
 * Example: GET /api/characters/3
 */
app.get('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the complex query from sample-queries.sql
    const query = `
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
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.image_url, c.franchise, c.category
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/characters/popular
 * Get popular/trending characters
 * 
 * Example: GET /api/characters/popular?limit=5
 */
app.get('/api/characters/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        image_url as image, 
        franchise, 
        category, 
        popularity_score
      FROM characters
      WHERE popularity_score > 0
      ORDER BY popularity_score DESC
      LIMIT $1`,
      [limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular characters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// API ROUTES - APPEARANCES
// ============================================

/**
 * GET /api/characters/:characterId/appearances
 * Get all appearances for a specific character
 * 
 * Example: GET /api/characters/3/appearances
 */
app.get('/api/characters/:characterId/appearances', async (req, res) => {
  try {
    const { characterId } = req.params;
    
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        outfit_name as "outfitName", 
        description, 
        image_url as "imageUrl", 
        release_year as "releaseYear"
      FROM appearances
      WHERE character_id = $1
      ORDER BY release_year DESC, title ASC`,
      [characterId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appearances:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/appearances/:id
 * Get a single appearance with outfit pieces
 * 
 * Example: GET /api/appearances/1
 */
app.get('/api/appearances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        a.id,
        a.title,
        a.outfit_name as "outfitName",
        a.description,
        a.image_url as "imageUrl",
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
      WHERE a.id = $1
      GROUP BY a.id, a.title, a.outfit_name, a.description, a.image_url
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appearance not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appearance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// API ROUTES - OUTFIT PIECES
// ============================================

/**
 * GET /api/appearances/:appearanceId/outfit-pieces
 * Get all outfit pieces for an appearance
 * 
 * Example: GET /api/appearances/1/outfit-pieces
 */
app.get('/api/appearances/:appearanceId/outfit-pieces', async (req, res) => {
  try {
    const { appearanceId } = req.params;
    
    const result = await pool.query(
      `SELECT 
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
      WHERE appearance_id = $1
      ORDER BY display_order ASC`,
      [appearanceId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching outfit pieces:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// API ROUTES - FILTERS & METADATA
// ============================================

/**
 * GET /api/franchises
 * Get list of all franchises with character counts
 * 
 * Example: GET /api/franchises
 */
app.get('/api/franchises', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        franchise,
        COUNT(*) as "characterCount"
      FROM characters
      WHERE franchise IS NOT NULL
      GROUP BY franchise
      ORDER BY franchise ASC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching franchises:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/categories
 * Get list of all categories with character counts
 * 
 * Example: GET /api/categories
 */
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        category,
        COUNT(*) as "characterCount"
      FROM characters
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category ASC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/stats
 * Get overall statistics
 * 
 * Example: GET /api/stats
 */
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM characters) as "totalCharacters",
        (SELECT COUNT(*) FROM appearances) as "totalAppearances",
        (SELECT COUNT(*) FROM outfit_pieces) as "totalOutfitPieces"
    `);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ADMIN ROUTES (Protected - Add auth later!)
// ============================================

/**
 * POST /api/admin/characters
 * Create a new character (admin only)
 * 
 * Body: { name, image_url, franchise, category }
 */
app.post('/api/admin/characters', async (req, res) => {
  try {
    const { name, image_url, franchise, category } = req.body;
    
    // Validation
    if (!name || !image_url) {
      return res.status(400).json({ error: 'Name and image_url are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO characters (name, image_url, franchise, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, image_url, franchise, category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating character:', error);
    
    if (error.constraint === 'characters_name_unique') {
      return res.status(409).json({ error: 'Character name already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎭 Cosplay Builder API Server           ║
║   Running on http://localhost:${PORT}      ║
╚════════════════════════════════════════════╝

Available endpoints:
  GET    /api/characters
  GET    /api/characters/:id
  GET    /api/characters/popular
  GET    /api/characters/:characterId/appearances
  GET    /api/appearances/:id
  GET    /api/appearances/:appearanceId/outfit-pieces
  GET    /api/franchises
  GET    /api/categories
  GET    /api/stats
  POST   /api/admin/characters (admin)

Try it:
  curl http://localhost:${PORT}/api/characters
  curl http://localhost:${PORT}/api/characters/3
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
  });
});
