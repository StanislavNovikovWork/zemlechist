const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addOrganizationNameColumn() {
  try {
    // Add organization_name column to markers table
    await pool.query(
      `ALTER TABLE markers 
       ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255)`
    );

    console.log('✅ Added organization_name column to markers table');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addOrganizationNameColumn();
