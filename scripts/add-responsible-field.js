const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addResponsibleField() {
  try {
    await pool.query(`
      ALTER TABLE construction_sites
      ADD COLUMN IF NOT EXISTS responsible VARCHAR(255)
    `);

    console.log('✅ Added responsible column to construction_sites');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addResponsibleField();
