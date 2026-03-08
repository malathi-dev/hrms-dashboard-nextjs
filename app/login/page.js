"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // optionally send request to backend (stub)
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).catch(console.error);
    // authenticate locally using stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem('user', JSON.stringify(found));
      router.push('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '360px' }}>
        <h3 className="mb-3 text-center">Login</h3>
        <form onSubmit={handleSubmit} suppressHydrationWarning>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="mt-2 text-center">
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
