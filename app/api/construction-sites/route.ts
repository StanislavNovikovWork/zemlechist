import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, lat, lon, order_number, created_at, updated_at
       FROM construction_sites
       ORDER BY id`
    );

    const features = result.rows.map((row) => ({
      type: 'Feature',
      id: row.id,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.lon), parseFloat(row.lat)],
      },
      properties: {
        type: 'constructionSite',
        name: row.order_number ? `Заказ ${row.order_number}` : `Строй площадка #${row.id}`,
        orderNumber: row.order_number,
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error('Error fetching construction sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch construction sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coordinates, orderNumber } = body;

    const [lon, lat] = coordinates;

    const result = await pool.query(
      `INSERT INTO construction_sites (lat, lon, order_number)
       VALUES ($1, $2, $3)
       RETURNING id, lat, lon, order_number, created_at, updated_at`,
      [lat, lon, orderNumber || null]
    );

    const created = result.rows[0];

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating construction site:', error);
    return NextResponse.json(
      { error: 'Failed to create construction site', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
