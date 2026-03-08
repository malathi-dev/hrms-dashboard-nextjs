"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [join_date, setDoj] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, position, salary, department, join_date }),
    }).then(() => router.push('/employees'));
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Add Employee</h1>
      <div className="card p-3">
        {/* hydation warnings sometimes occur due to browser extensions injecting attributes */}
        <form onSubmit={handleSubmit} suppressHydrationWarning>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            suppressHydrationWarning
          />
        </div>
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
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            className="form-control"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            suppressHydrationWarning
          >
            <option value="">Select dept</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Joining</label>
          <input
            type="datetime-local"
            className="form-control"
            value={join_date}
            onChange={(e) => setDoj(e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <button className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}
