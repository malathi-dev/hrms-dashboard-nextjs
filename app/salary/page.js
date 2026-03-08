"use client";
import { useState, useEffect } from 'react';

export default function SalaryPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('/api/employees')
      .then((r) => r.json())
      .then((d) => setEmployees(d));
  }, []);

  const total = employees.reduce((acc, e) => acc + parseFloat(e.salary || 0), 0);

  const generatePayslip = (e) => {
    alert(`Payslip for ${e.name}: $${e.salary}`);
  };

  return (
    <div>
      <h1>Salary / Payroll</h1>
      <h5>Total payroll: ${total.toFixed(2)}</h5>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>${e.salary}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => generatePayslip(e)}
                >
                  Payslip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
