import dbPromise from '../../../../lib/db';

export async function DELETE(request, { params }) {
  const { id } = params;
  const db = await dbPromise;
  await db.run('DELETE FROM departments WHERE id=?', id);
  return new Response(JSON.stringify({ success: true }));
}
