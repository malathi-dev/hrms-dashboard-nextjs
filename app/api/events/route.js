import dbPromise from "../../../lib/db";

export async function GET() {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM events ORDER BY date ASC");

  return new Response(JSON.stringify(rows));
}

export async function POST(req) {
  const db = await dbPromise;
  const body = await req.json();

  const result = await db.run(
    `INSERT INTO events (name,date,time,day)
     VALUES (?,?,?,?)`,
    body.name,
    body.date,
    body.time,
    body.day
  );

  return new Response(JSON.stringify({ id: result.lastID }), { status: 201 });
}
