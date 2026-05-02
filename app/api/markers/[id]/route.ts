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
    const { type, coordinates, orderNumber, phone, name, description, website, inn, organizationName, email, updatedAt, reliability, responsible, paymentMethod } = body;

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

      // Проверяем, существуют ли поля responsible и payment_method
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'construction_sites' AND column_name IN ('responsible', 'payment_method')
      `);
      
      const hasResponsibleField = tableInfo.rows.some(row => row.column_name === 'responsible');
      const hasPaymentMethodField = tableInfo.rows.some(row => row.column_name === 'payment_method');

      if (responsible !== undefined && hasResponsibleField) {
        updates.push(`responsible = $${paramIndex++}`);
        values.push(responsible);
      }

      if (paymentMethod !== undefined && hasPaymentMethodField) {
        updates.push(`payment_method = $${paramIndex++}`);
        values.push(paymentMethod);
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

    // Проверяем наличие поля payment_method в таблице markers
    const paymentMethodInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'markers' AND column_name = 'payment_method'
    `);
    
    const hasPaymentMethodField = paymentMethodInfo.rows.length > 0;

    // Строим запрос динамически в зависимости от наличия поля
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
      WHERE id = $${hasPaymentMethodField ? '11' : '10'}
      RETURNING *`;
    
    const queryParams = [phone, name, description, website, inn, organizationName, email, dbUpdatedAt, reliability];
    if (hasPaymentMethodField) {
      queryParams.push(paymentMethod);
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
      updatedMarker.updated_at = dayjs(updatedMarker.updated_at).format('DD.MM.YYYY');
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
