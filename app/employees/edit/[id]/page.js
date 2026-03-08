"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data));
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    }).then(() => router.push('/employees'));
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Edit Employee</h1>
      <div className="card p-3">
        {/* suppress mismatch warnings from extensions (fdprocessedid etc) */}
        <form onSubmit={handleSubmit} suppressHydrationWarning>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            required
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            required
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={employee.phone}
            onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            value={employee.position}
            onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            className="form-control"
            value={employee.salary}
            onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={employee.department}
            onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
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
            type="date"
            className="form-control"
            value={employee.doj}
            onChange={(e) => setEmployee({ ...employee, doj: e.target.value })}
            suppressHydrationWarning
          />
        </div>
        <button className="btn btn-primary">Update</button>
      </form>
      </div>
    </div>
  );
}
