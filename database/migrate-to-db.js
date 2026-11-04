/**
 * ============================================
 * DATA MIGRATION SCRIPT
 * ============================================
 * This script migrates data from characters.js to PostgreSQL database
 * 
 * Prerequisites:
 * 1. PostgreSQL installed and running
 * 2. Database created
 * 3. Run phase1-schema.sql first to create tables
 * 4. Install dependencies: npm install pg
 * 
 * Usage:
 *   node migrate-to-db.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ============================================
// DATABASE CONNECTION CONFIG
// ============================================
// Update these with your actual database credentials
const pool = new Pool({
  user: 'your_db_user',        // e.g., 'postgres'
  host: 'localhost',            // or your DB host
  database: 'cosplay_builder',  // your database name
  password: 'your_password',    // your DB password
  port: 5432,                   // default PostgreSQL port
});

// ============================================
// LOAD CHARACTER DATA
// ============================================
// Option 1: If you have characters.js as a proper module
// const characters = require('../src/data/characters.js');

// Option 2: Read and parse the file manually
function loadCharactersData() {
  try {
    // Read the characters.js file
    const charactersPath = path.join(__dirname, '../src/data/characters.js');
    const fileContent = fs.readFileSync(charactersPath, 'utf8');
    
    // Extract the array from the file (basic parsing)
    // This assumes the file exports a simple array
    const arrayMatch = fileContent.match(/const characters = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      throw new Error('Could not parse characters array from file');
    }
    
    // Evaluate the array (be careful with this in production!)
    const characters = eval(arrayMatch[1]);
    return characters;
  } catch (error) {
    console.error('Error loading characters data:', error);
    throw error;
  }
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

/**
 * Insert a character and return its database ID
 */
async function insertCharacter(character, client) {
  try {
    // Determine franchise and category from character name (you may want to adjust this logic)
    let franchise = null;
    let category = null;
    
    // Simple franchise detection (improve this logic as needed)
    if (['Doctor Doom', 'Spider-Gwen', 'Yelena Belova', 'Storm', 'Ghost Rider', 'Blade'].includes(character.name)) {
      franchise = 'Marvel';
      category = 'Superhero';
    } else if (character.name === 'Ahsoka Tano') {
      franchise = 'Star Wars';
      category = 'Sci-Fi';
    } else if (character.name === 'Ash Ketchum') {
      franchise = 'Pokemon';
      category = 'Anime';
    } else if (character.name === 'Abby Anderson') {
      franchise = 'The Last of Us';
      category = 'Video Game';
    }
    
    const result = await client.query(
      `INSERT INTO characters (name, image_url, franchise, category) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [character.name, character.image, franchise, category]
    );
    
    const characterId = result.rows[0].id;
    console.log(`  ✓ Inserted character: ${character.name} (ID: ${characterId})`);
    return characterId;
  } catch (error) {
    console.error(`  ✗ Error inserting character ${character.name}:`, error.message);
    throw error;
  }
}

/**
 * Insert an appearance and return its database ID
 */
async function insertAppearance(appearance, characterId, client) {
  try {
    // Extract year from title if possible (e.g., "Black Widow (2021)")
    let releaseYear = null;
    const yearMatch = appearance.title.match(/\((\d{4})\)/);
    if (yearMatch) {
      releaseYear = parseInt(yearMatch[1]);
    }
    
    const result = await client.query(
      `INSERT INTO appearances (character_id, title, outfit_name, description, release_year) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [characterId, appearance.title, appearance.outfitName, appearance.description, releaseYear]
    );
    
    const appearanceId = result.rows[0].id;
    console.log(`    ✓ Inserted appearance: ${appearance.title} (ID: ${appearanceId})`);
    return appearanceId;
  } catch (error) {
    console.error(`    ✗ Error inserting appearance ${appearance.title}:`, error.message);
    throw error;
  }
}

/**
 * Insert outfit pieces for an appearance
 */
async function insertOutfitPieces(outfitPieces, appearanceId, client) {
  try {
    for (let i = 0; i < outfitPieces.length; i++) {
      const pieceName = outfitPieces[i];
      
      // Determine piece type from name (improve this logic as needed)
      let pieceType = 'Clothing'; // default
      if (pieceName.toLowerCase().includes('wig')) {
        pieceType = 'Wig';
      } else if (pieceName.toLowerCase().includes('boot') || pieceName.toLowerCase().includes('shoe')) {
        pieceType = 'Footwear';
      } else if (pieceName.toLowerCase().includes('belt') || 
                 pieceName.toLowerCase().includes('holster') ||
                 pieceName.toLowerCase().includes('glove')) {
        pieceType = 'Accessory';
      }
      
      // Wigs and some accessories are usually optional
      const isOptional = ['Wig', 'Holster', 'Fingerless Gloves'].includes(pieceName);
      
      await client.query(
        `INSERT INTO outfit_pieces (appearance_id, piece_name, piece_type, display_order, is_optional) 
         VALUES ($1, $2, $3, $4, $5)`,
        [appearanceId, pieceName, pieceType, i, isOptional]
      );
    }
    
    console.log(`      ✓ Inserted ${outfitPieces.length} outfit pieces`);
  } catch (error) {
    console.error(`      ✗ Error inserting outfit pieces:`, error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration...\n');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Load character data
    console.log('📂 Loading character data from characters.js...');
    const characters = loadCharactersData();
    console.log(`   Found ${characters.length} characters to migrate\n`);
    
    // Migrate each character
    for (const character of characters) {
      const characterId = await insertCharacter(character, client);
      
      // Migrate appearances if they exist
      if (character.appearances && character.appearances.length > 0) {
        for (const appearance of character.appearances) {
          const appearanceId = await insertAppearance(appearance, characterId, client);
          
          // Migrate outfit pieces
          if (appearance.outfitPieces && appearance.outfitPieces.length > 0) {
            await insertOutfitPieces(appearance.outfitPieces, appearanceId, client);
          }
        }
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Show summary
    console.log('\n✅ Migration completed successfully!\n');
    
    // Get counts
    const charCount = await client.query('SELECT COUNT(*) FROM characters');
    const appCount = await client.query('SELECT COUNT(*) FROM appearances');
    const pieceCount = await client.query('SELECT COUNT(*) FROM outfit_pieces');
    
    console.log('📊 Summary:');
    console.log(`   Characters:    ${charCount.rows[0].count}`);
    console.log(`   Appearances:   ${appCount.rows[0].count}`);
    console.log(`   Outfit Pieces: ${pieceCount.rows[0].count}`);
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error.message);
    console.error('   All changes have been rolled back.');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// ============================================
// RUN MIGRATION
// ============================================

if (require.main === module) {
  // Only run if this file is executed directly
  migrate()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration error:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
