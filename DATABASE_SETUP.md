# Database Setup Guide

## Overview

The application has been updated to use **Prisma ORM** with **PostgreSQL** for persistent data storage. This replaces the in-memory storage and ensures data persists across server restarts.

## Prerequisites

- PostgreSQL 12+ (local development) or Render PostgreSQL add-on (production)
- Node.js 16+
- npm or yarn

## Local Development Setup

### 1. Install Dependencies

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Create `.env.local` file

```env
DATABASE_URL="postgresql://user:password@localhost:5432/financial_warfare"
```

### 3. Initialize Prisma

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database if it doesn't exist
- Run all migrations
- Generate Prisma Client

### 4. Seed Database (Optional)

```bash
npx prisma db seed
```

### 5. Run Dev Server

```bash
npm run dev
```

The application will now use PostgreSQL instead of in-memory storage.

---

## Production Setup (Render)

### 1. Add PostgreSQL Add-on

1. Go to your Render dashboard
2. Select your Financial Warfare service
3. Click "Add" → "Add Database"
4. Choose "PostgreSQL"
5. Create a new PostgreSQL instance (free tier available)

### 2. Update Environment Variables

In Render Environment tab, add:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

Render automatically generates this when you add the PostgreSQL add-on.

### 3. Deploy

When you deploy to Render:
1. Render will automatically detect the migration
2. Run: `npx prisma migrate deploy`
3. Database schema will be created automatically

**Render will run migrations on every deployment** if you add this to your build command:

```
npm run build
```

And update `package.json`:

```json
{
  "scripts": {
    "build": "npx prisma migrate deploy && next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

---

## Data Migration

### From In-Memory to Database

The old in-memory storage is completely replaced. To migrate existing data:

1. **Weekly Outlook articles**: Manually re-publish via `/admin/weekly-outlook`
2. **My War Rooms**: Users create new war rooms in the database

No manual migration script needed—the new API routes use Prisma directly.

---

## Database Schema

**Tables created:**

| Table | Purpose |
|-------|---------|
| `User` | User accounts and authentication |
| `MyWarRoom` | User's personal war rooms |
| `UserThesis` | Investment thesis per war room |
| `WatchItem` | Watching catalysts/risks per war room |
| `PersonalNote` | Private notes per war room |
| `WeeklyOutlook` | Published Substack articles |
| `UserEntitlement` | Premium tier & subscription info |
| `WaitlistSignup` | MY WAR ROOM waitlist |

---

## Prisma Commands

### View Database

```bash
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555 to view/edit data.

### Create Migration

After editing `schema.prisma`:

```bash
npx prisma migrate dev --name describe_change
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

**Warning**: This deletes all data.

### Generate Prisma Client

```bash
npx prisma generate
```

---

## Troubleshooting

### "Can't reach database server"

**Cause**: PostgreSQL not running or wrong connection string

**Fix**:
```bash
# Check if PostgreSQL is running
psql -U postgres
# Should connect successfully
```

### "Migration failed"

**Cause**: Conflicting schema

**Fix**:
```bash
# Reset (development only)
npx prisma migrate reset

# Or manually fix conflicts
npx prisma migrate resolve --rolled-back init
```

### "Prisma Client not generated"

**Fix**:
```bash
npx prisma generate
```

---

## Performance Tips

1. **Connection Pooling**: Use PgBouncer or Render's connection pooling
2. **Indexes**: Already configured in schema.prisma
3. **Query Optimization**: Use Prisma's `include` for related data

---

## Next Steps

1. Install Prisma locally
2. Create PostgreSQL database
3. Run migrations: `npx prisma migrate dev --name init`
4. Test locally
5. Deploy to Render with DATABASE_URL env var
6. Render will auto-run migrations on deployment

---

## API Key Fix (Bonus)

See LIVE_API_FIX.md for fixing missing API key issues.
