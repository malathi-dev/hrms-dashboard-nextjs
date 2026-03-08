"use client";

import './globals.css';
import "./styles/style.scss";
import "./styles/examples.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('../components/Sidebar'), { ssr: false });
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {

     import("bootstrap/dist/js/bootstrap.bundle.min.js");
    const stored = localStorage.getItem('user');
    const u = stored ? JSON.parse(stored) : null;
    setUser(u);

    if (!u && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ✅ ONLY bootstrap (no style.css) */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" />

        {/* icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          rel="stylesheet"
        />

      </head>

      <body>
  {user ? (
    <div className="app d-flex">

      {/* SIDEBAR */}
      <div className="sidebar sidebar-fixed">
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="wrapper d-flex flex-column min-vh-100">

        {/* NAVBAR */}
        <div className="header header-sticky">
          <Navbar />
        </div>

        {/* CONTENT */}
        <div className="body flex-grow-1 px-3">
          {children}
        </div>

      </div>

    </div>
  ) : (
    children
  )}
</body>

    </html>
  );
}
