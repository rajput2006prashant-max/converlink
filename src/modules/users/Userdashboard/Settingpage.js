
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBuilding,
  FaEnvelope,
  FaComments,
  FaProjectDiagram,
  FaGlobe,
  FaCalendarAlt,
  FaSave,
  FaCog,
  FaCheckCircle,
  FaMoon,
  FaSun
} from "react-icons/fa";

import { useGlobalSettings } from "../../../Context/SettingsContext";

const API = "http://localhost:8700/usersettings";

function Settingpage() {
  const navigate = useNavigate();

  const { updateGlobalSettings } = useGlobalSettings();

  const [user, setUser] = useState(null);
  const [settingsId, setSettingsId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotification: true,
    messageNotification: true,
    projectNotification: true,
    enquiryNotification: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    loginAlert: true
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: "10"
  });

  // Load Settings from JSON Server
  useEffect(() => {
    const loginData = localStorage.getItem("userLoginData");

    if (!loginData) {
      navigate("/user-login");
      return;
    }

    let loggedUser;

    try {
      loggedUser = JSON.parse(loginData);
    } catch {
      setError("Invalid login information.");
      setLoading(false);
      return;
    }

    if (!loggedUser?.id) {
      setError("User ID not found. Please login again.");
      setLoading(false);
      return;
    }

    setUser(loggedUser);

    const loadSettings = async () => {
      try {
        const response = await axios.get(
          `${API}?userId=${encodeURIComponent(loggedUser.id)}`
        );

        let loadedPreferences = {
          theme: "light",
          language: "English",
          dateFormat: "DD/MM/YYYY",
          itemsPerPage: "10"
        };

        if (response.data.length > 0) {
          const saved = response.data[0];

          setSettingsId(saved.id);

          setNotifications((prev) => ({
            ...prev,
            ...saved.notifications
          }));

          setSecurity((prev) => ({
            ...prev,
            ...saved.security
          }));

          loadedPreferences = {
            ...loadedPreferences,
            ...saved.preferences
          };
        }

        setPreferences(loadedPreferences);

        // Update Context from JSON Server data
        updateGlobalSettings({
          preferences: loadedPreferences
        });

      } catch (err) {
        console.error("Settings loading error:", err);
        setError("Unable to load settings. Check JSON Server.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [navigate, updateGlobalSettings]);

  // Notification Toggle
  const handleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Security Toggle
  const handleSecurity = (key) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Preference Change
  const handlePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Save Settings in JSON Server
  const handleSave = async () => {
    if (!user?.id) {
      setError("User login information not found.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const settingsData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      notifications,
      security,
      preferences
    };

    try {
      if (settingsId) {
        await axios.patch(
          `${API}/${settingsId}`,
          settingsData
        );
      } else {
        const response = await axios.post(
          API,
          settingsData
        );

        setSettingsId(response.data.id);
      }

      // Update React Context only
      // Permanent settings are saved in JSON Server
      updateGlobalSettings({
        preferences: settingsData.preferences
      });

      setSuccess("Your settings have been saved successfully!");

    } catch (err) {
      console.error("Settings saving error:", err);
      setError("Settings could not be saved. Check JSON Server.");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userLoginData");
    navigate("/user-login");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4">

      {/* Page Heading */}
      <div className="mb-4">
        <h2 className="fw-bold">
          <FaCog className="text-primary me-2" />
          Account Settings
        </h2>

        <p className="text-dark">
          Manage your account, notifications, security and preferences.
        </p>
      </div>

      <div className="row g-4">

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">

            <div className="d-flex align-items-center gap-2 mb-2">
              <FaBuilding className="text-primary fs-3" />
              <h5 className="fw-bold mb-0">CONVERLINK</h5>
            </div>

            <p className="text-muted small mb-4">
              ENGINEERING PVT. LTD.
            </p>

            {/* User Information */}
            <div className="border rounded-3 p-3 mb-4 " style={{
              background:"white",
            }}>
              <div className="d-flex align-items-center gap-3">

                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px" }}
                >
                  <FaUser />
                </div>

                <div>
                  <h6 className="fw-bold mb-1 text-dark">
                    {user?.username}
                  </h6>

                  <small className="text-dark ">
                    {user?.email}
                  </small>
                </div>

              </div>
            </div>

            <Link
              to="/landing/profile"
              className="btn btn-light text-start d-flex align-items-center gap-2 mb-2 bg-primary"
            >
              <FaUser />
              My Profile
              <FaChevronRight className="ms-auto" />
            </Link>

            <Link
              to="/landing/setting"
              className="btn btn-primary text-start d-flex align-items-center gap-2 mb-2"
            >
              <FaShieldAlt />
              Settings
              <FaChevronRight className="ms-auto" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-light text-danger text-start d-flex align-items-center gap-2 bg-primary"
            >
              <FaSignOutAlt />
              Logout
              <FaChevronRight className="ms-auto" />
            </button>

          </div>
        </div>

        {/* Main Settings */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4">

            {/* Messages */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {/* Account Settings */}
            <h5 className="fw-bold mb-3">
              Account Settings
            </h5>

            <div className="border rounded-3 p-3 mb-3">
              <div className="d-flex align-items-center gap-3">

                <FaUser className="text-primary fs-4" />

                <div className="flex-grow-1">
                  <h6 className="mb-1">
                    Personal Information
                  </h6>

                  <p className="text-muted small mb-0">
                    {user?.username} | {user?.email}
                  </p>

                  <p className="text-muted small mb-0">
                    {user?.phone || "Phone number not available"}
                  </p>
                </div>

                <Link
                  to="/landing/profile"
                  className="text-primary text-decoration-none"
                >
                  Edit
                </Link>

              </div>
            </div>

            <div className="border rounded-3 p-3 mb-4">
              <div className="d-flex align-items-center gap-3">

                <FaLock className="text-primary fs-4" />

                <div className="flex-grow-1">
                  <h6 className="mb-1">
                    Change Password
                  </h6>

                  <p className="text-muted small mb-0">
                    Update your account password.
                  </p>
                </div>

                <Link
                  to="/user-forgot"
                  className="text-primary text-decoration-none"
                >
                  Change
                </Link>

              </div>
            </div>

            <hr />

            {/* Notification Settings */}
            <h5 className="fw-bold mb-3">
              <FaBell className="text-primary me-2" />
              Notification Settings
            </h5>

            {[
              {
                key: "emailNotification",
                title: "Email Notifications",
                description: "Receive important updates through email.",
                icon: <FaEnvelope />
              },
              {
                key: "messageNotification",
                title: "Message Notifications",
                description: "Get alerts when you receive new messages.",
                icon: <FaComments />
              },
              {
                key: "projectNotification",
                title: "Project Notifications",
                description: "Receive project-related updates.",
                icon: <FaProjectDiagram />
              },
              {
                key: "enquiryNotification",
                title: "Enquiry Notifications",
                description: "Get alerts about enquiry updates.",
                icon: <FaBell />
              }
            ].map((item) => (
              <div
                key={item.key}
                className="d-flex align-items-center border rounded-3 p-3 mb-3 gap-3"
              >
                <span className="text-primary fs-5">
                  {item.icon}
                </span>

                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.title}</h6>

                  <small className="text-muted">
                    {item.description}
                  </small>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={notifications[item.key]}
                    onChange={() => handleNotification(item.key)}
                  />
                </div>
              </div>
            ))}

            <hr />

            {/* Security Settings */}
            <h5 className="fw-bold mb-3">
              <FaShieldAlt className="text-primary me-2" />
              Security Settings
            </h5>

            <div className="d-flex align-items-center border rounded-3 p-3 mb-4 gap-3">

              <FaLock className="text-success fs-5" />

              <div className="flex-grow-1">
                <h6 className="mb-1">Login Alerts</h6>

                <small className="text-muted">
                  Enable alerts for account login activity.
                </small>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={security.loginAlert}
                  onChange={() => handleSecurity("loginAlert")}
                />
              </div>

            </div>

            <hr />

            {/* Preferences */}
            <h5 className="fw-bold mb-3">
              <FaGlobe className="text-primary me-2" />
              Preferences
            </h5>

            <div className="row g-3 mb-4">

              {/* Theme */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Theme
                </label>

                <select
                  className="form-select"
                  value={preferences.theme}
                  onChange={(e) =>
                    handlePreference("theme", e.target.value)
                  }
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>

                <small className="text-muted">
                  {preferences.theme === "dark" ? (
                    <><FaMoon className="me-1" /> Dark mode selected</>
                  ) : (
                    <><FaSun className="me-1" /> Light mode selected</>
                  )}
                </small>
              </div>

              {/* Language */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Language
                </label>

                <select
                  className="form-select"
                  value={preferences.language}
                  onChange={(e) =>
                    handlePreference("language", e.target.value)
                  }
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaCalendarAlt className="me-2" />
                  Date Format
                </label>

                <select
                  className="form-select"
                  value={preferences.dateFormat}
                  onChange={(e) =>
                    handlePreference("dateFormat", e.target.value)
                  }
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Items Per Page
                </label>

                <select
                  className="form-select"
                  value={preferences.itemsPerPage}
                  onChange={(e) =>
                    handlePreference("itemsPerPage", e.target.value)
                  }
                >
                  <option value="5">5 Items</option>
                  <option value="10">10 Items</option>
                  <option value="20">20 Items</option>
                  <option value="50">50 Items</option>
                </select>
              </div>

            </div>

            {/* Save Button */}
            <div className="text-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary px-4 py-2"
              >
                <FaSave className="me-2" />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>

            {/* Footer */}
            <div className="border-top mt-4 pt-3 text-muted small">
              <FaShieldAlt className="me-2 text-success" />
              Your settings are saved in JSON Server.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Settingpage;
