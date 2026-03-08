"use client";
import { useState, useEffect } from 'react';

export default function LeavePage() {
  const [requests, setRequests] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  

  const fetchData = () => {
    fetch('/api/leave_requests')
      .then((r) => r.json())
      .then((d) => setRequests(d));
    fetch('/api/employees')
      .then((r) => r.json())
      .then((d) => setEmployees(d));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = () => {
    fetch('/api/leave_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, from_date: fromDate, to_date: toDate, status: 'Pending' }),
    }).then(() => fetchData());
  };

  const updateStatus = (id, status) => {
    fetch(`/api/leave_requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => fetchData());
  };
  const deleteLeave = async (id) => {
      if (!confirm("Are you sure you want to delete this leave request?")) return;

  await fetch(`/api/leave_requests/${id}`, {
    method: "DELETE"
  });

  fetchData(); // refresh table
};


  return (
    <div>
      <h1>Leave Management</h1>
      <div className="mb-4">
        <h5>Apply Leave</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <select
              className="form-select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      </div>
      <h5>Leave Requests</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.employee_name || r.employee_id}</td>
              <td>{r.from_date}</td>
              <td>{r.to_date}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-1"
                      onClick={() => updateStatus(r.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(r.id, 'Rejected')}
                    >
                      Reject
                    </button>
               

                  </>
                )}
                     <button
  className="btn btn-sm btn-danger"
  onClick={() => deleteLeave(r.id)}
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
