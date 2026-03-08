"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDepartment() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then(() => router.push('/departments'));
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Add Department</h1>
      <div className="card p-3">
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}
