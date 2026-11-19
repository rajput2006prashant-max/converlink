
import React, { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:8700/notifications";

const initialForm = {
  title: "",
  message: "",
  type: "General",
  date: new Date().toISOString().slice(0, 16),
  read: false
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotifications(response.data);
      setError("");
    } catch (err) {
      setError("Notifications load nahi ho rahi hain. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Input handle
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add notification
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, {
        ...formData,
        read: false
      });

      alert("Notification successfully added!");

      setFormData(initialForm);
      setShowForm(false);
      fetchNotifications();
    } catch (err) {
      alert("Notification add nahi hui.");
    }
  };

  // Mark as read / unread
  const toggleRead = async (notification) => {
    try {
      await axios.patch(`${API_URL}/${notification.id}`, {
        read: !notification.read
      });

      fetchNotifications();
    } catch (err) {
      alert("Notification status update nahi hua.");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (item) => !item.read
      );

      await Promise.all(
        unreadNotifications.map((item) =>
          axios.patch(`${API_URL}/${item.id}`, {
            read: true
          })
        )
      );

      fetchNotifications();
    } catch (err) {
      alert("Notifications update nahi hui.");
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is notification ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotifications();
    } catch (err) {
      alert("Notification delete nahi hui.");
    }
  };

  // Delete all notifications
  const deleteAll = async () => {
    const confirmDelete = window.confirm(
      "Kya aap saari notifications delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await Promise.all(
        notifications.map((item) =>
          axios.delete(`${API_URL}/${item.id}`)
        )
      );

      fetchNotifications();
    } catch (err) {
      alert("Notifications delete nahi hui.");
    }
  };

  // Search and filter
  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch = [
      item.title,
      item.message,
      item.type
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && !item.read) ||
      (filter === "Read" && item.read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.filter(
    (item) => item.read
  ).length;

  // Notification icon
  const getIcon = (type) => {
    switch (type) {
      case "Enquiry":
        return "📩";
      case "Order":
        return "🛒";
      case "Quotation":
        return "📄";
      case "Invoice":
        return "🧾";
      case "Project":
        return "🏗️";
      case "User":
        return "👤";
      default:
        return "🔔";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Enquiry": return "primary";
      case "Order": return "success";
      case "Quotation": return "info";
      case "Invoice": return "warning";
      case "Project": return "secondary";
      case "User": return "dark";
      default: return "primary";
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Notifications
          </h3>
          <p className="text-muted mb-0">
            Manage all company notifications and updates
          </p>
        </div>

        <button
          className="btn text-white"
          style={{ backgroundColor: "#087FC4" }}
          onClick={() => {
            setFormData(initialForm);
            setShowForm(true);
          }}
        >
          + Add Notification
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Notifications</p>
              <h3 className="fw-bold" style={{ color: "#102D4F" }}>
                {notifications.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Unread Notifications</p>
              <h3 className="fw-bold text-danger">{unreadCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Read Notifications</p>
              <h3 className="fw-bold text-success">{readCount}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Notification List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          {/* Toolbar */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <h5 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
              All Notifications
            </h5>

            <div className="d-flex flex-wrap gap-2">

              <input
                type="text"
                className="form-control"
                placeholder="Search notification..."
                style={{ width: "220px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                style={{ width: "130px" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
              </select>

            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-wrap gap-2 mb-3">

            <button
              className="btn btn-sm btn-outline-success"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <i className="bi bi-check2-all me-1"></i>
              Mark All as Read
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={deleteAll}
              disabled={notifications.length === 0}
            >
              <i className="bi bi-trash me-1"></i>
              Delete All
            </button>

          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-5">
              Loading notifications...
            </div>
          ) : (

            <div>
              {filteredNotifications.length > 0 ? (

                filteredNotifications
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((item) => (

                    <div
                      key={item.id}
                      className="d-flex align-items-start gap-3 p-3 mb-3 rounded border"
                      style={{
                        backgroundColor: item.read ? "#ffffff" : "#f0f7ff",
                        borderLeft: item.read
                          ? "4px solid #dee2e6"
                          : "4px solid #087FC4"
                      }}
                    >

                      {/* Icon */}
                      <div
                        className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                        style={{
                          width: "45px",
                          height: "45px",
                          backgroundColor: "#e5f2fb",
                          fontSize: "21px"
                        }}
                      >
                        {getIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">

                        <div className="d-flex align-items-center flex-wrap gap-2 mb-1">

                          <h6 className="fw-bold mb-0">
                            {item.title}
                          </h6>

                          {!item.read && (
                            <span className="badge bg-danger">
                              New
                            </span>
                          )}

                          <span className={`badge text-bg-${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>

                        </div>

                        <p className="text-muted mb-2">
                          {item.message}
                        </p>

                        <small className="text-secondary">
                          {new Date(item.date).toLocaleString("en-IN")}
                        </small>

                      </div>

                      {/* Actions */}
                      <div className="d-flex flex-column gap-2">

                        <button
                          className={`btn btn-sm ${
                            item.read
                              ? "btn-outline-secondary"
                              : "btn-outline-success"
                          }`}
                          onClick={() => toggleRead(item)}
                        >
                          {item.read ? "Unread" : "Mark Read"}
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  ))

              ) : (

                <div className="text-center py-5">
                  <div style={{ fontSize: "45px" }}>🔔</div>
                  <h6 className="fw-bold mt-2">No Notifications Found</h6>
                  <p className="text-muted mb-0">
                    Abhi koi notification available nahi hai.
                  </p>
                </div>

              )}
            </div>
          )}

        </div>
      </div>

      {/* Add Notification Modal */}
      {showForm && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 2000
          }}
        >

          <div
            className="card border-0 shadow-lg w-100"
            style={{ maxWidth: "550px" }}
          >

            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">Add Notification</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowForm(false)}
              ></button>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Notification Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter notification title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="3"
                    placeholder="Enter notification message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notification Type</label>
                  <select
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="General">General</option>
                    <option value="Enquiry">Enquiry</option>
                    <option value="Order">Order</option>
                    <option value="Quotation">Quotation</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Project">Project</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#087FC4" }}
                  >
                    Save Notification
                  </button>

                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Notifications;
