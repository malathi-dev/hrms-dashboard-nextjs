# HRMS Next.js Full Stack Application

This repository contains a full-stack Employee Management System built with Next.js 14 (App Router), SQLite, and Bootstrap. Features include authentication, employee/department CRUD, attendance, leave management, payroll, and reports.

## Setup

```bash
npm install
npm run dev
```

The app will run at http://localhost:3000.

## Tech Stack
- Next.js 14 (App Router)
- SQLite (sqlite3)
- Bootstrap for styling + custom CSS
- Chart.js via react-chartjs-2
- No server-side auth; user info kept in localStorage

## Structure
See the problem statement for the directory layout. The database file `employees.db` is created automatically.

## Notes
- Run `npm install` to fetch dependencies.
- Tables are auto-created with some seed data.
- The authentication system uses localStorage; register a user then log in.

Enjoy!
