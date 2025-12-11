/**
 * Script to reset Payload database tables
 * This will drop all Payload tables so they can be recreated with UUID idType
 * 
 * Usage: node reset-db.js
 * 
 * WARNING: This will delete all data!
 * 
 * Alternative: You can also run the SQL directly using psql or your database client:
 * psql $POSTGRES_URL -f reset-db-schema.sql
 */

// Using pg package - install with: pnpm add pg
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const tablesToDrop = [
  // Junction/relationship tables first
  'payload_relationships',
  'users_roles',
  'users_sessions',
  'family_members',
  'family_managers',
  // Main collection tables
  'payload_preferences',
  'payload_locked_documents',
  'payload_kv',
  'payload_migrations',
  'users',
  'media',
  'family',
]

// Also drop sequences that might exist from serial IDs
const sequencesToDrop = [
  'users_id_seq',
  'media_id_seq',
  'family_id_seq',
]

async function resetDatabase() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set')
    process.exit(1)
  }

  const { Pool } = pg
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })
  
  const client = await pool.connect()
  
  try {
    console.log('Dropping Payload tables...\n')
    
    // Drop tables
    for (const table of tablesToDrop) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
        console.log(`✓ Dropped table: ${table}`)
      } catch (error) {
        console.log(`⚠ Error dropping ${table}:`, error.message)
      }
    }
    
    // Drop sequences (from old serial IDs)
    for (const sequence of sequencesToDrop) {
      try {
        await client.query(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE`)
        console.log(`✓ Dropped sequence: ${sequence}`)
      } catch (error) {
        // Sequences might not exist, that's okay
      }
    }
    
    console.log('\n✅ Database reset complete!')
    console.log('\nNext steps:')
    console.log('1. Regenerate types: pnpm generate:types')
    console.log('2. Restart your dev server: pnpm dev')
    console.log('3. Payload will automatically recreate all tables with UUID idType')
    console.log('4. Create your first user again at /admin')
    
  } catch (error) {
    console.error('Error resetting database:', error)
    console.log('\n💡 Alternative: Run the SQL file directly:')
    console.log('   psql $POSTGRES_URL -f reset-db-schema.sql')
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

resetDatabase()

