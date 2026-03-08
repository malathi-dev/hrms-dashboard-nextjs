import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// SINGLE DB CONNECTION ✅
const dbPromise = open({
  filename: path.resolve(process.cwd(), "employees.db"),
  driver: sqlite3.Database,
});

async function initDB() {
  const db = await dbPromise;

  
try {
  await db.exec(`ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'upcoming'`);
} catch (e) {}

  try {
  await db.exec(`ALTER TABLE employees ADD COLUMN join_date TEXT`);
} catch (e) {}

  await db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      position TEXT,
      salary REAL,
      department TEXT,
      join_date TEXT
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  date TEXT,
  time TEXT,
  day TEXT
);


    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      date TEXT,
      check_in TEXT,
      check_out TEXT,
      hours REAL,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      client TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT,
      progress INTEGER,
      team TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      website TEXT,
      timezone TEXT,
      language TEXT,
      password TEXT,
      two_factor INTEGER DEFAULT 0,
      email_notifications INTEGER DEFAULT 1,
      sms_notifications INTEGER DEFAULT 0,
      theme TEXT DEFAULT 'light',
      color TEXT DEFAULT 'blue'
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      from_date TEXT,
      to_date TEXT,
      status TEXT
    );
  `);

  // seed data
  const { count } = await db.get("SELECT COUNT(*) as count FROM employees");

  if (count === 0) {
    await db.run("INSERT INTO departments (name) VALUES ('HR')");
    await db.run("INSERT INTO departments (name) VALUES ('Engineering')");

    await db.run(`
      INSERT INTO employees (name,email,phone,position,salary,department)
      VALUES ('Alice','alice@example.com','123','Manager',5000,'HR')
    `);

    await db.run(`
      INSERT INTO employees (name,email,phone,position,salary,department)
      VALUES ('Bob','bob@example.com','456','Developer',4000,'Engineering')
    `);

    
  }
}

initDB().catch(console.error);

export default dbPromise;
