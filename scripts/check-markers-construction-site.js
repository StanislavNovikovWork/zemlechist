const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function checkMarkers() {
  try {
    const result = await pool.query(`
      SELECT id, lat, lon, type, name, phone
      FROM markers
      WHERE type = 'constructionSite'
    `);
    
    console.log('Найдено маркеров с типом constructionSite в таблице markers:', result.rows);
    console.log('Количество:', result.rows.length);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkMarkers();
