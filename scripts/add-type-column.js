const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addTypeColumn() {
  try {
    // Add type column to markers table
    await pool.query(
      `ALTER TABLE markers 
       ADD COLUMN IF NOT EXISTS type VARCHAR(50)`
    );

    console.log('✅ Added type column to markers table');

    // Update all existing markers to have type 'specialTechnique'
    const result = await pool.query(
      `UPDATE markers 
       SET type = 'specialTechnique' 
       WHERE type IS NULL`
    );

    console.log(`✅ Updated ${result.rowCount} markers with type 'specialTechnique'`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addTypeColumn();
