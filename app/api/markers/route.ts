import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dayjs from 'dayjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type, website, inn, organization_name, email, updated_at, reliability
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
        website: row.website,
        inn: row.inn,
        organizationName: row.organization_name,
        email: row.email,
        updatedAt: row.updated_at ? dayjs(row.updated_at).format('DD.MM.YYYY') : null,
        reliability: row.reliability,
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
    const { type, coordinates, phone, name, description, website, inn, organizationName, email, updatedAt, reliability } = body;

    // Парсим координаты из массива [долгота, широта]
    const [lon, lat] = coordinates;

    // Определяем iconCaption и markerColor на основе типа
    const iconCaption = type === 'specialTechnique' ? 'Спецтехника' : 'Вывоз мусора';
    const markerColor = '#3BB300';

    // Конвертируем дату из DD.MM.YYYY в формат для PostgreSQL
    let dbUpdatedAt = null;
    if (updatedAt) {
      const [day, month, year] = updatedAt.split('.');
      dbUpdatedAt = `${year}-${month}-${day}`;
    }

    const result = await pool.query(
      `INSERT INTO markers (lat, lon, phone, name, description, "iconCaption", "marker_color", type, website, inn, organization_name, email, updated_at, reliability)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type, website, inn, organization_name, email, updated_at, reliability`,
      [lat, lon, phone, name, description, iconCaption, markerColor, type, website, inn, organizationName, email, dbUpdatedAt, reliability]
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
