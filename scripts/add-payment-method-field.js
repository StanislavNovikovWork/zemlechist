const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addPaymentMethodField() {
  try {
    // Добавляем поле в таблицу suppliers
    await pool.query(`
      ALTER TABLE suppliers
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20)
    `);

    // Добавляем поле в таблицу construction_sites
    await pool.query(`
      ALTER TABLE construction_sites
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20)
    `);

    console.log('✅ Added payment_method column to suppliers and construction_sites tables');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addPaymentMethodField();
