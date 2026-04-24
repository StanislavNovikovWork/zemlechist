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
        { error: 'Invalid marker ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { phone, name, description } = body;

    const result = await pool.query(
      `UPDATE markers
       SET phone = COALESCE($1, phone),
           name = COALESCE($2, name),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [phone, name, description, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Marker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating marker:', error);
    return NextResponse.json(
      { error: 'Failed to update marker', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
