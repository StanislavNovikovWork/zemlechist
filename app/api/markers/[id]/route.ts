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

    const { phone, name, description, website, inn, organization_name, email, updatedAt } = body;

    // Конвертируем дату из DD.MM.YYYY в формат для PostgreSQL
    let dbUpdatedAt = null;
    if (updatedAt) {
      const [day, month, year] = updatedAt.split('.');
      dbUpdatedAt = `${year}-${month}-${day}`;
    }

    const result = await pool.query(
      `UPDATE markers
       SET phone = COALESCE($1, phone),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           website = COALESCE($4, website),
           inn = COALESCE($5, inn),
           organization_name = COALESCE($6, organization_name),
           email = COALESCE($7, email),
           updated_at = COALESCE($8, updated_at)
       WHERE id = $9
       RETURNING *`,
      [phone, name, description, website, inn, organization_name, email, dbUpdatedAt, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Marker not found' },
        { status: 404 }
      );
    }

    const updatedMarker = result.rows[0];
    // Конвертируем дату из формата PostgreSQL в DD.MM.YYYY для фронтенда
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

    const result = await pool.query(
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
