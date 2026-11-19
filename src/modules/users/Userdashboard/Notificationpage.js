
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  FaBell,
  FaCheckDouble,
  FaTrash,
  FaTools,
  FaEnvelope,
  FaUserCheck,
  FaBullhorn,
  FaArrowLeft
} from "react-icons/fa";

const API = "http://localhost:8700/notifications";

function Notificationpage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  const userId = loginData?.id;

  // Fetch only logged-in user's notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setNotifications([]);
        setError("Please login to view notifications.");
        return;
      }

      const response = await axios.get(API);

      const userNotifications = response.data.filter(
        (item) => String(item.userId) === String(userId)
      );

      setNotifications(userNotifications);

    } catch (err) {
      console.error("Notification Error:", err);
      setNotifications([]);
      setError("Notifications load nahi ho payi.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark one notification read
  const markRead = async (id) => {
    try {
      await axios.patch(`${API}/${id}`, {
        read: true
      });

      setNotifications((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, read: true }
            : item
        )
      );

    } catch (err) {
      console.error(err);
      alert("Notification update nahi hui.");
    }
  };

  // Mark all read
  const markAllRead = async () => {
    try {
      const unread = notifications.filter(
        (item) => !item.read
      );

      await Promise.all(
        unread.map((item) =>
          axios.patch(`${API}/${item.id}`, {
            read: true
          })
        )
      );

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );

    } catch (err) {
      console.error(err);
      alert("Notifications update nahi hui.");
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      await axios.delete(`${API}/${id}`);

      setNotifications((prev) =>
        prev.filter(
          (item) => String(item.id) !== String(id)
        )
      );

    } catch (err) {
      console.error(err);
      alert("Notification delete nahi hui.");
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const getIcon = (type) => {
    switch (type) {
      case "Invoice":
        return <FaEnvelope />;
      case "Project":
        return <FaTools />;
      case "Enquiry":
        return <FaUserCheck />;
      case "General":
        return <FaBullhorn />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div className="notification-page">
      <div className="container py-5">

        <Link to="/landing/home" className="notification-back">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 my-4">
          <div>
            <h2>
              <FaBell /> Notifications
            </h2>
            <p className="text-muted">
              Stay updated with Converlink Engineering.
            </p>
          </div>

          <div className="badge bg-primary fs-6">
            {unreadCount} Unread
          </div>
        </div>

        <div className="card border-0 shadow-sm">

          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h5>All Notifications</h5>

              <button
                className="btn btn-sm btn-outline-success"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <FaCheckDouble /> Mark All as Read
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                {error}
                <button
                  className="btn btn-sm btn-primary ms-3"
                  onClick={fetchNotifications}
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length > 0 ? (

              notifications
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date) - new Date(a.date)
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`d-flex align-items-start gap-3 p-3 mb-3 rounded border ${
                      item.read ? "bg-white" : "bg-light"
                    }`}
                  >
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                      style={{
                        width: "45px",
                        height: "45px",
                        backgroundColor: "#e5f2fb",
                        fontSize: "20px",
                        color: "#087FC4"
                      }}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h6 className="fw-bold mb-1">
                          {item.title}
                        </h6>

                        {!item.read && (
                          <span className="badge bg-danger">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mb-2 text-muted">
                        {item.message}
                      </p>

                      <small className="text-secondary">
                        {item.date
                          ? new Date(item.date).toLocaleString("en-IN")
                          : ""}
                      </small>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      {!item.read && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Mark as read"
                          onClick={() => markRead(item.id)}
                        >
                          <FaCheckDouble />
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => deleteNotification(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))

            ) : (
              <div className="text-center py-5">
                <FaBell className="fs-1 text-secondary" />
                <h5 className="mt-3">You're all caught up!</h5>
                <p className="text-muted">
                  You have no notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notificationpage;
