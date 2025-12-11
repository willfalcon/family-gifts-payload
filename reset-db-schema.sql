-- SQL script to drop all Payload CMS tables
-- This will allow Payload to recreate them with UUID idType
-- WARNING: This will delete all data in these tables!

-- Drop all Payload-related tables (including junction tables)
-- Using CASCADE to handle dependencies automatically

-- Drop junction/relationship tables first
DROP TABLE IF EXISTS "payload_relationships" CASCADE;
DROP TABLE IF EXISTS "users_roles" CASCADE;
DROP TABLE IF EXISTS "users_sessions" CASCADE;
DROP TABLE IF EXISTS "family_members" CASCADE;
DROP TABLE IF EXISTS "family_managers" CASCADE;

-- Drop main collection tables
DROP TABLE IF EXISTS "payload_preferences" CASCADE;
DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
DROP TABLE IF EXISTS "payload_kv" CASCADE;
DROP TABLE IF EXISTS "payload_migrations" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "media" CASCADE;
DROP TABLE IF EXISTS "family" CASCADE;

-- Drop any sequences that might have been created (for serial IDs)
DROP SEQUENCE IF EXISTS "users_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "media_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "family_id_seq" CASCADE;


