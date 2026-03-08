import dbPromise from '../../../../lib/db';

export async function PUT(request, { params }) {
  const { id } = params;
  const { status } = await request.json();
  const db = await dbPromise;
  await db.run('UPDATE leave_requests SET status=? WHERE id=?', status, id);
  return new Response(JSON.stringify({ success: true }));
}

// Delete leave request
export async function DELETE(request, { params }) {
  const { id } = params;

  const db = await dbPromise;

  await db.run(
    'DELETE FROM leave_requests WHERE id=?',
    id
  );

  return new Response(JSON.stringify({ success: true }));
}
