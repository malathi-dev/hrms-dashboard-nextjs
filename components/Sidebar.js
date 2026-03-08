"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => (pathname === path ? "active" : "");

  return (
    <div className="sidebar sidebar sidebar-fixed border-end" id="sidebar">
      
      {/* HEADER */}
      <div className="sidebar-header border-bottom">
        <div className="sidebar-brand text fw-bold">
            WorkforceHub

        </div>
      </div>

      {/* NAV */}
      <ul className="sidebar-nav">

        <li className="nav-item">
          <Link href="/" className={`nav-link ${isActive("/")}`}>
            <i className="nav-icon bi bi-speedometer2"></i>
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/employees" className={`nav-link ${isActive("/employees")}`}>
            <i className="nav-icon bi bi-people"></i>
            Employees
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/attendance" className={`nav-link ${isActive("/attendance")}`}>
            <i className="nav-icon bi bi-calendar-check"></i>
            Attendance
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/leave" className={`nav-link ${isActive("/leave")}`}>
            <i className="nav-icon bi bi-clock"></i>
            Leave
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/projects" className={`nav-link ${isActive("/projects")}`}>
            <i className="nav-icon bi bi-kanban"></i>
            Projects
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/settings" className={`nav-link ${isActive("/settings")}`}>
            <i className="nav-icon bi bi-gear"></i>
            Settings
          </Link>
        </li>

      </ul>

      {/* FOOTER */}
      <div className="sidebar-footer border-top d-flex">
        <button className="sidebar-toggler w-100 text-white">
          🔓 Logout
        </button>
      </div>

    </div>
  );
}
