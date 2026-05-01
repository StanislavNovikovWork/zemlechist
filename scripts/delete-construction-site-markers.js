const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function deleteConstructionSiteMarkers() {
  try {
    const deleteResult = await pool.query(`
      DELETE FROM markers
      WHERE type = 'constructionSite'
      RETURNING id, lat, lon, type, name, phone
    `);

    console.log('Удалено маркеров с типом constructionSite:', deleteResult.rows.length);
    console.log('Удалены:', deleteResult.rows);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

deleteConstructionSiteMarkers();
