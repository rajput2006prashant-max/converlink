
import React, { useState } from "react";
import {
  FaUserCog,
  FaLock,
  FaBell,
  FaGlobe,
  FaSave,
 
  FaShieldAlt
} from "react-icons/fa";


function AdminSettings() {
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@converlink.com",
    language: "English",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    enquiryNotifications: true,
    projectNotifications: false,
    twoFactor: false
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: ""
  });

  const [message, setMessage] = useState("");

  const updateSetting = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));

    setMessage("");
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setMessage("Settings updated in this demo.");
  };

  const changePassword = (e) => {
    e.preventDefault();

    if (!password.current || !password.newPassword || !password.confirm) {
      setMessage("Please fill in all password fields.");
      return;
    }

    if (password.newPassword.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    setMessage("Password form validated. Connect a backend to change your password.");

    setPassword({
      current: "",
      newPassword: "",
      confirm: ""
    });
  };

  return (
    <div className="admin-settings-page">
      <div className="settings-heading">
        <div>
          <h2>Admin Settings</h2>
          <p>Manage your account preferences and security.</p>
        </div>
        <span className="settings-status">
          <FaShieldAlt /> Administrator
        </span>
      </div>

      {message && (
        <div className="settings-message" role="status">
          {message}
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <a href="#general" className="settings-nav active">
            <FaUserCog /> General Settings
          </a>
          <a href="#notifications" className="settings-nav">
            <FaBell /> Notifications
          </a>
          <a href="#security" className="settings-nav">
            <FaLock /> Security
          </a>
          <a href="#preferences" className="settings-nav">
            <FaGlobe /> Preferences
          </a>
        </aside>

        <div className="settings-main">
          <form onSubmit={saveSettings}>
            <section className="settings-card" id="general">
              <div className="settings-section-title">
                <div className="settings-icon">
                  <FaUserCog />
                </div>
                <div>
                  <h3>General Settings</h3>
                  <p>Update your administrator account details.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label htmlFor="admin-name">Full Name</label>
                  <input
                    id="admin-name"
                    name="name"
                    value={settings.name}
                    onChange={updateSetting}
                    required
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="admin-email">Email Address</label>
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={updateSetting}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="settings-card" id="notifications">
              <div className="settings-section-title">
                <div className="settings-icon">
                  <FaBell />
                </div>
                <div>
                  <h3>Notification Settings</h3>
                  <p>Choose which updates you want to receive.</p>
                </div>
              </div>

              <div className="settings-option">
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive important account updates by email.</p>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={updateSetting}
                  />
                  <span></span>
                </label>
              </div>

              <div className="settings-option">
                <div>
                  <strong>New Enquiries</strong>
                  <p>Get notified when a new enquiry is submitted.</p>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="enquiryNotifications"
                    checked={settings.enquiryNotifications}
                    onChange={updateSetting}
                  />
                  <span></span>
                </label>
              </div>

              <div className="settings-option">
                <div>
                  <strong>Project Updates</strong>
                  <p>Receive notifications about project changes.</p>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="projectNotifications"
                    checked={settings.projectNotifications}
                    onChange={updateSetting}
                  />
                  <span></span>
                </label>
              </div>
            </section>

            <section className="settings-card" id="security">
              <div className="settings-section-title">
                <div className="settings-icon">
                  <FaLock />
                </div>
                <div>
                  <h3>Security Settings</h3>
                  <p>Change your account password.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field settings-full">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({ ...password, confirm: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="settings-secondary-btn"
                onClick={changePassword}
              >
                <FaLock /> Validate Password Change
              </button>

              <div className="settings-option settings-two-factor">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Preference only; actual protection requires backend setup.</p>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="twoFactor"
                    checked={settings.twoFactor}
                    onChange={updateSetting}
                  />
                  <span></span>
                </label>
              </div>
            </section>

            <section className="settings-card" id="preferences">
              <div className="settings-section-title">
                <div className="settings-icon">
                  <FaGlobe />
                </div>
                <div>
                  <h3>Preferences</h3>
                  <p>Set your language and timezone.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label htmlFor="settings-language">Language</label>
                  <select
                    id="settings-language"
                    name="language"
                    value={settings.language}
                    onChange={updateSetting}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-timezone">Timezone</label>
                  <select
                    id="settings-timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={updateSetting}
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="settings-save-row">
              <button type="submit" className="settings-save-btn">
                <FaSave /> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
