import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dayjs from 'dayjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Проверяем наличие полей в таблицах
    const responsibleInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'construction_sites' AND column_name = 'responsible'
    `);
    
    const hasResponsibleField = responsibleInfo.rows.length > 0;

    const paymentMethodInfo = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name = 'payment_method' AND table_name IN ('markers', 'construction_sites')
    `);
    
    const hasPaymentMethodInMarkers = paymentMethodInfo.rows.some(row => row.table_name === 'markers');
    const hasPaymentMethodInConstructionSites = paymentMethodInfo.rows.some(row => row.table_name === 'construction_sites');

    // Строим запрос с payment_method для каждой таблицы отдельно
    let query = `
      SELECT id, lat, lon, phone, name, description, "iconCaption" as "iconCaption", "marker_color" as "markerColor", type, website, inn, organization_name, email, updated_at, reliability, NULL as order_number, NULL as responsible${hasPaymentMethodInMarkers ? ', payment_method' : ', NULL as payment_method'}
      FROM markers
      UNION ALL
      SELECT id, lat, lon, NULL as phone, NULL as name, NULL as description, NULL as "iconCaption", NULL as "markerColor", 'constructionSite' as type, NULL as website, NULL as inn, NULL as organization_name, NULL as email, NULL as updated_at, NULL as reliability, order_number, ${hasResponsibleField ? 'responsible' : 'NULL as responsible'}${hasPaymentMethodInConstructionSites ? ', payment_method' : ', NULL as payment_method'}
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
          paymentMethod: row.payment_method,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lon, phone, name, description, iconCaption, markerColor, type, website, inn, organizationName, email, reliability, orderNumber, responsible, paymentMethod } = body;

    if (type === 'constructionSite') {
      // Проверяем наличие полей в таблице construction_sites
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'construction_sites' AND column_name IN ('responsible', 'payment_method')
      `);
      
      const hasResponsibleField = tableInfo.rows.some(row => row.column_name === 'responsible');
      const hasPaymentMethodField = tableInfo.rows.some(row => row.column_name === 'payment_method');

      let query = `
        INSERT INTO construction_sites (lat, lon, order_number${hasResponsibleField ? ', responsible' : ''}${hasPaymentMethodField ? ', payment_method' : ''})
        VALUES ($1, $2, $3${hasResponsibleField ? ', $4' : ''}${hasPaymentMethodField ? (hasResponsibleField ? ', $5' : ', $4') : ''})
        RETURNING id, lat, lon, order_number${hasResponsibleField ? ', responsible' : ''}${hasPaymentMethodField ? ', payment_method' : ''}, created_at, updated_at
      `;

      const params = [lat, lon, orderNumber];
      if (hasResponsibleField) params.push(responsible);
      if (hasPaymentMethodField) params.push(paymentMethod);

      const result = await pool.query(query, params);
      return NextResponse.json(result.rows[0]);
    } else {
      // Проверяем наличие поля payment_method в таблице markers
      const paymentMethodInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'markers' AND column_name = 'payment_method'
      `);
      
      const hasPaymentMethodField = paymentMethodInfo.rows.length > 0;

      let query = `
        INSERT INTO markers (lat, lon, phone, name, description, type, website, inn, organization_name, email, updated_at, reliability${hasPaymentMethodField ? ', payment_method' : ''})
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12${hasPaymentMethodField ? ', $13' : ''})
        RETURNING id, lat, lon, phone, name, description, type, website, inn, organization_name, email, updated_at, reliability${hasPaymentMethodField ? ', payment_method' : ''}
      `;

      const params = [lat, lon, phone, name, description, type, website, inn, organizationName, email, new Date().toISOString().split('T')[0], reliability];
      if (hasPaymentMethodField) params.push(paymentMethod);

      const result = await pool.query(query, params);
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error creating marker:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
