import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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
        { error: 'Invalid construction site ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { coordinates, orderNumber } = body;

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
  } catch (error) {
    console.error('Error updating construction site:', error);
    return NextResponse.json(
      { error: 'Failed to update construction site', details: error instanceof Error ? error.message : String(error) },
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
        { error: 'Invalid construction site ID' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM construction_sites WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Construction site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting construction site:', error);
    return NextResponse.json(
      { error: 'Failed to delete construction site', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
