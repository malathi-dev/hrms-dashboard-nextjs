"use client";

import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [form, setForm] = useState({
    name: "",
    client: "",
    start_date: "",
    end_date: "",
    status: "In Progress",
    progress: 0,
    team: [],
    description: "",
  });

  // ================= FETCH EMPLOYEES + PROJECTS =================
  const loadData = async () => {
    try {
      const [empRes, projRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/projects"),
      ]);

      if (!empRes.ok || !projRes.ok) {
        console.error("API failed");
        return;
      }

      const emp = await empRes.json();
      const proj = await projRes.json();

      setEmployees(emp);   // ✅ team members visible
      setProjects(proj);   // ✅ projects table loads
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= FILTER =================
  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  // ================= CREATE PROJECT =================
  const handleSave = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const createdProject = await res.json();

      setProjects((prev) => [...prev, createdProject]); // add new project
      setForm({
        name: "",
        client: "",
        start_date: "",
        end_date: "",
        status: "In Progress",
        progress: 0,
        team: [],
        description: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Check API or DB.");
    }
  };

  // ================= DELETE PROJECT =================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="mb-3">Project Management</h4>

      {/* TOP BAR */}
      <div className="card p-3 mb-3">
        <div className="d-flex justify-content-between">
          <div className="btn-group">
            {["All", "In Progress", "Completed", "On Hold"].map((tab) => (
              <button
                key={tab}
                className={`btn btn-sm ${
                  activeTab === tab ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Project
          </button>
        </div>
      </div>

      {/* PROJECTS TABLE */}
      <div className="card p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Start</th>
              <th>Deadline</th>
              <th>Team</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.client}</td>
                <td>{p.start_date}</td>
                <td>{p.end_date}</td>
                <td>
                  {p.team?.slice(0, 3).map((t, i) => (
                    <span key={i} className="badge bg-light text-dark me-1">
                      {t}
                    </span>
                  ))}
                </td>
                <td style={{ width: "150px" }}>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <small>{p.progress}%</small>
                </td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "Completed"
                        ? "bg-success"
                        : p.status === "On Hold"
                        ? "bg-warning"
                        : "bg-primary"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                       className="btn btn-info btn-sm me-1"
                          onClick={() => setViewProject(p)}
                           > 👁
                     </button>
                        <button
                           className="btn btn-warning btn-sm me-1"
                             onClick={() => setEditProject(p)}
                             >✏️
                              </button>


                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD PROJECT MODAL */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <div className="d-flex justify-content-between mb-3">
                <h5>Add New Project</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label>Project Name *</label>
                  <input
                    className="form-control mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label>Client *</label>
                  <input
                    className="form-control mb-2"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label>Deadline</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* TEAM */}
              <label>Team Members</label>
              <div
                className="border p-2 mb-2"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {employees.map((emp) => (
                  <div key={emp.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={form.team.includes(emp.name)}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          team: prev.team.includes(emp.name)
                            ? prev.team.filter((t) => t !== emp.name)
                            : [...prev.team, emp.name],
                        }))
                      }
                    />
                    <label className="form-check-label">{emp.name}</label>
                  </div>
                ))}
              </div>

              <textarea
                className="form-control mb-3"
                placeholder="Project Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        {/* VIEW PROJECT MODAL */}
{viewProject && (
  <div className="modal d-block bg-dark bg-opacity-50">
    <div className="modal-dialog">
      <div className="modal-content p-4">

        <div className="d-flex justify-content-between">
          <h5>Project Details</h5>
          <button className="btn-close" onClick={() => setViewProject(null)} />
        </div>

        <h5>{viewProject.name}</h5>
        <p><b>Client:</b> {viewProject.client}</p>
        <p><b>Start:</b> {viewProject.start_date}</p>
        <p><b>Deadline:</b> {viewProject.end_date}</p>

        <p>
          <b>Status:</b>
          <span className="badge bg-primary ms-2">{viewProject.status}</span>
        </p>

        <div className="mb-2">
          <b>Progress:</b>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${viewProject.progress}%` }}
            ></div>
          </div>
          {viewProject.progress}%
        </div>

        <p><b>Team Members:</b></p>
        {viewProject.team?.map((t, i) => (
          <span key={i} className="badge bg-light text-dark me-1">
            {t}
          </span>
        ))}

        <p className="mt-2"><b>Description:</b> {viewProject.description}</p>

      </div>
    </div>
  </div>
)}
      {/* EDIT PROJECT MODAL */}
      {/* EDIT PROJECT MODAL */}
{editProject && (
  <div className="modal d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-lg">
      <div className="modal-content p-4">

        <div className="d-flex justify-content-between">
          <h5>Edit Project</h5>
          <button className="btn-close" onClick={() => setEditProject(null)} />
        </div>

        <input
          className="form-control mb-2"
          value={editProject.name}
          onChange={(e) =>
            setEditProject({ ...editProject, name: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          value={editProject.client}
          onChange={(e) =>
            setEditProject({ ...editProject, client: e.target.value })
          }
        />

        <label>Progress: {editProject.progress}%</label>
        <input
          type="range"
          min="0"
          max="100"
          className="form-range"
          value={editProject.progress}
          onChange={(e) =>
            setEditProject({ ...editProject, progress: e.target.value })
          }
        />

        <select
          className="form-control mb-2"
          value={editProject.status}
          onChange={(e) =>
            setEditProject({ ...editProject, status: e.target.value })
          }
        >
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>

        <button
          className="btn btn-primary"
          onClick={async () => {
            await fetch(`/api/projects/${editProject.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editProject),
            });

            setEditProject(null);
            loadData();
          }}
        >
          Save Changes
        </button>

      </div>
    </div>
  </div>
)}


    </div>
  );
}
