
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalSettings } from "../../../Context/SettingsContext";

const API_URL = "http://localhost:8700/admin";
const SETTINGS_URL = "http://localhost:8700/settings";

function Settings() {
  // Global Settings Context
  const { updateGlobalSettings } = useGlobalSettings();

  const [adminId, setAdminId] = useState(null);
  const [settingsId, setSettingsId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("general");

  const [general, setGeneral] = useState({
    companyName: "Converlink Engineering Pvt. Ltd.",
    websiteName: "CONVERLINK",
    email: "",
    phone: "",
    address: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotification: true,
    enquiryNotification: true,
    orderNotification: true,
    quotationNotification: true,
    invoiceNotification: true,
    projectNotification: true
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: "10"
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlert: true
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load Admin and Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const loginData = JSON.parse(
          localStorage.getItem("adminLoginData") || "null"
        );

        if (!loginData?.email) {
          setError("Admin login information nahi mili.");
          return;
        }

        // Get Admin
        const adminResponse = await axios.get(API_URL);

        const admin = adminResponse.data.find(
          (item) => item.email === loginData.email
        );

        if (!admin) {
          setError("Admin account nahi mila.");
          return;
        }

        setAdminId(admin.id);

        setGeneral((prev) => ({
          ...prev,
          email: admin.email || "",
          phone: admin.phone || "",
          address: admin.address || ""
        }));

        // Get Saved Settings
        const settingsResponse = await axios.get(SETTINGS_URL);

        const savedSettings = settingsResponse.data.find(
          (item) => String(item.adminId) === String(admin.id)
        );

        if (savedSettings) {
          setSettingsId(savedSettings.id);

          const savedGeneral = {
            ...general,
            ...savedSettings.general
          };

          const savedNotifications = {
            ...notifications,
            ...savedSettings.notifications
          };

          const savedPreferences = {
            ...preferences,
            ...savedSettings.preferences
          };

          const savedSecurity = {
            ...security,
            ...savedSettings.security
          };

          setGeneral((prev) => ({
            ...prev,
            ...savedSettings.general
          }));

          setNotifications(savedNotifications);
          setPreferences(savedPreferences);
          setSecurity(savedSecurity);

          // Apply saved settings globally
          updateGlobalSettings({
            general: savedGeneral,
            notifications: savedNotifications,
            preferences: savedPreferences,
            security: savedSecurity
          });
        }
      } catch (err) {
        console.error("Settings Error:", err);

        setError(
          "Settings load nahi hui. JSON Server aur settings collection check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // Load settings once when this page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // General Input
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;

    setGeneral((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Notification Checkbox
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;

    setNotifications((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  // Preferences Input
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Security Checkbox
  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;

    setSecurity((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  // Save All Settings
  const handleSave = async (e) => {
    e.preventDefault();

    if (!adminId) {
      setError("Admin ID nahi mila. Dobara login karo.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const settingsData = {
        adminId,
        general,
        notifications,
        preferences,
        security
      };

      // Save in JSON Server
      if (settingsId) {
        await axios.patch(
          `${SETTINGS_URL}/${settingsId}`,
          settingsData
        );
      } else {
        const response = await axios.post(
          SETTINGS_URL,
          settingsData
        );

        setSettingsId(response.data.id);
      }

      // Update Admin Contact Details
      await axios.patch(`${API_URL}/${adminId}`, {
        email: general.email,
        phone: general.phone,
        address: general.address
      });

      // Update Login Email in LocalStorage
      const loginData = JSON.parse(
        localStorage.getItem("adminLoginData") || "null"
      );

      if (loginData) {
        localStorage.setItem(
          "adminLoginData",
          JSON.stringify({
            ...loginData,
            email: general.email
          })
        );
      }

      // IMPORTANT: Update Global Context
      updateGlobalSettings({
        general,
        notifications,
        preferences,
        security
      });

      setSuccess(
        "Settings successfully save ho gayi! Changes globally apply ho gaye."
      );
    } catch (err) {
      console.error("Save Settings Error:", err);

      setError(
        "Settings save nahi hui. JSON Server check karo."
      );
    } finally {
      setSaving(false);
    }
  };

  // Change Admin Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!adminId) {
      setError("Admin ID nahi mila.");
      return;
    }

    if (!password.currentPassword) {
      setError("Current password enter karo.");
      return;
    }

    if (password.newPassword.length < 8) {
      setError("New password minimum 8 characters ka hona chahiye.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setError("New password aur confirm password match nahi kar rahe.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/${adminId}`
      );

      if (response.data.pass !== password.currentPassword) {
        setError("Current password incorrect hai.");
        return;
      }

      await axios.patch(`${API_URL}/${adminId}`, {
        pass: password.newPassword
      });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setSuccess("Password successfully update ho gaya!");
    } catch (err) {
      console.error("Password Error:", err);
      setError("Password update nahi hua.");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container-fluid text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-secondary">
          Loading Settings...
        </p>
      </div>
    );
  }

  // Settings Tabs
  const tabs = [
    { id: "general", label: "General", icon: "bi-gear" },
    { id: "account", label: "Account", icon: "bi-person" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "bi-bell"
    },
    {
      id: "security",
      label: "Security",
      icon: "bi-shield-lock"
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "bi-sliders"
    }
  ];

  // Notification Options
  const notificationOptions = [
    [
      "emailNotification",
      "Email Notifications",
      "Receive important updates through email"
    ],
    [
      "enquiryNotification",
      "New Enquiries",
      "Get notified when a new enquiry arrives"
    ],
    [
      "orderNotification",
      "Order Updates",
      "Receive order status updates"
    ],
    [
      "quotationNotification",
      "Quotation Updates",
      "Get quotation related notifications"
    ],
    [
      "invoiceNotification",
      "Invoice Updates",
      "Receive invoice and payment notifications"
    ],
    [
      "projectNotification",
      "Project Updates",
      "Get project progress notifications"
    ]
  ];

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* Heading */}
      <div className="mb-4">
        <h3
          className="fw-bold mb-1"
          style={{ color: "#102D4F" }}
        >
          Settings
        </h3>

        <p className="text-secondary mb-0">
          Manage your company, account and dashboard preferences
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}

          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}

          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      <div className="row g-4">

        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="list-group list-group-flush">

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`list-group-item list-group-item-action py-3 ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  style={
                    activeTab === tab.id
                      ? {
                          backgroundColor: "#087FC4",
                          borderColor: "#087FC4"
                        }
                      : {}
                  }
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <i className={`bi ${tab.icon} me-2`}></i>

                  {tab.label}

                  <i className="bi bi-chevron-right float-end"></i>
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">

              <form onSubmit={handleSave}>

                {/* GENERAL SETTINGS */}
                {activeTab === "general" && (
                  <div>
                    <h5 className="fw-bold mb-1">
                      General Settings
                    </h5>

                    <p className="text-secondary mb-4">
                      Manage company information
                    </p>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Company Name
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        value={general.companyName}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Website Name
                      </label>

                      <input
                        type="text"
                        name="websiteName"
                        className="form-control"
                        value={general.websiteName}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Company Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={general.email}
                          onChange={handleGeneralChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Contact Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={general.phone}
                          onChange={handleGeneralChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Company Address
                      </label>

                      <textarea
                        name="address"
                        rows="3"
                        className="form-control"
                        value={general.address}
                        onChange={handleGeneralChange}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* ACCOUNT SETTINGS */}
                {activeTab === "account" && (
                  <div>
                    <h5 className="fw-bold mb-1">
                      Account Settings
                    </h5>

                    <p className="text-secondary mb-4">
                      Manage your admin account details
                    </p>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Admin account email aur phone yahan se update kar sakte ho.
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Admin Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={general.email}
                        onChange={handleGeneralChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={general.phone}
                        onChange={handleGeneralChange}
                      />
                    </div>
                  </div>
                )}

                {/* NOTIFICATION SETTINGS */}
                {activeTab === "notifications" && (
                  <div>
                    <h5 className="fw-bold mb-1">
                      Notification Settings
                    </h5>

                    <p className="text-secondary mb-4">
                      Choose which notifications you want to receive
                    </p>

                    {notificationOptions.map(
                      ([name, title, description]) => (
                        <div
                          key={name}
                          className="d-flex justify-content-between align-items-center border-bottom py-3 gap-3"
                        >
                          <div>
                            <h6 className="fw-semibold mb-1">
                              {title}
                            </h6>

                            <small className="text-secondary">
                              {description}
                            </small>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              name={name}
                              checked={notifications[name]}
                              onChange={handleNotificationChange}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* SECURITY SETTINGS */}
                {activeTab === "security" && (
                  <div>
                    <h5 className="fw-bold mb-1">
                      Security Settings
                    </h5>

                    <p className="text-secondary mb-4">
                      Protect your administrator account
                    </p>

                    <div className="form-check form-switch border-bottom pb-3 mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="twoFactor"
                        checked={security.twoFactor}
                        onChange={handleSecurityChange}
                      />

                      <label className="form-check-label fw-semibold">
                        Two-Factor Authentication
                      </label>

                      <p className="small text-secondary mb-0">
                        Is demo mein ye sirf preference save karta hai.
                        Actual OTP verification abhi implemented nahi hai.
                      </p>
                    </div>

                    <div className="form-check form-switch border-bottom pb-3 mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="loginAlert"
                        checked={security.loginAlert}
                        onChange={handleSecurityChange}
                      />

                      <label className="form-check-label fw-semibold">
                        Login Alerts
                      </label>

                      <p className="small text-secondary mb-0">
                        Save your preference for login alerts.
                      </p>
                    </div>

                    <h6 className="fw-bold mb-3">
                      Change Password
                    </h6>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Current Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={password.currentPassword}
                        onChange={(e) =>
                          setPassword((prev) => ({
                            ...prev,
                            currentPassword: e.target.value
                          }))
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        New Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword((prev) => ({
                            ...prev,
                            newPassword: e.target.value
                          }))
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={password.confirmPassword}
                        onChange={(e) =>
                          setPassword((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handlePasswordChange}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Update Password
                    </button>
                  </div>
                )}

                {/* PREFERENCES */}
                {activeTab === "preferences" && (
                  <div>
                    <h5 className="fw-bold mb-1">
                      Dashboard Preferences
                    </h5>

                    <p className="text-secondary mb-4">
                      Customize your dashboard experience
                    </p>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Theme
                      </label>

                      <select
                        name="theme"
                        className="form-select"
                        value={preferences.theme}
                        onChange={handlePreferenceChange}
                      >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Language
                      </label>

                      <select
                        name="language"
                        className="form-select"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Date Format
                      </label>

                      <select
                        name="dateFormat"
                        className="form-select"
                        value={preferences.dateFormat}
                        onChange={handlePreferenceChange}
                      >
                        <option value="DD/MM/YYYY">
                          DD/MM/YYYY
                        </option>

                        <option value="MM/DD/YYYY">
                          MM/DD/YYYY
                        </option>

                        <option value="YYYY-MM-DD">
                          YYYY-MM-DD
                        </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Table Rows Per Page
                      </label>

                      <select
                        name="itemsPerPage"
                        className="form-select"
                        value={preferences.itemsPerPage}
                        onChange={handlePreferenceChange}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* SAVE BUTTON */}
                {activeTab !== "security" && (
                  <div className="border-top pt-4 mt-4">
                    <button
                      type="submit"
                      className="btn text-white px-4"
                      style={{ backgroundColor: "#087FC4" }}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
