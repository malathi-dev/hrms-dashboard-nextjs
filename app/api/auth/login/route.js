export async function POST(request) {
  // stub login, client handles auth via localStorage
  const data = await request.json();
  return new Response(JSON.stringify({ success: true, user: data }), { status: 200 });
}
