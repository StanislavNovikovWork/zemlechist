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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, coordinates, phone, name, description } = body;

    console.log('Received data:', { type, coordinates, phone, name, description });

    // Парсим координаты из массива [долгота, широта]
    const [lon, lat] = coordinates;

    // Определяем iconCaption и markerColor на основе типа
    const iconCaption = type === 'specialTechnique' ? 'Спецтехника' : 'Вывоз мусора';
    const markerColor = '#3BB300';

    const result = await pool.query(
      `INSERT INTO markers (lat, lon, phone, name, description, "iconCaption", "marker_color", type, "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type`,
      [lat, lon, phone, name, description, iconCaption, markerColor, type]
    );

    const createdMarker = result.rows[0];

    return NextResponse.json(createdMarker, { status: 201 });
  } catch (error) {
    console.error('Error creating marker:', error);
    return NextResponse.json(
      { error: 'Failed to create marker', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
