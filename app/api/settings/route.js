import dbPromise from "../../../lib/db";

export async function GET() {
  const db = await dbPromise;

  const data = await db.get("SELECT * FROM settings LIMIT 1");

  return new Response(JSON.stringify(data || {}), { status: 200 });
}

export async function POST(req) {
  try {
    const db = await dbPromise;
    const body = await req.json();

    await db.run(`
      DELETE FROM settings
    `);

    await db.run(`
      INSERT INTO settings (
        company_name, email, phone, address, website,
        timezone, language, password,
        two_factor, email_notifications, sms_notifications,
        theme, color
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      body.company_name,
      body.email,
      body.phone,
      body.address,
      body.website,
      body.timezone,
      body.language,
      body.password,
      body.two_factor ? 1 : 0,
      body.email_notifications ? 1 : 0,
      body.sms_notifications ? 1 : 0,
      body.theme,
      body.color
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
