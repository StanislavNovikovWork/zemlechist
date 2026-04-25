const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importMarkers() {
  try {
    // Read markers.json
    const markersPath = path.join(__dirname, '../constants/markers.json');
    const data = JSON.parse(fs.readFileSync(markersPath, 'utf8'));

    console.log(`Found ${data.features.length} markers to import`);

    // Import each marker using direct SQL
    for (const feature of data.features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;

      await pool.query(
        `INSERT INTO markers (lat, lon, phone, name, description, "iconCaption", "marker_color", type, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          coords[1],
          coords[0],
          props.phone || null,
          props.name || null,
          props.description || null,
          props.iconCaption || null,
          props['marker-color'] || '#ffd21e',
          'specialTechnique',
        ]
      );
    }

    console.log('✅ Successfully imported all markers');
  } catch (error) {
    console.error('❌ Error importing markers:', error);
  } finally {
    await pool.end();
  }
}

importMarkers();
