const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addTypeToMarkers() {
  try {
    // Update all existing markers to have type 'specialTechnique'
    const result = await pool.query(
      `UPDATE markers 
       SET type = 'specialTechnique' 
       WHERE type IS NULL`
    );

    console.log(`✅ Updated ${result.rowCount} markers with type 'specialTechnique'`);
  } catch (error) {
    console.error('❌ Error updating markers:', error);
  } finally {
    await pool.end();
  }
}

addTypeToMarkers();
