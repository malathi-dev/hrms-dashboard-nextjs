"use client";

import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    employee: "All",
    status: "All",
  });

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    status: "Present",
  });

  // ================= FETCH =================
  const loadData = async () => {
    const emp = await fetch("/api/employees").then(r => r.json());
    const att = await fetch("/api/attendance").then(r => r.json());

    setEmployees(emp);
    setAttendance(att);
    setFiltered(att);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    let data = [...attendance];

    if (filters.from)
      data = data.filter(a => a.date >= filters.from);

    if (filters.to)
      data = data.filter(a => a.date <= filters.to);

    if (filters.employee !== "All")
      data = data.filter(a => a.employee_name === filters.employee);

    if (filters.status !== "All")
      data = data.filter(a => a.status === filters.status);

    setFiltered(data);
  }, [filters, attendance]);

  // ================= SAVE =================
const handleSave = async () => {
  if (!form.date) {
    alert("Select date");
    return;
  }

  if (form.bulk) {
    if (selectedEmployees.length === 0) {
      alert("Select employees");
      return;
    }

    for (let empId of selectedEmployees) {
      await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: empId,
          date: form.date,
          check_in: form.check_in,
          check_out: form.check_out,
          status: form.status,
        }),
      });
    }
  } else {
    if (!form.employee_id) {
      alert("Select employee");
      return;
    }

    await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  }

  await loadData();
  setShowMarkModal(false);
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await fetch(`/api/attendance/${id}`, { method: "DELETE" });
    await loadData();
  };

  // ================= MULTI DELETE =================
  const handleMultiDelete = async () => {
    for (let id of selectedRows) {
      await fetch(`/api/attendance/${id}`, { method: "DELETE" });
    }
    setSelectedRows([]);
    await loadData();
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setForm(row);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    await fetch(`/api/attendance/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await loadData();
    setShowEditModal(false);
  };

  // ================= HOURS =================
  const calcHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";

    const [h1, m1] = inTime.split(":").map(Number);
    const [h2, m2] = outTime.split(":").map(Number);

    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff <= 0) return "-";

    return (diff / 60).toFixed(1) + " hrs";
  };

  return (
    <div className="container-fluid">

      <h4 className="mb-4">Attendance Tracker</h4>

      {/* ================= TOP BAR ================= */}
      <div className="card p-3 mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-between">

          <div>
          


           <div className="dropdown d-inline me-2">
  <button
    className="btn btn-primary dropdown-toggle"
    data-bs-toggle="dropdown"
  >
    Mark Attendance
  </button>

  <ul className="dropdown-menu">
    <li>
      <button
        className="dropdown-item"
        onClick={() => {
          setForm({ ...form, bulk: false });
          setShowMarkModal(true);
        }}
      >
        Individual Attendance
      </button>
    </li>

    <li>
      <button
  className="dropdown-item"
  onClick={() => {
    setForm({ ...form, bulk: true });
    setSelectedEmployees([]);
    setShowMarkModal(true);
  }}
    >
  Bulk Attendance
       </button>

    </li>
  </ul>
</div>

           
            <button className="btn btn-danger"
              onClick={handleMultiDelete}>
              Delete Selected
            </button>
          </div>


           
 
          {/* FILTERS */}
          <div className="d-flex gap-2">

            <div className="dropdown">

  <button
    className="btn btn-outline-secondary dropdown-toggle"
    data-bs-toggle="dropdown"
  >
    Select Date Range
  </button>

  <div className="dropdown-menu p-3">

    <div className="mb-2">
      <label className="text-muted">From</label>
      <input
        type="date"
        className="form-control"
        value={fromDate}
        onChange={(e) => {
          setFromDate(e.target.value);
          setFilters({ ...filters, from: e.target.value });
        }}
      />
    </div>

    <div>
      <label className="text-muted">To</label>
      <input
        type="date"
        className="form-control"
        value={toDate}
        onChange={(e) => {
          setToDate(e.target.value);
          setFilters({ ...filters, to: e.target.value });
        }}
      />
    </div>

  </div>
</div>


          
            <select className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, employee: e.target.value })}>
                 <option value="">All Employees </option>              {employees.map(e => (
                <option key={e.id}>{e.name}</option>
              ))}
            </select>

            <select className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })}>
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
              <option>On Leave</option>
            </select>

          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="card p-3">
        <table className="table table-hover">

          <thead>
            <tr>
              <th>
                <input type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedRows(filtered.map(r => r.id));
                    else
                      setSelectedRows([]);
                  }} />
              </th>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>
                  <input type="checkbox"
                    checked={selectedRows.includes(a.id)}
                    onChange={() => {
                      setSelectedRows(prev =>
                        prev.includes(a.id)
                          ? prev.filter(id => id !== a.id)
                          : [...prev, a.id]
                      );
                    }} />
                </td>
                <td>{a.employee_name}</td>
                <td>{a.date}</td>
                <td>{a.check_in}</td>
                <td>{a.check_out}</td>
                <td>{calcHours(a.check_in, a.check_out)}</td>
                <td>{a.status}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(a)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MARK MODAL ================= */}
      {/* ================= MARK MODAL ================= */}
{showMarkModal && (
  <div className="modal d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-lg">
      <div className="modal-content p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Attendance Marking</h5>
          <button className="btn-close" onClick={() => setShowMarkModal(false)}></button>
        </div>

        {/* DATE */}
        <label className="form-label">Date *</label>
        <input
          type="date"
          className="form-control mb-3"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        {/* TIME */}
        <div className="row">
          <div className="col-md-6">
            <label>Check In *</label>
            <input
              type="time"
              className="form-control mb-3"
              value={form.check_in}
              onChange={(e) => setForm({ ...form, check_in: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label>Check Out *</label>
            <input
              type="time"
              className="form-control mb-3"
              value={form.check_out}
              onChange={(e) => setForm({ ...form, check_out: e.target.value })}
            />
          </div>
        </div>

        {/* STATUS */}
        <label>Status *</label>
        <select
          className="form-control mb-3"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Present</option>
          <option>Absent</option>
          <option>On Leave</option>
        </select>

        {/* BULK / INDIVIDUAL */}
        {form.bulk ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label>Select Employees *</label>

              {/* SELECT ALL */}
              <div>
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === employees.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEmployees(employees.map(e => e.id));
                    } else {
                      setSelectedEmployees([]);
                    }
                  }}
                />{" "}
                <small>Select All</small>
              </div>
            </div>

            {/* EMPLOYEE LIST */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "10px"
              }}
            >
              {employees.map(emp => (
                <div key={emp.id} className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => {
                      setSelectedEmployees(prev =>
                        prev.includes(emp.id)
                          ? prev.filter(id => id !== emp.id)
                          : [...prev, emp.id]
                      );
                    }}
                  />
                  <label className="form-check-label">
                    {emp.name} - {emp.designation}
                  </label>
                </div>
              ))}
            </div>

            {/* COUNT */}
            <small className="text-muted">
              {selectedEmployees.length} employees selected
            </small>
          </>
        ) : (
          <select
            className="form-control mb-3"
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
          >
            <option>Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        )}

        {/* ACTIONS */}
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setShowMarkModal(false)}
          >
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSave}>
            Mark Attendance
          </button>
        </div>

      </div>
    </div>
  </div>
)}


      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit Attendance</h5>

              <input className="form-control mb-2"
                value={form.employee_name} readOnly />

              <input type="date" className="form-control mb-2"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })} />

              <input type="time" className="form-control mb-2"
                value={form.check_in}
                onChange={(e) =>
                  setForm({ ...form, check_in: e.target.value })} />

              <input type="time" className="form-control mb-2"
                value={form.check_out}
                onChange={(e) =>
                  setForm({ ...form, check_out: e.target.value })} />
{/*------------------ All status ------------------*/}
              <select className="form-control mb-2"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })}>
                <option>Present</option>
                <option>Absent</option>
                <option>On Leave</option>
              </select>

              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2"
                  onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success"
                  onClick={handleUpdate}>
                  Update
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
