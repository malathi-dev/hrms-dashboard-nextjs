import dbPromise from '../../../lib/db';

export async function GET() {
  const db = await dbPromise;

  const rows = await db.all(`
    SELECT 
      l.*,
      e.name as employee_name,
      CASE
        WHEN l.status='Approved' AND DATE(l.to_date) < DATE('now')
        THEN 'Completed'
        ELSE l.status
      END as status
    FROM leave_requests l
    LEFT JOIN employees e ON e.id=l.employee_id
    ORDER BY l.id DESC

  `);

  return new Response(JSON.stringify(rows));
}

export async function POST(request) {
  const { employee_id, from_date, to_date, status } = await request.json();
  const db = await dbPromise;

  const result = await db.run(
    `INSERT INTO leave_requests (employee_id, from_date, to_date, status)
     VALUES (?, ?, ?, ?)`,
    employee_id,
    from_date,
    to_date,
    status
  );

  return new Response(JSON.stringify({ id: result.lastID }), { status: 201 });
}
