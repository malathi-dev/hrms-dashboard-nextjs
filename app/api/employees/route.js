import dbPromise from "../../../lib/db";

export async function GET(request) {
  const db = await dbPromise;
  const rows = await db.all('SELECT * FROM employees');
  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const { name, email, phone, position, salary, department, join_date } = await request.json();
  const db = await dbPromise;
  const result = await db.run(
    `INSERT INTO employees (name,email,phone,position,salary,department,join_date) VALUES (?,?,?,?,?,?,?)`,
    name,
    email,
    phone,
    position,
    salary,
    department,
    join_date
  );
  return new Response(JSON.stringify({ id: result.lastID }), { status: 201 });
}
