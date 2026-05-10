const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function testSimpleQuery() {
  try {
    console.log('Testing simple markers query...');
    const start = Date.now();
    
    const result = await pool.query(`
      SELECT id, lat, lon, phone, name, description, type, website, inn, organization_name, email, updated_at, reliability
      FROM markers
      LIMIT 10
    `);
    
    const end = Date.now();
    console.log(`✅ Markers query completed in ${end - start}ms, rows: ${result.rows.length}`);
    
    console.log('Testing simple construction_sites query...');
    const start2 = Date.now();
    
    const result2 = await pool.query(`
      SELECT id, lat, lon, order_number, responsible, duration, garbage_collection_supplier, is_completed, payment_method
      FROM construction_sites
      LIMIT 10
    `);
    
    const end2 = Date.now();
    console.log(`✅ Construction sites query completed in ${end2 - start2}ms, rows: ${result2.rows.length}`);
    
    console.log('Testing table sizes...');
    const markersCount = await pool.query('SELECT COUNT(*) as count FROM markers');
    const constructionCount = await pool.query('SELECT COUNT(*) as count FROM construction_sites');
    
    console.log(`📊 Markers count: ${markersCount.rows[0].count}`);
    console.log(`📊 Construction sites count: ${constructionCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

testSimpleQuery();
