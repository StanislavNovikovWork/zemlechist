const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const connectionString = envMatch ? envMatch[1] : process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function alterColumn() {
  try {
    await pool.query(`
      ALTER TABLE construction_sites
      ALTER COLUMN garbage_collection_supplier TYPE TEXT
    `);
    console.log('✅ Altered garbage_collection_supplier column to TEXT');
  } catch (error) {
    console.error('❌ Error altering column:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

alterColumn();
