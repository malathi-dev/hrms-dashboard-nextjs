"use client";

import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Register charts
ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const router = useRouter();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDay, setEventDay] = useState("");

  // ======================= check-in/check-out DATA =======================
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Check-In",
        data: [10, 20, 15, 25, 30, 22, 18],
        borderColor: "#0d6efd",
        tension: 0.4
      },
      {
        label: "Check-Out",
        data: [8, 18, 12, 22, 28, 20, 15],
        borderColor: "#20c997",
        tension: 0.4
      }
    ]
  };

  const deptData = {
    labels: ["HR", "IT", "Sales", "Support"],
    datasets: [
      {
        data: [10, 25, 15, 8],
        backgroundColor: ["#0d6efd", "#20c997", "#ffc107", "#dc3545"]
      }
    ]
  };

 // Filter recent employees (last 2 days) and sort latest first

 const recentJoiners = recentEmployees
  .filter((e) => {
    if (!e.join_date) return false;
    const join = new Date(e.join_date);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return join >= twoDaysAgo;
  })
  .sort((a, b) => new Date(b.join_date) - new Date(a.join_date)); // latest first



  // ======================= FETCH DATA =======================
  useEffect(() => {
    const load = async () => {
      const emp = await fetch("/api/employees").then((r) => r.json());
      const leave = await fetch("/api/leave_requests").then((r) => r.json());
      const todayStr = new Date().toISOString().split("T")[0];
     const onLeave = leave.filter(
     (l) =>
    l.status === "Approved" &&
    todayStr >= l.from_date &&
    todayStr <= l.to_date
);

      const proj = await fetch("/api/projects").then((r) => r.json());
      const ev = await fetch("/api/events").then((r) => r.json());
       const now = new Date();
            ev.forEach((e) => {
      const eventDate = new Date(e.date + " " + e.time);
      if (eventDate < now) {
        e.status = "completed";
      }
    });


              const upcoming = ev.filter((e) => {
       const eventDate = new Date(e.date + " " + e.time);
         return eventDate >= now && e.status !== "cancelled";
             });

            setEvents(upcoming);

      const todayDate = new Date();
      const yesterday = new Date();
      yesterday.setDate(todayDate.getDate() - 1);

      const recent = emp.filter((e) => {
        if (!e.join_date) return false;
        const join = new Date(e.join_date);
        return join >= yesterday;
      });
      setRecentEmployees(recent);

      setEmployeeCount(emp.length);
      setLeaveCount(onLeave.length);
      setProjectCount(proj.length);
      setPresentCount(emp.length - onLeave.length);
    };

    load();
  }, []);
const addEvent = async () => {
  const dt = new Date(eventDate);

  const date = dt.toISOString().split("T")[0];
  const time = dt.toTimeString().slice(0, 5);
  const day = dt.toLocaleDateString("en-US", { weekday: "long" });

  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: eventName,
      date,
      time,
      day
    })
  });

  // reload events
  const ev = await fetch("/api/events").then((r) => r.json());

  const now = new Date();

  const upcoming = ev.filter((e) => {
    const eventDate = new Date(e.date + " " + e.time);
    return eventDate >= now && e.status !== "cancelled";
  });

  setEvents(upcoming);
  setShowEventModal(false);
};

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <div className="container-fluid">
      {/* ================= CARDS ================= */}
      
     <div className="row g-4 mb-4">
  <div className="col-md-3">
    <div
      className="card dashboard-card card-blue shadow-sm h-100"
      style={{ cursor: "pointer" }}
      onClick={() => goTo("/employees")}
    >
      <div className="card-body">
        <h6>Total Employees</h6>
        <h3>{employeeCount}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card dashboard-card card-green shadow-sm h-100"
      style={{ cursor: "pointer" }}
      onClick={() => goTo("/attendance")}
    >
      <div className="card-body">
        <h6>Present Today</h6>
        <h3>{presentCount}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card dashboard-card card-yellow shadow-sm h-100"
      style={{ cursor: "pointer" }}
      onClick={() => goTo("/leave")}
    >
      <div className="card-body">
        <h6>On Leave</h6>
        <h3>{leaveCount}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card dashboard-card card-purple shadow-sm h-100"
      style={{ cursor: "pointer" }}
      onClick={() => goTo("/projects")}
    >
      <div className="card-body">
        <h6>Active Projects</h6>
        <h3>{projectCount}</h3>
      </div>
    </div>
  </div>
</div>



      {/* ================= CHARTS ================= */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card graph-card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-white">Weekly Activity</h5>
              <div style={{ height: "300px" }}>
                <Line data={weeklyData} />
              </div>
            </div>
          </div>
        </div>

       <div className="col-lg-6">
  <div className="card chart-card shadow-sm border-0">
    <div className="card-body">
      <h5 className="card-title text-white">Department Distribution</h5>

      <div style={{ height: "300px" }}>
        <Pie
          data={deptData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#fff"
                }
              }
            }
          }}
        />
      </div>

    </div>
  </div>
</div>

      </div>

      {/* ================= RECENT EMPLOYEES & EVENTS ================= */}
<div className="row g-4 mt-3">

  {/* Recently Joined Employees */}
  <div className="col-lg-6 fixed-card">
    <div className="card chart-card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title">Recently Joined Employees</h5>

        {recentJoiners.length === 0 ? (
          <p>No recent joiners in last 2 days.</p>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>DOJ</th>
              </tr>
            </thead>
            <tbody>
              {recentJoiners.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.position}</td>
                  <td>{e.department}</td>
                  <td>
                     {new Date(e.join_date).toLocaleDateString()}{" "}
                         {new Date(e.join_date).toLocaleTimeString([], {
                                hour: "2-digit",
                                  minute: "2-digit"
                                  })}
                                          </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>

  {/* Upcoming Events */}
  <div className="col-lg-6 fixed-card">
    <div className="card graph-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="mb-0">Upcoming Events</h5>

  <button className="btn btn-sm btn-outline-primary"  onClick={() => setShowEventModal(true)} >
    + Add Event
  </button>
  </div>

        <ul className="list-group mt-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="list-group-item d-flex justify-content-between"
            >
              <div>
                <strong>{e.name}</strong>
                <br />
                <small>
                   {new Date(e.date).toLocaleDateString()} | {e.time}
                </small>

                

              </div>
               <span className="badge text-info fw-semibold">
    {e.day}
  </span>


  <span
    className={`badge 
      ${e.status === "completed" ? "bg-success" : ""}
      ${e.status === "cancelled" ? "bg-danger" : ""}
      ${e.status === "rescheduled" ? "bg-warning" : ""}
      ${!e.status || e.status === "upcoming" ? "text-primary fw-semibold" : ""}
    `}
  >
    {e.status || "upcoming"}
  </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
 </div>

      {/* ================= MODAL ================= */}
      {showEventModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Event</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEventModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Event Name"
                  onChange={(e) => setEventName(e.target.value)}
                />
                <input
                     type="datetime-local"
                  className="form-control mb-2"
                  onChange={(e) => setEventDate(e.target.value)}
                />
              
              </div>

              <div className="modal-footer">
                <button className="btn btn-primary" onClick={addEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
