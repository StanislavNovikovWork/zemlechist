const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function removeOldSupplierFields() {
  try {
    // Удаляем колонку suppliers если она существует
    await pool.query(`
      ALTER TABLE construction_sites
      DROP COLUMN IF EXISTS suppliers
    `);

    console.log('✅ Removed suppliers column from construction_sites');

    // Удаляем колонку linked_suppliers если она существует
    await pool.query(`
      ALTER TABLE construction_sites
      DROP COLUMN IF EXISTS linked_suppliers
    `);

    console.log('✅ Removed linked_suppliers column from construction_sites');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

removeOldSupplierFields();
