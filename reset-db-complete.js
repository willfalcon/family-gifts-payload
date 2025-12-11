/**
 * Comprehensive script to reset Payload database
 * This will find and drop ALL Payload-related tables
 * 
 * Usage: node reset-db-complete.js
 * 
 * WARNING: This will delete all data!
 */

import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

async function resetDatabase() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })
  
  const client = await pool.connect()
  
  try {
    console.log('Finding all Payload-related tables...\n')
    
    // Find all tables that match Payload patterns
    const tablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND (
        tablename LIKE 'payload_%' 
        OR tablename LIKE 'users%' 
        OR tablename LIKE 'media%' 
        OR tablename LIKE 'family%'
      )
      ORDER BY tablename;
    `
    
    const tablesResult = await client.query(tablesQuery)
    const tables = tablesResult.rows.map(row => row.tablename)
    
    if (tables.length === 0) {
      console.log('No Payload tables found. Database might already be clean.\n')
    } else {
      console.log(`Found ${tables.length} table(s) to drop:\n`)
      
      for (const table of tables) {
        try {
          await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
          console.log(`✓ Dropped table: ${table}`)
        } catch (error) {
          console.log(`⚠ Error dropping ${table}:`, error.message)
        }
      }
    }
    
    // Find and drop sequences
    console.log('\nFinding sequences...\n')
    const sequencesQuery = `
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
      AND (
        sequence_name LIKE '%_id_seq' 
        OR sequence_name LIKE 'payload_%'
      )
      ORDER BY sequence_name;
    `
    
    const sequencesResult = await client.query(sequencesQuery)
    const sequences = sequencesResult.rows.map(row => row.sequence_name)
    
    if (sequences.length > 0) {
      for (const sequence of sequences) {
        try {
          await client.query(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE`)
          console.log(`✓ Dropped sequence: ${sequence}`)
        } catch (error) {
          // Sequences might not exist, that's okay
        }
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
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

resetDatabase()

