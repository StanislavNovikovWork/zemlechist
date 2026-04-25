import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type
       FROM markers
       ORDER BY id`
    );

    // Convert to GeoJSON format
    const features = result.rows.map((row) => ({
      type: 'Feature',
      id: row.id,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.lon), parseFloat(row.lat)],
      },
      properties: {
        phone: row.phone,
        name: row.name,
        description: row.description,
        iconCaption: row.iconCaption,
        'marker-color': row.markerColor,
        type: row.type,
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error('Error fetching markers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markers' },
      { status: 500 }
    );
  }
}
