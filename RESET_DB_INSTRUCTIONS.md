# Fixing UUID idType Migration Issue

## Problem

When switching from `idType: 'serial'` to `idType: 'uuid'` in Payload CMS, the database schema still has integer ID columns, but Payload expects UUID columns. This causes errors when trying to access collections in the admin panel.

## Solution

You need to drop all Payload tables and let Payload recreate them with UUID columns.

### Option 1: Using SQL File (Recommended)

1. **Run the SQL script** using your database client or psql:

   ```bash
   psql $POSTGRES_URL -f reset-db-schema.sql
   ```

   Or if you're using a database GUI (like pgAdmin, DBeaver, etc.), open `reset-db-schema.sql` and run it.

2. **Regenerate types**:

   ```bash
   pnpm generate:types
   ```

3. **Restart your dev server**:

   ```bash
   pnpm dev
   ```

4. **Create your first user again** at `/admin`

### Option 2: Using Node Script (Recommended - Finds All Tables)

1. **Install pg package** (if not already installed):

   ```bash
   pnpm add pg
   ```

2. **Run the comprehensive reset script** (automatically finds all Payload tables):

   ```bash
   node reset-db-complete.js
   ```

   Or use the basic script:

   ```bash
   node reset-db.js
   ```

3. **Follow the instructions** printed by the script (regenerate types, restart server, etc.)

## What This Does

- Drops all Payload CMS tables (users, media, family, and internal Payload tables)
- When you restart the server, Payload will automatically recreate all tables with UUID `id` columns
- Your data will be deleted, so make sure you've backed up anything important

## After Reset

Once the tables are recreated:

- All `id` columns will be UUID type
- Payload will work correctly with `idType: 'uuid'`
- You'll need to create your first user again
- The admin panel should work without errors
