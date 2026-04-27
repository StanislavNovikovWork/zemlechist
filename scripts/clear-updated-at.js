const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function clearUpdatedAt() {
  try {
    // Clear updated_at column for all markers
    await pool.query(
      `UPDATE markers 
       SET updated_at = NULL`
    );

    console.log('✅ Cleared updated_at column for all markers');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

clearUpdatedAt();
