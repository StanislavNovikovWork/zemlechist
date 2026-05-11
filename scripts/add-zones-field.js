const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addZonesField() {
  try {
    // Добавляем поле в таблицу suppliers
    await pool.query(`
      ALTER TABLE suppliers
      ADD COLUMN IF NOT EXISTS zones TEXT[]
    `);

    // Добавляем поле в таблицу markers
    await pool.query(`
      ALTER TABLE markers
      ADD COLUMN IF NOT EXISTS zones TEXT[]
    `);

    console.log('✅ Added zones column to suppliers and markers tables');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addZonesField();
