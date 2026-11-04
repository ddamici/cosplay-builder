# 🎭 Backend Development Handoff

Hey Backend Engineer! 👋

This document explains what you need to get the Cosplay Builder database and API up and running.

---

## 📦 What's Included

I've created a complete database schema and API implementation for you. Here's what you'll find:

### 📂 Main Documentation
- **`DATABASE_SCHEMA_RECOMMENDATIONS.md`** - Complete database architecture with 5 phases (MVP to full features)

### 📂 database/ folder
All the files you need to get started:

| File | What It Does |
|------|--------------|
| `README.md` | Step-by-step setup guide |
| `phase1-schema.sql` | Creates the database tables (run this first!) |
| `phase1-seed-data.sql` | Imports the existing character data |
| `sample-queries.sql` | Ready-to-use SQL queries for your API |
| `migrate-to-db.js` | Node.js script to automate migration |
| `api-example.js` | Complete Express.js API implementation |
| `package.json` | NPM dependencies |
| `.env.example` | Example environment variables |
| `ERD.md` | Visual database diagrams |

---

## 🚀 Quick Start (5 minutes)

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu
sudo apt install postgresql postgresql-contrib
```

### 2. Create Database
```bash
psql postgres
CREATE DATABASE cosplay_builder;
\q
```

### 3. Run Schema
```bash
cd database
psql -d cosplay_builder -f phase1-schema.sql
```

### 4. Import Data
```bash
psql -d cosplay_builder -f phase1-seed-data.sql
```

### 5. Test API (Optional)
```bash
# Install dependencies
npm install

# Copy and configure .env
cp .env.example .env
# Edit .env with your database password

# Start server
npm start

# Test it
curl http://localhost:3000/api/characters
```

---

## 📊 Database Structure

### Phase 1 (MVP) - Implement Now
**3 tables that replace the current `characters.js` file:**

```
characters
├── id (primary key)
├── name
├── image_url
├── franchise (e.g., "Marvel", "Star Wars")
└── category (e.g., "Superhero", "Anime")

appearances
├── id (primary key)
├── character_id (foreign key → characters)
├── title (e.g., "Black Widow (2021)")
├── outfit_name (e.g., "Tactical Gear")
└── description

