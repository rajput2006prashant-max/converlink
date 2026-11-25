
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
  FaArrowLeft,
  FaTimes
} from "react-icons/fa";

const API = "http://localhost:8700/notifications";

function Notificationpage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  const userId = String(
    loginData?.userId || loginData?.id || ""
  );

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(API);

      const userNotifications = response.data.filter(
        (item) => String(item.userId) === userId
      );

      setNotifications(userNotifications);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Notifications load nahi ho pa rahi hain.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark Single Notification as Read
  const markRead = async (id) => {
    try {
      await axios.patch(
        `${API}/${encodeURIComponent(id)}`,
        { read: true }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, read: true }
            : item
        )
      );

      setSelectedNotification((prev) =>
        prev && String(prev.id) === String(id)
          ? { ...prev, read: true }
          : prev
      );
    } catch (err) {
      console.error("Read Error:", err);
      alert("Notification read nahi hui.");
    }
  };

  // Open Notification
  const openNotification = async (item) => {
    setSelectedNotification(item);

    if (item.read !== true) {
      await markRead(item.id);
    }
  };

  // Mark All as Read
  const markAllRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (item) => item.read !== true
      );

      await Promise.all(
        unreadNotifications.map((item) =>
          axios.patch(
            `${API}/${encodeURIComponent(item.id)}`,
            { read: true }
          )
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

  // Delete Notification
  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap notification delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/${encodeURIComponent(id)}`
      );

      setNotifications((prev) =>
        prev.filter((item) => String(item.id) !== String(id))
      );

      if (
        selectedNotification &&
        String(selectedNotification.id) === String(id)
      ) {
        setSelectedNotification(null);
      }
    } catch (err) {
      console.error(err);
      alert("Notification delete nahi hui.");
    }
  };

  // Unread Count
  const unreadCount = notifications.filter(
    (item) => item.read !== true
  ).length;

  // Notification Icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "service":
        return <FaTools />;

      case "message":
        return <FaEnvelope />;

      case "user":
        return <FaUserCheck />;

      case "announcement":
        return <FaBullhorn />;

      default:
        return <FaBell />;
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            <FaBell className="me-2 text-primary" />
            My Notifications
          </h3>

          <p className="text-muted mb-0">
            Manage all your notifications here.
          </p>
        </div>

        <Link
          to="/landing/home"
          className="btn btn-outline-primary"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Link>

      </div>

      {/* Notification Summary */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <h5 className="fw-bold mb-1">
              All Notifications
            </h5>

            <span className="text-primary">
              Total: {notifications.length} |
              Unread: {unreadCount}
            </span>
          </div>

          <button
            className="btn btn-primary"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <FaCheckDouble className="me-2" />
            Mark All as Read
          </button>

        </div>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaBell size={40} className="text-primary mb-3" />

            <h5>No Notifications Found</h5>

            <p className="text-muted mb-0">
              You don't have any notifications yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">

          {notifications.map((item) => (
            <div
              key={item.id}
              className={`card border-0 shadow-sm ${
                item.read ? "bg-white" : "bg-dark text-white"
              }`}
            >
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

                  <div
                    className="d-flex gap-3 flex-grow-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => openNotification(item)}
                  >

                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        item.read
                          ? "bg-primary text-white"
                          : "bg-info text-dark"
                      }`}
                      style={{
                        width: "45px",
                        height: "45px",
                        minWidth: "45px"
                      }}
                    >
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="flex-grow-1">

                      <div className="d-flex align-items-center flex-wrap gap-2">

                        <h6 className="fw-bold mb-1 ">
                          {item.title || "Notification"}
                        </h6>

                        {!item.read && (
                          <span className="badge bg-danger ">
                            New
                          </span>
                        )}

                      </div>

                      <p
                        className={`mb-2 ${
                          item.read ? "text-primary" : "text-white-50"
                        }`}
                      >
                        {item.message}
                      </p>

                      <small
                        className={
                          item.read ? "text-primary" : "text-white-50"
                        }
                      >
                        {item.date || item.createdAt || ""}
                      </small>

                    </div>
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => openNotification(item)}
                    >
                      <FaCheckDouble className="me-1" />
                      Read
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteNotification(item.id)}
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Notification Detail Popup */}
      {selectedNotification && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
            zIndex: 1055
          }}
          tabIndex="-1"
          onClick={() => setSelectedNotification(null)}
        >

          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-content border-0 shadow">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <FaBell className="text-primary me-2" />
                  Notification Details
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setSelectedNotification(null)}
                ></button>
              </div>

              <div className="modal-body">

                <h5 className="fw-bold mb-3 ">
                  {selectedNotification.title || "Notification"}
                </h5>

                <p className="mb-3 ">
                  {selectedNotification.message}
                </p>

                <small className="text-muted d-block mb-3">
                  {selectedNotification.date ||
                    selectedNotification.createdAt ||
                    ""}
                </small>

                <span className="badge bg-success ">
                  <FaCheckDouble className="me-1" />
                  Read
                </span>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedNotification(null)}
                >
                  <FaTimes className="me-1" />
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Notificationpage;
