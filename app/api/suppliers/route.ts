import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, company, product_category, phone, website, reliability, description, created_at, updated_at
       FROM suppliers
       ORDER BY id`
    );

    const suppliers = result.rows.map((row) => ({
      id: row.id,
      company: row.company,
      productCategory: row.product_category,
      phone: row.phone,
      website: row.website,
      reliability: row.reliability,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, productCategory, phone, website, reliability, description } = body;

    const result = await pool.query(
      `INSERT INTO suppliers (company, product_category, phone, website, reliability, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, company, product_category, phone, website, reliability, description, created_at, updated_at`,
      [company, productCategory, phone, website, reliability || 3, description]
    );

    const createdSupplier = result.rows[0];

    const supplier = {
      id: createdSupplier.id,
      company: createdSupplier.company,
      productCategory: createdSupplier.product_category,
      phone: createdSupplier.phone,
      website: createdSupplier.website,
      reliability: createdSupplier.reliability,
      description: createdSupplier.description,
      createdAt: createdSupplier.created_at,
      updatedAt: createdSupplier.updated_at,
    };

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