outfit_pieces
├── id (primary key)
├── appearance_id (foreign key → appearances)
├── piece_name (e.g., "White Jumpsuit")
├── piece_type (e.g., "Clothing", "Accessory")
└── display_order
```

### Future Phases (Later)
- **Phase 2:** User accounts & saved builds
- **Phase 3:** Search & tags
- **Phase 4:** Shopping & materials
- **Phase 5:** Community features

See `DATABASE_SCHEMA_RECOMMENDATIONS.md` for complete details.

---

## 🔌 API Endpoints

The `api-example.js` file includes these ready-to-use endpoints:

### Characters
```
GET  /api/characters                    - List all (with search & pagination)
GET  /api/characters/:id                - Get one with all appearances
GET  /api/characters/popular            - Get trending characters
GET  /api/characters/:id/appearances    - Get character's appearances
```

### Appearances
```
GET  /api/appearances/:id                      - Get appearance with outfit pieces
GET  /api/appearances/:id/outfit-pieces        - Get outfit pieces
```

### Metadata
```
GET  /api/franchises    - List all franchises (Marvel, Star Wars, etc.)
GET  /api/categories    - List all categories (Superhero, Anime, etc.)
GET  /api/stats         - Overall statistics
```

### Admin (TODO: Add authentication!)
```
POST /api/admin/characters    - Create new character
```

---

## 🔍 Important SQL Queries

### Get Character with All Data (matches current JSON format!)
```sql
SELECT 
    c.id,
    c.name,
    c.image_url as image,
    json_agg(
        json_build_object(
            'id', a.id,
            'title', a.title,
            'outfitName', a.outfit_name,
            'description', a.description,
            'outfitPieces', (
                SELECT json_agg(op.piece_name ORDER BY op.display_order)
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

This query returns the **exact same format** as the current `characters.js` file, so your React app won't need changes!

More queries in `database/sample-queries.sql`.

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Use environment variables for all credentials (never hardcode!)
- [ ] Implement user authentication (JWT or sessions)
- [ ] Add rate limiting to prevent abuse
- [ ] Use parameterized queries (already done in examples)
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly (restrict origins)
- [ ] Add input validation
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Set up automated database backups
- [ ] Create database user with limited permissions (not postgres superuser)

---

## 🎯 Testing the Database

### Verify data imported correctly:
```bash
psql -d cosplay_builder

-- Count records
SELECT 
    (SELECT COUNT(*) FROM characters) as characters,
    (SELECT COUNT(*) FROM appearances) as appearances,
    (SELECT COUNT(*) FROM outfit_pieces) as pieces;

-- Should show: 9 characters, 2 appearances, 13 pieces

-- View Yelena's data
SELECT c.name, a.title, a.outfit_name
FROM characters c
JOIN appearances a ON c.id = a.character_id
WHERE c.name = 'Yelena Belova';

-- Should show her Black Widow and Thunderbolts appearances
```

---

## 📚 Recommended Tech Stack

### Backend Framework
- **Express.js** (recommended, examples provided)
- OR: NestJS, Fastify, Koa

### Database Client
- **node-postgres (pg)** (used in examples)
- OR: Prisma, TypeORM, Knex

### Authentication
- **Passport.js** with JWT strategy
- OR: Auth0, Firebase Auth, Clerk

### Production Hosting
- **Database:** AWS RDS, DigitalOcean Managed Postgres, Supabase
- **API:** Heroku, Render, Railway, AWS Elastic Beanstalk
- **Alternative:** Supabase (gives you database + auth + API out of the box)

---

## 🐛 Common Issues & Solutions

### "peer authentication failed"
**Fix:** Edit `pg_hba.conf` to use `md5` instead of `peer`

### "database does not exist"
**Fix:** Run `createdb cosplay_builder`

### "relation does not exist"
**Fix:** Run the schema file: `psql -d cosplay_builder -f phase1-schema.sql`

### Connection refused
**Fix:** Start PostgreSQL: `brew services start postgresql@15` (macOS)

See `database/README.md` for more troubleshooting.

---

## 📞 Questions?

### Database Design Questions
- Read: `DATABASE_SCHEMA_RECOMMENDATIONS.md`
- Check: `database/ERD.md` for visual diagrams

### Setup Issues
- Read: `database/README.md`
- Check: PostgreSQL logs

### API Implementation
- Review: `database/api-example.js`
- Copy: `database/sample-queries.sql`

---

## ✅ Implementation Checklist

### Phase 1 - MVP (Do This First)
- [ ] Install PostgreSQL
- [ ] Create `cosplay_builder` database
- [ ] Run `phase1-schema.sql`
- [ ] Run `phase1-seed-data.sql`
- [ ] Verify data with test queries
- [ ] Set up Express.js API
- [ ] Copy `.env.example` to `.env` and configure
- [ ] Test all API endpoints
- [ ] Update React app to use API instead of `characters.js`
- [ ] Deploy to staging environment

### Phase 2 - Users (Later)
- [ ] Implement user authentication
- [ ] Add user tables (see main schema doc)
- [ ] Build saved builds feature
- [ ] Add API authorization

### Phase 3+ - Advanced Features
- [ ] Tags & search
- [ ] Materials & shopping
- [ ] Community features

---

## 🎨 Connecting React Frontend

Once your API is running, update the React app:

```javascript
// Before (using characters.js):
import characters from '../data/characters';

// After (using API):
const [characters, setCharacters] = useState([]);

useEffect(() => {
  fetch('http://localhost:3000/api/characters')
    .then(res => res.json())
    .then(data => setCharacters(data.data));
}, []);
```

The API returns data in the **same format** as `characters.js`, so minimal changes needed!

---

## 📈 Performance Tips

1. **Use connection pooling** (already in examples)
2. **Add indexes** (already in schema)
3. **Implement caching** (Redis for popular queries)
4. **Paginate large results** (already in API examples)
5. **Use database views** for complex queries
6. **Monitor slow queries** with PostgreSQL logs
7. **Consider read replicas** for high traffic

---

## 🎁 Bonus Features to Consider

- [ ] Image upload & storage (S3, Cloudinary)
- [ ] Full-text search (PostgreSQL `tsvector` or Elasticsearch)
- [ ] Real-time updates (WebSockets)
- [ ] GraphQL API (alternative to REST)
- [ ] Admin dashboard (view/edit data)
- [ ] Analytics (popular characters, searches)
- [ ] Export/backup functionality
- [ ] Automated database migrations (Knex, Prisma Migrate)

---

## 📖 Additional Resources

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Node.js pg module:** https://node-postgres.com/
- **Express.js Guide:** https://expressjs.com/
- **REST API Best Practices:** https://restfulapi.net/
- **Database Design Guide:** https://www.vertabelo.com/blog/database-design-best-practices/

---

**Good luck! 🚀**

The schema is well-designed and ready for production. If you run into issues, check the individual README files in each folder.

**P.S.** The database structure is designed to scale from MVP to a full-featured app with minimal refactoring!
