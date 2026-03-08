import dbPromise from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = params;
  const db = await dbPromise;
  const row = await db.get('SELECT * FROM employees WHERE id = ?', id);
  return new Response(JSON.stringify(row || {}));
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  const db = await dbPromise;
  await db.run(
    `UPDATE employees SET name=?,email=?,phone=?,position=?,salary=?,department=?,join_date=? WHERE id=?`,
    data.name,
    data.email,
    data.phone,
    data.position,
    data.salary,
    data.department,
    data.join_date,
    id
  );
  return new Response(JSON.stringify({ success: true }));
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const db = await dbPromise;
  await db.run('DELETE FROM employees WHERE id=?', id);
  return new Response(JSON.stringify({ success: true }));
}
