import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dayjs from 'dayjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Сначала проверим, существует ли поле responsible
    const tableInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'construction_sites' AND column_name = 'responsible'
    `);
    
    const hasResponsibleField = tableInfo.rows.length > 0;
    
    // Строим запрос в зависимости от наличия поля
    const query = hasResponsibleField 
      ? `
        SELECT id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type, website, inn, organization_name, email, updated_at, reliability, NULL as order_number, NULL as responsible
        FROM markers
        UNION ALL
        SELECT id, lat, lon, NULL as phone, NULL as name, NULL as description, NULL as "iconCaption", NULL as "markerColor", 'constructionSite' as type, NULL as website, NULL as inn, NULL as organization_name, NULL as email, NULL as updated_at, NULL as reliability, order_number, responsible
        FROM construction_sites
        ORDER BY id
      `
      : `
        SELECT id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type, website, inn, organization_name, email, updated_at, reliability, NULL as order_number, NULL as responsible
        FROM markers
        UNION ALL
        SELECT id, lat, lon, NULL as phone, NULL as name, NULL as description, NULL as "iconCaption", NULL as "markerColor", 'constructionSite' as type, NULL as website, NULL as inn, NULL as organization_name, NULL as email, NULL as updated_at, NULL as reliability, order_number, NULL as responsible
        FROM construction_sites
        ORDER BY id
      `;
    
    const result = await pool.query(query);

    // Convert to GeoJSON format
    const features = result.rows.map((row) => {
      const isConstructionSite = row.type === 'constructionSite';
      return {
        type: 'Feature',
        id: row.id,
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(row.lon), parseFloat(row.lat)],
        },
        properties: {
          phone: row.phone,
          name: isConstructionSite
            ? (row.order_number ? `Заказ ${row.order_number}` : `Строй площадка #${row.id}`)
            : row.name,
          description: row.description,
          iconCaption: isConstructionSite ? 'Строительная площадка' : row.iconCaption,
          'marker-color': isConstructionSite ? '#3BB300' : row.markerColor,
          type: row.type,
          website: row.website,
          inn: row.inn,
          organizationName: row.organization_name,
          email: row.email,
          updatedAt: row.updated_at ? dayjs(row.updated_at).format('DD.MM.YYYY') : null,
          reliability: row.reliability,
          orderNumber: row.order_number,
          responsible: row.responsible,
        },
      };
    });

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
    const { type, coordinates, phone, name, description, website, inn, organizationName, email, updatedAt, reliability, orderNumber, responsible } = body;

    const [lon, lat] = coordinates;

    // Строительная площадка — сохраняем в отдельную таблицу
    if (type === 'constructionSite') {
      // Проверяем, существует ли поле responsible
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'construction_sites' AND column_name = 'responsible'
      `);
      
      const hasResponsibleField = tableInfo.rows.length > 0;
      
      let result;
      if (hasResponsibleField) {
        result = await pool.query(
          `INSERT INTO construction_sites (lat, lon, order_number, responsible)
           VALUES ($1, $2, $3, $4)
           RETURNING id, lat, lon, order_number, responsible, created_at, updated_at`,
          [lat, lon, orderNumber || null, responsible || null]
        );
      } else {
        result = await pool.query(
          `INSERT INTO construction_sites (lat, lon, order_number)
           VALUES ($1, $2, $3)
           RETURNING id, lat, lon, order_number, created_at, updated_at`,
          [lat, lon, orderNumber || null]
        );
      }
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // Остальные типы — сохраняем в markers
    const getIconCaption = (t: string) => {
      switch (t) {
        case 'specialTechnique':
          return 'Спецтехника';
        case 'garbageCollection':
        default:
          return 'Вывоз мусора';
      }
    };
    const iconCaption = getIconCaption(type);
    const markerColor = '#3BB300';

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

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating marker:', error);
    return NextResponse.json(
      { error: 'Failed to create marker', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
