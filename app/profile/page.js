"use client";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '', phone: '', avatar: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUser({ ...user, avatar: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const save = () => {
    localStorage.setItem('user', JSON.stringify(user));
    alert('Profile updated');
  };

  return (
    <div>
      <h1>Profile</h1>
      <div className="mb-3">
        <img
          src={user.avatar || 'https://via.placeholder.com/80'}
          alt="avatar"
          className="rounded-circle mb-2"
          width={80}
          height={80}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleAvatar} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          className="form-control"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" onClick={save}>
        Save
      </button>
    </div>
  );
}
