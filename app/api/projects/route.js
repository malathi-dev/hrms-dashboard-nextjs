import dbPromise from "../../../lib/db";

// ✅ GET PROJECTS
export async function GET() {
  try {
    const db = await dbPromise;

    const rows = await db.all("SELECT * FROM projects");

    const data = rows.map((r) => ({
      ...r,
      team: r.team ? JSON.parse(r.team) : [],
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
    });

  } catch (err) {
    console.error("GET ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// ✅ CREATE PROJECT
export async function POST(req) {
  try {
    const db = await dbPromise;
    const body = await req.json();

    const teamStr = JSON.stringify(body.team || []);

    const result = await db.run(
      `INSERT INTO projects 
      (name, client, start_date, end_date, status, progress, team, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.client,
        body.start_date,
        body.end_date,
        body.status,
        body.progress || 0,
        teamStr,
        body.description,
      ]
    );

    return new Response(
      JSON.stringify({
        id: result.lastID,
        ...body,
        team: body.team || [],
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("POST ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
