const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function addDurationPeriods() {
  try {
    console.log('Проверяем текущую структуру таблицы construction_sites...');
    
    // Проверяем, существуют ли уже новые поля
    const existingColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'construction_sites' 
      AND column_name IN ('duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end')
    `);
    
    const existingColumnNames = existingColumns.rows.map(row => row.column_name);
    
    if (existingColumnNames.includes('duration_period1_start')) {
      console.log('Новые поля уже существуют. Пропускаем миграцию.');
      return;
    }
    
    console.log('Добавляем новые поля для двух периодов duration...');
    
    // Добавляем новые поля
    await pool.query(`
      ALTER TABLE construction_sites 
      ADD COLUMN duration_period1_start DATE,
      ADD COLUMN duration_period1_end DATE,
      ADD COLUMN duration_period2_start DATE,
      ADD COLUMN duration_period2_end DATE
    `);
    
    console.log('Новые поля успешно добавлены.');
    
    // Мигрируем существующие данные из старого поля duration
    console.log('Мигрируем существующие данные...');
    
    const migrationResult = await pool.query(`
      UPDATE construction_sites 
      SET 
        duration_period1_start = SUBSTRING(duration FROM 1 FOR 10),
        duration_period1_end = SUBSTRING(duration FROM 12 FOR 10)
      WHERE duration IS NOT NULL 
      AND duration ~ '\d{2}\.\d{2}\.\d{4}'
      AND LENGTH(duration) >= 21
    `);
    
    console.log(`Смигрировано ${migrationResult.rowCount} записей.`);
    
    console.log('Миграция завершена успешно!');
    
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
  } finally {
    await pool.end();
  }
}

addDurationPeriods();
