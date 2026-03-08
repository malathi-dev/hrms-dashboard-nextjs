import dbPromise from '../../../lib/db';

export async function GET() {
  const db = await dbPromise;
  const rows = await db.all('SELECT * FROM departments');
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const { name } = await request.json();
  const db = await dbPromise;
  const result = await db.run(
    `INSERT INTO departments (name) VALUES (?)`,
    name
  );
  return new Response(JSON.stringify({ id: result.lastID }), { status: 201 });
}
