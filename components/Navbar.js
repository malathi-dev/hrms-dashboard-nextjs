"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [openTheme, setOpenTheme] = useState(false);
  
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "active" : "";
  };


  // 👉 LOAD USER
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-coreui-theme", savedTheme);
  }, []);

  // 👉 THEME SWITCH
  const changeTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    document.body.setAttribute("data-coreui-theme", mode);
  };

  const toggleSidebar = () => {
    const sb = document.querySelector(".sidebar");
    if (sb) sb.classList.toggle("show");
  };

  return (
    <header className="header header-sticky p-0 mb-4">
      <div className="container-fluid border-bottom px-4">

        {/* SIDEBAR TOGGLE */}
        <button className="header-toggler" onClick={toggleSidebar}>
          <svg className="icon icon-lg">
            <use xlinkHref="/icons/free.svg#cil-menu"></use>
          </svg>
        </button>

        {/* LEFT NAV */}
        <ul className="header-nav d-none d-lg-flex">
<Link href="/" className={`nav-link ${isActive("/")}`}>
          Dashboard
        </Link>        </ul>

        {/* RIGHT SIDE */}
        <ul className="header-nav ms-auto">

          {/* 🔔 NOTIFICATIONS */}
          <li className="nav-item dropdown">
            <button className="nav-link" onClick={() => {
  setOpenNotif(!openNotif);
  setOpenMsg(false);
  setOpenProfile(false);
  setOpenTheme(false);
}}
>
              <svg className="icon icon-lg">
                <use xlinkHref="/icons/free.svg#cil-bell"></use>
              </svg>
            </button>

            {openNotif && (
              <div className="dropdown-menu dropdown-menu-end show">
                <div className="dropdown-header fw-semibold">Notifications</div>

                <a className="dropdown-item">New user registered</a>
                <a className="dropdown-item">Server restarted</a>
                <a className="dropdown-item">Database backup done</a>
              </div>
            )}
          </li>

          {/* 💬 MESSAGES */}
          <li className="nav-item dropdown">
            <button className="nav-link" onClick={() => {
  setOpenMsg(!openMsg);
  setOpenNotif(false);
  setOpenProfile(false);
  setOpenTheme(false);
}}
>
              <svg className="icon icon-lg">
                <use xlinkHref="/icons/free.svg#cil-envelope-open"></use>
              </svg>
            </button>

            {openMsg && (
              <div className="dropdown-menu dropdown-menu-end show">
                <div className="dropdown-header fw-semibold">Messages</div>

                <a className="dropdown-item">HR: Meeting at 3PM</a>
                <a className="dropdown-item">Admin: Update records</a>
                <a className="dropdown-item">Manager: Approve leaves</a>
              </div>
            )}
          </li>
        </ul>

        {/* THEME + PROFILE */}
        <ul className="header-nav">

  
{/* 🌙 THEME TOGGLE ICON */}
<li className="nav-item dropdown">
  <button
    className="nav-link"
    onClick={() => {
  setOpenTheme(!openTheme);
  setOpenProfile(false);
  setOpenNotif(false);
  setOpenMsg(false);
}}
  >
    <svg className="icon icon-lg">
      <use
        xlinkHref={
          theme === "dark"
            ? "/icons/free.svg#cil-moon"
            : "/icons/free.svg#cil-sun"
        }
      ></use>
    </svg>
  </button>

  <ul className={`dropdown-menu dropdown-menu-end ${openTheme ? "show" : ""}`}>
    <li>
      <button
        className="dropdown-item"
        onClick={() => changeTheme("light")}
      >
        Light
      </button>
    </li>
    <li>
      <button
        className="dropdown-item"
        onClick={() => changeTheme("dark")}
      >
        Dark
      </button>
    </li>
    <li>
      <button
        className="dropdown-item"
        onClick={() => changeTheme("auto")}
      >
        Auto
      </button>
    </li>
  </ul>
</li>


          {/* 👤 PROFILE */}
          <li className="nav-item dropdown">
            <button
              className="btn btn-link nav-link d-flex align-items-center"
              onClick={() => setOpenProfile(!openProfile)}
            >
onClick={() => {
              <div className="avatar avatar-md">
                <img
                  className="avatar-img"
                  src={user?.avatar || "https://i.pravatar.cc/40"}
                  alt="user"
                />
              </div>
            </button>

            {openProfile && (
              <div className="dropdown-menu dropdown-menu-end pt-0 show">

                <div className="dropdown-header fw-semibold">
                  {user?.name || "User"}
                </div>

                <a className="dropdown-item">Profile</a>
                <a className="dropdown-item">Settings</a>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* BREADCRUMB */}
      <div className="container-fluid px-4">
        <ol className="breadcrumb my-0">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </div>
    </header>
  );
}
