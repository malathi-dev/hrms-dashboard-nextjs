import dbPromise from "../../../../lib/db";

// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    const db = await dbPromise;

    await db.run("DELETE FROM projects WHERE id = ?", [params.id]);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    console.error("DELETE ERROR:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}


// ✅ UPDATE (PUT)
export async function PUT(req, { params }) {
  try {
    const db = await dbPromise;
    const body = await req.json();

    await db.run(
      `UPDATE projects 
       SET name=?, client=?, start_date=?, end_date=?, status=?, progress=?, team=?, description=?
       WHERE id=?`,
      [
        body.name,
        body.client,
        body.start_date,
        body.end_date,
        body.status,
        body.progress,
        JSON.stringify(body.team || []),
        body.description,
        params.id,
      ]
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    console.error("UPDATE ERROR:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
