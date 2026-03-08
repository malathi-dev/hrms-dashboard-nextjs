"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  
    //im added constant here to handle view employee details in modal
  const handleView = (emp) => {
  setSelectedEmployee(emp);
    setActiveTab("personal");

};
    const fetchData = () => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data));
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data));
 
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete employee?')) return;
    fetch(`/api/employees/${id}`, { method: 'DELETE' }).then(() => fetchData());
  };

  const filtered = employees.filter((e) => {
    return (
      e.name.toLowerCase().includes(search.toLowerCase()) &&
      (deptFilter === '' || e.department === deptFilter)
    );
  });

  const exportExcel = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'Position', 'Salary', 'Department'],
      ...filtered.map((e) => [e.id, e.name, e.email, e.phone, e.position, e.salary, e.department]),
    ];
    let csvContent = '';
    rows.forEach((r) => {
      csvContent += r.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Employees</h1>
      <div className="mb-3 d-flex flex-wrap">
        <input
          placeholder="Search"
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suppressHydrationWarning
        />
        <select
          className="form-select me-2"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          suppressHydrationWarning
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn btn-success" onClick={exportExcel}>
          Export
        </button>
        <Link href="/employees/add" className="btn btn-primary ms-auto">
          Add Employee
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Department</th>
            <th>DOJ</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.phone}</td>
              <td>{e.position}</td>
              <td>{e.salary}</td>
              <td>{e.department}</td>
              <td>{new Date(e.join_date).toLocaleDateString()}</td>

              <td>
    <button className="btn btn-sm btn-info me-1" onClick={() => handleView(e)}>
    <i className="bi bi-eye"></i>
  </button>
  <Link href={`/employees/edit/${e.id}`} className="btn btn-sm btn-warning me-1">
    Edit
  </Link>

  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.id)} >
    Delete
  </button>
</td>
       </tr>
          ))}
        </tbody>
      </table>
          {selectedEmployee && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">

        {/* HEADER */}
        <div className="modal-header">
          <h5 className="modal-title">{selectedEmployee.name}</h5>
          <button
            className="btn-close"
            onClick={() => setSelectedEmployee(null)}
          ></button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* TABS */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "employment" ? "active" : ""}`}
                onClick={() => setActiveTab("employment")}
              >
                Employment
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "docs" ? "active" : ""}`}
                onClick={() => setActiveTab("docs")}
              >
                Documents & Skills
              </button>
            </li>
          </ul>

          {/* TAB CONTENT */}
          <div>

            {activeTab === "personal" && (
              <div>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                <p><strong>Address:</strong> Not Added</p>
                <p><strong>Blood Group:</strong> Not Added</p>
              </div>
            )}

            {activeTab === "employment" && (
              <div>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <p><strong>Position:</strong> {selectedEmployee.position}</p>
                <p><strong>Salary:</strong> ₹{selectedEmployee.salary}</p>
                <p><strong>Manager:</strong> Not Assigned</p>
                 <p><strong>DOJ:</strong>{" "}
                       {new Date(selectedEmployee.join_date).toLocaleDateString()}
                  </p>

              </div>
            )}

            {activeTab === "docs" && (
              <div>
                <p><strong>Skills:</strong> React, Node, CSS</p>
                <p><strong>Documents:</strong></p>
                <ul>
                  <li>Resume.pdf</li>
                  <li>ID Proof.jpg</li>
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
