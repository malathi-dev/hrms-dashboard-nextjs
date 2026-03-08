import dbPromise from "../../../lib/db";
 export async function GET(req) { 
  const db = await dbPromise; 

  const rows = await db.all(` SELECT a.*, e.name as employee_name FROM attendance a LEFT JOIN employees e ON e.id = a.employee_id ORDER BY a.date DESC `);
 return Response.json(rows); } 
export async function POST(req) { 
  const db = await dbPromise; 
  const body = await req.json(); 
const { employee_id, date, check_in, check_out, status } = body; let hours = 0; 
if (check_in && check_out) {
   const start = new Date(`1970-01-01T${check_in}`); 
const end = new Date(`1970-01-01T${check_out}`);
 hours = (end - start) / (1000 * 60 * 60); }
 const result = await db.run( `INSERT INTO attendance (employee_id, date, check_in, check_out, hours, status) VALUES (?, ?, ?, ?, ?, ?)`, employee_id, date, check_in, check_out, hours, status ); 
return Response.json({ id: result.lastID });
 } 