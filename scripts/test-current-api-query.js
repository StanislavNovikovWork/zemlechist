const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function testCurrentAPIQuery() {
  try {
    console.log('Testing current API query...');
    const start = Date.now();
    
    const markersFields = `id, lat, lon, phone, name, description, type, website, inn, organization_name, email, updated_at, reliability, NULL as order_number, NULL as responsible, NULL as duration, NULL as duration_period1_start, NULL as duration_period1_end, NULL as duration_period2_start, NULL as duration_period2_end, NULL as garbage_collection_supplier, NULL as is_completed, NULL as payment_method`;
    const constructionFields = `id, lat, lon, NULL as phone, NULL as name, NULL as description, 'constructionSite' as type, NULL as website, NULL as inn, NULL as organization_name, NULL as email, NULL as updated_at, NULL as reliability, order_number, responsible, duration, duration_period1_start, duration_period1_end, duration_period2_start, duration_period2_end, garbage_collection_supplier, is_completed, payment_method`;
    
    const query = `
      SELECT ${markersFields}
      FROM markers
      UNION ALL
      SELECT ${constructionFields}
      FROM construction_sites
      ORDER BY id
    `;
    
    console.log('Executing query...');
    const result = await pool.query(query);
    
    const end = Date.now();
    console.log(`✅ Query completed in ${end - start}ms, total rows: ${result.rows.length}`);
    
    // Test without ORDER BY
    console.log('Testing without ORDER BY...');
    const start2 = Date.now();
    
    const query2 = `
      SELECT ${markersFields}
      FROM markers
      UNION ALL
      SELECT ${constructionFields}
      FROM construction_sites
    `;
    
    const result2 = await pool.query(query2);
    const end2 = Date.now();
    console.log(`✅ Query without ORDER BY completed in ${end2 - start2}ms, rows: ${result2.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

testCurrentAPIQuery();
