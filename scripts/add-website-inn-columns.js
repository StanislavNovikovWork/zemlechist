const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addWebsiteAndInnColumns() {
  try {
    // Add website column to markers table
    await pool.query(
      `ALTER TABLE markers 
       ADD COLUMN IF NOT EXISTS website VARCHAR(255)`
    );

    console.log('✅ Added website column to markers table');

    // Add inn column to markers table
    await pool.query(
      `ALTER TABLE markers 
       ADD COLUMN IF NOT EXISTS inn VARCHAR(20)`
    );

    console.log('✅ Added inn column to markers table');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addWebsiteAndInnColumns();
