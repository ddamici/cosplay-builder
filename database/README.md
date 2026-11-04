# Database Setup Guide

This folder contains everything your backend engineer needs to set up and migrate the Cosplay Builder database.

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `phase1-schema.sql` | Creates the core database tables (characters, appearances, outfit_pieces) |
| `phase1-seed-data.sql` | Imports your existing character data |
| `sample-queries.sql` | Ready-to-use SQL queries for your API endpoints |
| `migrate-to-db.js` | Node.js script to automate data migration |
| `api-example.js` | Sample Express.js API implementation |

---

## 🚀 Quick Start

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

---

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE cosplay_builder;

# Connect to the new database
\c cosplay_builder

# Exit
\q
```

---

### Step 3: Run Schema

```bash
# Run the schema file to create tables
psql -d cosplay_builder -f phase1-schema.sql
```

You should see:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
...
NOTICE:  Phase 1 tables created successfully!
```

---

### Step 4: Import Data

**Option A: Using SQL file (recommended)**
```bash
psql -d cosplay_builder -f phase1-seed-data.sql
```

**Option B: Using Node.js migration script**
```bash
# Install dependencies
npm install pg

# Update database credentials in migrate-to-db.js
# Then run:
node migrate-to-db.js
```

---

### Step 5: Verify Data

```bash
psql -d cosplay_builder

# Check character count
SELECT COUNT(*) FROM characters;

# View all characters
SELECT id, name FROM characters;

# View character with appearances
SELECT c.name, a.title 
FROM characters c 
LEFT JOIN appearances a ON c.id = a.character_id 
ORDER BY c.name;

# Exit
\q
```

---

## 🔌 Connect to Database from Your App

### Node.js with pg (PostgreSQL client)

```bash
npm install pg
```

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'cosplay_builder',
  password: 'your_password',
  port: 5432,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});
```

---

### Environment Variables (.env)

Create a `.env` file in your project root:

```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=cosplay_builder
DB_PASSWORD=your_password
DB_PORT=5432
```

Then in your code:
```javascript
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
```

---

## 📚 API Implementation Examples

### Example 1: Get All Characters

```javascript
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, image_url as image FROM characters ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example 2: Search Characters

```javascript
app.get('/api/characters/search', async (req, res) => {
  try {
    const { q } = req.query; // ?q=spider
    const result = await pool.query(
      `SELECT id, name, image_url as image 
       FROM characters 
       WHERE LOWER(name) LIKE LOWER($1)`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example 3: Get Character with Appearances

```javascript
app.get('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get character
    const charResult = await pool.query(
      'SELECT * FROM characters WHERE id = $1',
      [id]
    );
    
    if (charResult.rows.length === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const character = charResult.rows[0];
    
    // Get appearances
    const appResult = await pool.query(
      'SELECT * FROM appearances WHERE character_id = $1',
      [id]
    );
    
    // Get outfit pieces for each appearance
    for (let appearance of appResult.rows) {
      const piecesResult = await pool.query(
        'SELECT piece_name FROM outfit_pieces WHERE appearance_id = $1 ORDER BY display_order',
        [appearance.id]
      );
      appearance.outfitPieces = piecesResult.rows.map(row => row.piece_name);
    }
    
    character.appearances = appResult.rows;
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

See `api-example.js` for complete Express.js implementation!

---

## 🛠️ Useful Commands

### Database Management

```bash
# List all databases
psql -l

# Connect to database
psql -d cosplay_builder

# List all tables
\dt

# Describe a table
\d characters

# Drop database (careful!)
DROP DATABASE cosplay_builder;

# Backup database
pg_dump cosplay_builder > backup.sql

# Restore database
psql cosplay_builder < backup.sql
```

---

### SQL Queries for Development

```sql
-- View all data
SELECT * FROM characters;
SELECT * FROM appearances;
SELECT * FROM outfit_pieces;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM characters) as characters,
  (SELECT COUNT(*) FROM appearances) as appearances,
  (SELECT COUNT(*) FROM outfit_pieces) as pieces;

-- Find characters without appearances
SELECT c.* 
FROM characters c
LEFT JOIN appearances a ON c.id = a.character_id
WHERE a.id IS NULL;

-- Delete all data (keep tables)
TRUNCATE characters, appearances, outfit_pieces RESTART IDENTITY CASCADE;

-- Reset auto-increment counters
SELECT setval('characters_id_seq', 1, false);
SELECT setval('appearances_id_seq', 1, false);
SELECT setval('outfit_pieces_id_seq', 1, false);
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
   - Use `.env` files (add to `.gitignore`)
   - Use environment variables in production

2. **Use parameterized queries** (always!)
   ```javascript
   // ✅ GOOD (prevents SQL injection)
   pool.query('SELECT * FROM characters WHERE id = $1', [id]);
   
   // ❌ BAD (vulnerable to SQL injection)
   pool.query(`SELECT * FROM characters WHERE id = ${id}`);
   ```

3. **Implement authentication** before allowing data modifications

4. **Use HTTPS** in production

5. **Regular backups** - automate daily backups

6. **Set up read-only database users** for your application
   ```sql
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;
   ```

---

## 📊 Database Tools

### GUI Tools (Recommended)

1. **pgAdmin** - Official PostgreSQL GUI
   - Download: https://www.pgadmin.org/

2. **DBeaver** - Universal database tool
   - Download: https://dbeaver.io/

3. **TablePlus** - Modern database GUI (macOS/Windows)
   - Download: https://tableplus.com/

4. **Postico** - macOS PostgreSQL client
   - Download: https://eggerapps.at/postico/

---

## 🐛 Troubleshooting

### Issue: "peer authentication failed"

**Solution:** Edit PostgreSQL config to use password authentication

```bash
# Find config file
psql -t -P format=unaligned -c 'SHOW hba_file';

# Edit it (use sudo)
sudo nano /path/to/pg_hba.conf

# Change this line:
# local   all   all   peer
# to:
# local   all   all   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

### Issue: "database does not exist"

**Solution:** Create the database first

```bash
createdb cosplay_builder
```

---

### Issue: "relation does not exist"

**Solution:** Run the schema file

```bash
psql -d cosplay_builder -f phase1-schema.sql
```

---

### Issue: Connection refused

**Solution:** Make sure PostgreSQL is running

```bash
# Check status
systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

---

## 📞 Need Help?

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js pg module: https://node-postgres.com/
- Stack Overflow: Tag your questions with `postgresql` and `node.js`

---

## 🎯 Next Steps

1. ✅ Set up database (Phase 1)
2. ✅ Import character data
3. ✅ Build REST API
4. ⬜ Add user authentication (Phase 2)
5. ⬜ Implement saved builds feature
6. ⬜ Add search & filtering (Phase 3)
7. ⬜ Shopping & materials (Phase 4)
8. ⬜ Community features (Phase 5)

Refer to `../DATABASE_SCHEMA_RECOMMENDATIONS.md` for the complete roadmap!
