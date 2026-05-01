const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function deleteConstructionSitesWithoutOrder() {
  try {
    // Сначала покажем, что собираемся удалить
    const checkResult = await pool.query(`
      SELECT id, lat, lon, order_number
      FROM construction_sites
      WHERE order_number IS NULL
    `);
    
    console.log('Найдено строй площадок без заказа:', checkResult.rows);
    console.log('Количество:', checkResult.rows.length);

    if (checkResult.rows.length === 0) {
      console.log('Нечего удалять');
      return;
    }

    // Удаляем
    const deleteResult = await pool.query(`
      DELETE FROM construction_sites
      WHERE order_number IS NULL
      RETURNING id, lat, lon, order_number
    `);

    console.log('Удалено строй площадок:', deleteResult.rows.length);
    console.log('Удалены:', deleteResult.rows);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

deleteConstructionSitesWithoutOrder();
