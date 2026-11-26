
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:8700/notifications";
const USER_API = "http://localhost:8700/user";

const initialForm = {
  userId: "",
  title: "",
  message: "",
  type: "General",
  date: new Date().toISOString().slice(0, 16),
  read: false
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotifications(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Notifications load nahi ho rahi hain.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(USER_API);
      setUsers(response.data);
    } catch (err) {
      console.error("Users Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, [fetchNotifications, fetchUsers]);

  // Input handler
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
      if (!formData.userId) {
        alert("Please select a user.");
        return;
      }

      await axios.post(API_URL, {
        ...formData,
        userId: String(formData.userId),
        read: false
      });

      alert("Notification successfully sent!");

      setFormData({
        ...initialForm,
        date: new Date().toISOString().slice(0, 16)
      });

      setShowForm(false);
      fetchNotifications();

    } catch (err) {
      console.error("Add Notification Error:", err);
      alert("Notification add nahi hui.");
    }
  };

  // Mark read / unread
  const toggleRead = async (item) => {
    try {
      await axios.patch(`${API_URL}/${item.id}`, {
        read: !item.read
      });

      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Status update nahi hua.");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((item) => !item.read);

      await Promise.all(
        unread.map((item) =>
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

  // Delete one
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotifications();
    } catch (err) {
      alert("Delete nahi hua.");
    }
  };

  // Delete all
  const deleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    try {
      await Promise.all(
        notifications.map((item) =>
          axios.delete(`${API_URL}/${item.id}`)
        )
      );

      fetchNotifications();
    } catch (err) {
      alert("Delete all nahi hua.");
    }
  };

  // Search and filter
  const filteredNotifications = notifications.filter((item) => {
    const text = [
      item.title,
      item.message,
      item.type
    ].join(" ").toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Read" && item.read) ||
      (filter === "Unread" && !item.read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.filter(
    (item) => item.read
  ).length;

  const getUserName = (userId) => {
    const user = users.find(
      (u) => String(u.id) === String(userId)
    );

    return user
      ? user.username || user.name || user.email || user.id
      : "Unknown User";
  };

  const getIcon = (type) => {
    const icons = {
      Enquiry: "📩",
      Order: "🛒",
      Quotation: "📄",
      Invoice: "🧾",
      Project: "🏗️",
      User: "👤"
    };

    return icons[type] || "🔔";
  };

  return (
    <div className="container-fluid p-3 p-md-4">

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Notifications
          </h3>
          <p className="text-muted mb-0"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
            Manage and send notifications to users
          </p>
        </div>

        <button
          className="btn text-white"
          style={{ backgroundColor: "#087FC4" }}
          onClick={() => {
            setFormData({
              ...initialForm,
              date: new Date().toISOString().slice(0, 16)
            });
            setShowForm(true);
          }}
        >
          + Add Notification
        </button>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted">Total Notifications</p>
              <h3 className="fw-bold">{notifications.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted">Unread</p>
              <h3 className="fw-bold text-danger">{unreadCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted">Read</p>
              <h3 className="fw-bold text-success">{readCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex justify-content-between flex-wrap gap-3 mb-3">
            <h5 className="fw-bold" style={{
              background:"#087FC4",
              width:"190px",
              borderRadius:"10px",
              padding:"10px",
            }}>All Notifications</h5>

            <div className="d-flex gap-2 flex-wrap">
              <input
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                <option>Read</option>
                <option>Unread</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-sm btn-outline-success"
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
            >
              Mark All Read
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              disabled={notifications.length === 0}
              onClick={deleteAll}
            >
              Delete All
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {loading ? (
            <div className="text-center p-5">Loading...</div>
          ) : filteredNotifications.length > 0 ? (

            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className="border rounded p-3 mb-3 d-flex gap-3 align-items-start"
                style={{
                  backgroundColor: item.read ? "#087FC4" : "#087FC4",
                  borderLeft: item.read
                    ? "4px solid #ddd"
                    : "4px solid #087FC4",
                      borderRadius: "10px",
    color: "black",
                }}
              >
                <div style={{ fontSize: "28px" }}>
                  {getIcon(item.type)}
                </div>

                <div className="flex-grow-1">
                  <h6 className="fw-bold">{item.title}</h6>

                  <p className="mb-1">{item.message}</p>

                  <small className="text-muted">
                    To: {getUserName(item.userId)}
                  </small>

                  <br />

                  <small className="text-muted">
                    {item.date
                      ? new Date(item.date).toLocaleString("en-IN")
                      : ""}
                  </small>
                </div>

                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-outline-success bg-primary"
                    onClick={() => toggleRead(item)}
                  >
                    {item.read ? "Unread" : "Mark Read"}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger "
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))

          ) : (
            <div className="text-center py-5">
              <h5>No Notifications Found</h5>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 2000
          }}
        >
          <div className="card w-100 border-0 shadow-lg" style={{ maxWidth: "550px" }}>

            <div
              className="card-header text-white d-flex justify-content-between"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">Send Notification</h5>

              <button
                className="btn-close btn-close-white"
                onClick={() => setShowForm(false)}
              />
            </div>

            <div className="card-body"
            style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Select User *</label>

                  <select
                    name="userId"
                    className="form-select"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select User</option>

                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username || user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <input
                    name="title"
                    className="form-control"
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
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option>General</option>
                    <option>Enquiry</option>
                    <option>Order</option>
                    <option>Quotation</option>
                    <option>Invoice</option>
                    <option>Project</option>
                    <option>User</option>
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

                <div className="d-flex justify-content-end gap-2">
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
                    Send Notification
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
