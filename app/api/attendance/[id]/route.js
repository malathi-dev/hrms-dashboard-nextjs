import dbPromise from "../../../../lib/db";

// ================= DELETE =================
export async function DELETE(req, { params }) {
  const db = await dbPromise;
  const { id } = params;

  await db.run(`DELETE FROM attendance WHERE id = ?`, id);

  return Response.json({ success: true });
}

// ================= UPDATE =================
export async function PUT(req, { params }) {
  const db = await dbPromise;
  const { id } = params;

  const body = await req.json();
  const { date, check_in, check_out, status } = body;

  let hours = 0;

  if (check_in && check_out) {
    const start = new Date(`1970-01-01T${check_in}`);
    const end = new Date(`1970-01-01T${check_out}`);
    hours = (end - start) / (1000 * 60 * 60);
  }

  await db.run(
    `UPDATE attendance 
     SET date = ?, check_in = ?, check_out = ?, hours = ?, status = ?
     WHERE id = ?`,
    date,
    check_in,
    check_out,
    hours,
    status,
    id
  );

  return Response.json({ success: true });
}
