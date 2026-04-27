const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function checkUpdatedAt() {
  try {
    const result = await pool.query(
      `SELECT id, name, updated_at FROM markers ORDER BY id DESC LIMIT 5`
    );

    console.log('Last 5 markers:');
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Updated at: ${row.updated_at}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkUpdatedAt();
