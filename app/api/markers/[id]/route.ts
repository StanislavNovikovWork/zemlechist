import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dayjs from 'dayjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid marker ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, coordinates, orderNumber, phone, name, description, website, inn, organizationName, email, updatedAt, reliability, responsible, paymentMethod, duration, garbageCollectionSupplier, zones } = body;
    // Строительная площадка — обновляем в отдельной таблице
    if (type === 'constructionSite') {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (coordinates) {
        const [lon, lat] = coordinates;
        updates.push(`lat = $${paramIndex++}`);
        values.push(lat);
        updates.push(`lon = $${paramIndex++}`);
        values.push(lon);
      }

      if (orderNumber !== undefined) {
        updates.push(`order_number = $${paramIndex++}`);
        values.push(orderNumber);
      }

      // Проверяем, существуют ли поля responsible, payment_method, duration, garbage_collection_supplier и zones
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'construction_sites' AND column_name IN ('responsible', 'payment_method', 'duration', 'duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end', 'garbage_collection_supplier', 'zones')
      `);
      
      const hasResponsibleField = tableInfo.rows.some(row => row.column_name === 'responsible');
      const hasPaymentMethodField = tableInfo.rows.some(row => row.column_name === 'payment_method');
      const hasDurationField = tableInfo.rows.some(row => row.column_name === 'duration');
      const hasNewDurationFields = tableInfo.rows.some(row => 
        ['duration_period1_start', 'duration_period1_end', 'duration_period2_start', 'duration_period2_end'].includes(row.column_name)
      );
      const hasGarbageCollectionSupplierField = tableInfo.rows.some(row => row.column_name === 'garbage_collection_supplier');
      const hasZonesField = tableInfo.rows.some(row => row.column_name === 'zones');

      if (responsible !== undefined && hasResponsibleField) {
        updates.push(`responsible = $${paramIndex++}`);
        values.push(responsible);
      }

      if (paymentMethod !== undefined && hasPaymentMethodField) {
        updates.push(`payment_method = $${paramIndex++}`);
        values.push(paymentMethod);
      }

      // Обработка duration с поддержкой двух периодов
      if (duration !== undefined) {
        if (hasNewDurationFields && duration.period1) {
          // Конвертируем даты из DD.MM.YYYY в YYYY-MM-DD
          const convertDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split('.');
            return `${year}-${month}-${day}`;
          };
          
          updates.push(`duration_period1_start = $${paramIndex++}`);
          values.push(convertDate(duration.period1[0]));
          updates.push(`duration_period1_end = $${paramIndex++}`);
          values.push(convertDate(duration.period1[1]));
          
          if (duration.period2) {
            updates.push(`duration_period2_start = $${paramIndex++}`);
            values.push(convertDate(duration.period2[0]));
            updates.push(`duration_period2_end = $${paramIndex++}`);
            values.push(convertDate(duration.period2[1]));
          } else {
            // Очищаем второй период если он был
            updates.push(`duration_period2_start = NULL`);
            updates.push(`duration_period2_end = NULL`);
          }
        } else if (hasDurationField) {
          updates.push(`duration = $${paramIndex++}`);
          values.push(duration);
        }
      }

      if (garbageCollectionSupplier !== undefined && hasGarbageCollectionSupplierField) {
        updates.push(`garbage_collection_supplier = $${paramIndex++}`);
        values.push(garbageCollectionSupplier);
      }

      if (zones !== undefined && hasZonesField) {
        updates.push(`zones = $${paramIndex++}`);
        values.push(zones);
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { error: 'No fields to update' },
          { status: 400 }
        );
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE construction_sites
         SET ${updates.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Construction site not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    // Остальные типы — обновляем в markers
    let dbUpdatedAt = null;
    if (updatedAt) {
      const [day, month, year] = updatedAt.split('.');
      dbUpdatedAt = `${year}-${month}-${day}`;
    }

    // Проверяем наличие полей payment_method и zones в таблице markers
    const paymentMethodInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'markers' AND column_name IN ('payment_method', 'zones')
    `);
    
    const hasPaymentMethodField = paymentMethodInfo.rows.some(row => row.column_name === 'payment_method');
    const hasZonesField = paymentMethodInfo.rows.some(row => row.column_name === 'zones');

    // Строим запрос динамически в зависимости от наличия полей
    let updateQuery = `
      UPDATE markers
      SET phone = COALESCE($1, phone),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          website = COALESCE($4, website),
          inn = COALESCE($5, inn),
          organization_name = COALESCE($6, organization_name),
          email = COALESCE($7, email),
          updated_at = COALESCE($8, updated_at),
          reliability = COALESCE($9, reliability)
          ${hasPaymentMethodField ? ', payment_method = COALESCE($10, payment_method)' : ''}
          ${hasZonesField ? (hasPaymentMethodField ? ', zones = COALESCE($11, zones)' : ', zones = COALESCE($10, zones)') : ''}
      WHERE id = $${hasPaymentMethodField && hasZonesField ? '12' : (hasPaymentMethodField || hasZonesField ? '11' : '10')}
      RETURNING *`;
    
    const queryParams = [phone, name, description, website, inn, organizationName, email, dbUpdatedAt, reliability];
    if (hasPaymentMethodField) {
      queryParams.push(paymentMethod);
    }
    if (hasZonesField) {
      queryParams.push(zones);
    }
    queryParams.push(id);

    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Marker not found' },
        { status: 404 }
      );
    }

    const updatedMarker = result.rows[0];
    if (updatedMarker.updated_at) {
      // Конвертируем дату из YYYY-MM-DD в DD.MM.YYYY
      const date = new Date(updatedMarker.updated_at);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      updatedMarker.updated_at = `${day}.${month}.${year}`;
    }

    return NextResponse.json(updatedMarker);
  } catch (error) {
    console.error('Error updating marker:', error);
    return NextResponse.json(
      { error: 'Failed to update marker', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid marker ID' },
        { status: 400 }
      );
    }

    // Сначала проверяем в construction_sites
    let result = await pool.query(
      `DELETE FROM construction_sites WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Если не нашли, проверяем в markers
    result = await pool.query(
      `DELETE FROM markers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Marker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting marker:', error);
    return NextResponse.json(
      { error: 'Failed to delete marker', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
