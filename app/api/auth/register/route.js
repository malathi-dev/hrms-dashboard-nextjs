export async function POST(request) {
  const data = await request.json();
  return new Response(JSON.stringify({ success: true, user: data }), { status: 201 });
}
