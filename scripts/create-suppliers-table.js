const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function createSuppliersTable() {
  try {
    // Создаем таблицу suppliers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        product_category VARCHAR(255),
        phone VARCHAR(50) NOT NULL,
        website VARCHAR(500),
        reliability INTEGER DEFAULT 3 CHECK (reliability >= 1 AND reliability <= 5),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Created suppliers table');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

createSuppliersTable();
