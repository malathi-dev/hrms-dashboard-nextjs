"use client";
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('/api/employees')
      .then((r) => r.json())
      .then((d) => setEmployees(d));
    fetch('/api/departments')
      .then((r) => r.json())
      .then((d) => setDepartments(d));
  }, []);

  const salaryData = {
    labels: employees.map((e) => e.name),
    datasets: [
      {
        label: 'Salary',
        data: employees.map((e) => e.salary),
        backgroundColor: 'rgba(106,13,173,0.6)',
      },
    ],
  };

  const deptCount = departments.map((d) => {
    return employees.filter((e) => e.department === d.name).length;
  });

  const pieData = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        data: deptCount,
        backgroundColor: departments.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`),
      },
    ],
  };

  return (
    <div>
      <h1>Reports</h1>
      <div className="mb-4">
        <div className="chart-card mb-4">
          <h5>Salary Distribution</h5>
          <Bar data={salaryData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="chart-card">
          <h5>Department-wise Employees</h5>
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
