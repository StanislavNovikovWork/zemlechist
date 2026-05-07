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
    
    const durationInfo = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name IN ('duration', 'duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end') 
      AND table_name IN ('markers', 'construction_sites')
    `);
    
    const hasPaymentMethodInMarkers = paymentMethodInfo.rows.some(row => row.table_name === 'markers');
    const hasPaymentMethodInConstructionSites = paymentMethodInfo.rows.some(row => row.table_name === 'construction_sites');
    const hasDurationInConstructionSites = durationInfo.rows.some(row => row.table_name === 'construction_sites');
    const hasNewDurationFields = durationInfo.rows.some(row => 
      ['duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end'].includes(row.column_name)
    );

    // Строим запрос с payment_method и duration для каждой таблицы отдельно
    let markersFields = `id, lat, lon, phone, name, description, type, website, inn, organization_name, email, updated_at, reliability, NULL as order_number, NULL as responsible, NULL as duration, NULL as duration_period1_start, NULL as duration_period1_end, NULL as duration_period2_start, NULL as duration_period2_end`;
    let constructionFields = `id, lat, lon, NULL as phone, NULL as name, NULL as description, 'constructionSite' as type, NULL as website, NULL as inn, NULL as organization_name, NULL as email, NULL as updated_at, NULL as reliability, order_number`;
    
    if (hasResponsibleField) {
      constructionFields += ', responsible';
    } else {
      constructionFields += ', NULL as responsible';
    }
    
    if (hasDurationInConstructionSites) {
      constructionFields += ', duration';
    } else {
      constructionFields += ', NULL as duration';
    }
    
    if (hasNewDurationFields) {
      constructionFields += ', duration_period1_start, duration_period1_end, duration_period2_start, duration_period2_end';
    } else {
      constructionFields += ', NULL as duration_period1_start, NULL as duration_period1_end, NULL as duration_period2_start, NULL as duration_period2_end';
    }
    
    if (hasPaymentMethodInConstructionSites) {
      constructionFields += ', payment_method';
    } else {
      constructionFields += ', NULL as payment_method';
    }
    
    if (hasPaymentMethodInMarkers) {
      markersFields += ', payment_method';
    } else {
      markersFields += ', NULL as payment_method';
    }
    
    let query = `
      SELECT ${markersFields}
      FROM markers
      UNION ALL
      SELECT ${constructionFields}
      FROM construction_sites
      ORDER BY id
    `;
    
    const result = await pool.query(query);

    // Convert to GeoJSON format
    const features = result.rows.map((row) => {
      const isConstructionSite = row.type === 'constructionSite';
      
      // Формируем duration в новом формате
      let duration: { period1: [string, string]; period2?: [string, string] } | undefined = undefined;
      if (isConstructionSite) {
        if (row.duration_period1_start && row.duration_period1_end) {
          duration = {
            period1: [
              dayjs(row.duration_period1_start).format('DD.MM.YYYY'),
              dayjs(row.duration_period1_end).format('DD.MM.YYYY')
            ]
          };
          
          if (row.duration_period2_start && row.duration_period2_end) {
            duration.period2 = [
              dayjs(row.duration_period2_start).format('DD.MM.YYYY'),
              dayjs(row.duration_period2_end).format('DD.MM.YYYY')
            ];
          }
        } else if (row.duration && typeof row.duration === 'string') {
          // Обратная совместимость со старым форматом
          duration = {
            period1: [
              row.duration.substring(0, 10),
              row.duration.substring(12, 22)
            ]
          };
        }
      }
      
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
          duration,
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
    console.log('POST /api/markers called');
    const body = await request.json();
    console.log('POST /api/markers body parsed:', body);
    const { lat, lon, phone, name, description, markerColor, type, website, inn, organizationName, email, reliability, orderNumber, responsible, paymentMethod, duration } = body;
    
    
    if (type === 'constructionSite') {
      console.log('Processing construction site creation...');
      // Получаем максимальный ID из обеих таблиц для гарантии уникальности
      const maxIdResult = await pool.query(`
        SELECT GREATEST(
          COALESCE((SELECT MAX(id) FROM markers), 0),
          COALESCE((SELECT MAX(id) FROM construction_sites), 0)
        ) as max_id
      `);
      const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

      // Проверяем наличие полей в таблице construction_sites
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'construction_sites' AND column_name IN ('responsible', 'payment_method', 'duration', 'duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end')
      `);
      
      const hasResponsibleField = tableInfo.rows.some(row => row.column_name === 'responsible');
      const hasPaymentMethodField = tableInfo.rows.some(row => row.column_name === 'payment_method');
      const hasDurationField = tableInfo.rows.some(row => row.column_name === 'duration');
      const hasNewDurationFields = tableInfo.rows.some(row => 
        ['duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end'].includes(row.column_name)
      );

      // Строим запрос более простым способом
      let fields = 'id, lat, lon, order_number';
      let placeholders = '$1, $2, $3, $4';
      let returnFields = 'id, lat, lon, order_number';
      let params = [nextId, lat, lon, orderNumber];
      let paramIndex = 5;
      
      if (hasResponsibleField) {
        fields += ', responsible';
        placeholders += `, $${paramIndex}`;
        returnFields += ', responsible';
        params.push(responsible);
        paramIndex++;
      }
      
      if (hasPaymentMethodField) {
        fields += ', payment_method';
        placeholders += `, $${paramIndex}`;
        returnFields += ', payment_method';
        params.push(paymentMethod);
        paramIndex++;
      }
      
      // Добавляем поля duration
      if (hasNewDurationFields && duration && duration.period1) {
        fields += ', duration_period1_start, duration_period1_end';
        placeholders += `, $${paramIndex}, $${paramIndex + 1}`;
        returnFields += ', duration_period1_start, duration_period1_end';
        
        // Конвертируем даты из DD.MM.YYYY в YYYY-MM-DD
        const convertDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split('.');
          return `${year}-${month}-${day}`;
        };
        
        params.push(convertDate(duration.period1[0]), convertDate(duration.period1[1]));
        paramIndex += 2;
        
        if (duration.period2) {
          fields += ', duration_period2_start, duration_period2_end';
          placeholders += `, $${paramIndex}, $${paramIndex + 1}`;
          returnFields += ', duration_period2_start, duration_period2_end';
          params.push(convertDate(duration.period2[0]), convertDate(duration.period2[1]));
          paramIndex += 2;
        }
      } else if (hasDurationField && duration) {
        fields += ', duration';
        placeholders += `, $${paramIndex}`;
        returnFields += ', duration';
        params.push(duration);
        paramIndex++;
      }
      
      let query = `
        INSERT INTO construction_sites (${fields})
        VALUES (${placeholders})
        RETURNING ${returnFields}, created_at, updated_at
      `;

      console.log('Construction Site SQL Query:', query);
      console.log('Construction Site SQL Params:', params);
      
      const result = await pool.query(query, params);
      console.log('Construction Site Insert result:', result.rows[0]);
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
