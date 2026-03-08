"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const save = async () => {
  await fetch("/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  alert("Saved Successfully");
};
  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4">Settings</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "security" ? "active" : ""}`}
            onClick={() => setTab("security")}
          >
            Security
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "notifications" ? "active" : ""}`}
            onClick={() => setTab("notifications")}
          >
            Notifications
          </button>
        </li>

      </ul>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="card p-4">
          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Company Logo</label>
              <input type="file" className="form-control" />
            </div>

            <div className="col-md-6 mb-3">
              <label>Address</label>
              <textarea className="form-control"></textarea>
            </div>

            <div className="col-md-6 mb-3">
              <label>Company Name</label>
              <input className="form-control" defaultValue="Acme Corporation"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Website</label>
              <input className="form-control" defaultValue="https://acmecorp.com"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Email Address</label>
              <input className="form-control" defaultValue="admin@acmecorp.com"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Timezone</label>
             <select className="form-control">
  <option value="IST">India Standard Time (IST)</option>
  <option value="UTC">UTC - Coordinated Universal Time</option>
  <option value="PST">Pacific Time (US & Canada)</option>
  <option value="MST">Mountain Time (US & Canada)</option>
  <option value="CST">Central Time (US & Canada)</option>
  <option value="EST">Eastern Time (US & Canada)</option>
  <option value="BST">British Summer Time (UK)</option>
  <option value="CET">Central European Time</option>
  <option value="JST">Japan Standard Time</option>
  <option value="AEST">Australian Eastern Standard Time</option>
</select>

            </div>

            <div className="col-md-6 mb-3">
              <label>Phone Number</label>
              <input className="form-control" defaultValue="+1 (555) 123-4567"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Language</label>
              <select className="form-control">
                <option>English (US)</option>
              </select>
            </div>

          </div>

          <button className="btn btn-primary mt-3">
            Save Changes
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === "security" && (
        <div className="card p-4">
          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Current Password</label>
              <input type="password" className="form-control"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Two-Factor Authentication</label>
              <div>
                <input type="checkbox"/>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label>New Password</label>
              <input type="password" className="form-control"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Session Timeout</label>
              <select className="form-control">
                <option>1 hour</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Confirm Password</label>
              <input type="password" className="form-control"/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Password Expiry</label>
              <select className="form-control">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="card p-4">

          <h5>Email Notifications</h5>
          <input type="checkbox" className="form-check-input"/>

          <h5 className="mt-4">Notification Preferences</h5>

          <div className="form-check">
            <input type="checkbox" className="form-check-input"/>
            <label>New Employee Joins</label>
          </div>

          <div className="form-check">
            <input type="checkbox" className="form-check-input"/>
            <label>Attendance Alerts</label>
          </div>

          <div className="form-check">
            <input type="checkbox" className="form-check-input"/>
            <label>System Updates</label>
          </div>

          <button className="btn btn-primary mt-3">
            Save Changes
          </button>

        </div>
      )}

      

    </div>
  );
}
