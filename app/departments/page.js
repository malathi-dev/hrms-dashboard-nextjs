"use client";
import { useState, useEffect } from 'react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  const fetchData = () => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete department?')) return;
    fetch(`/api/departments/${id}`, { method: 'DELETE' }).then(() => fetchData());
  };

  return (
    <div>
      <h1>Departments</h1>
      <a href="/departments/add" className="btn btn-primary mb-3">
        Add Department
      </a>
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
