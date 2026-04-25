const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mi1LVUKyos7E@ep-summer-paper-anz530kl.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function importGarbageMarkers() {
  try {
    // Read garbage-markers.json
    const markersPath = path.join(__dirname, '../constants/garbage-markers.json');
    const data = JSON.parse(fs.readFileSync(markersPath, 'utf8'));

    console.log(`Found ${data.features.length} garbage markers to import`);

    // Import each marker using direct SQL
    for (const feature of data.features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;

      // Extract phone from description
      const phoneMatch = props.description?.match(/[\d\(\)\-\+ ]{10,}/);
      const phone = phoneMatch ? phoneMatch[0].trim() : null;

      await pool.query(
        `INSERT INTO markers (lat, lon, phone, name, description, "iconCaption", "marker_color", type, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          coords[1],
          coords[0],
          phone,
          props.iconCaption || null,
          props.description || null,
          props.iconCaption || null,
          props['marker-color'] || '#595959',
          'garbageCollection',
        ]
      );
    }

    console.log('✅ Successfully imported all garbage markers');
  } catch (error) {
    console.error('❌ Error importing garbage markers:', error);
  } finally {
    await pool.end();
  }
}

importGarbageMarkers();
