const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function reimportGarbageMarkers() {
  try {
    // Delete existing garbage markers
    const deleteResult = await pool.query(
      `DELETE FROM markers WHERE type = 'garbageCollection'`
    );
    console.log(`Deleted ${deleteResult.rowCount} existing garbage markers`);

    // Re-import using the updated script
    const { exec } = require('child_process');
    exec('node scripts/import-garbage-markers.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

reimportGarbageMarkers();
