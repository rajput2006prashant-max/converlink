import React, { useState } from "react";
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


const initialNotifications = [
  {
    id: 1,
    title: "Welcome to Converlink!",
    message: "Thank you for visiting Converlink Engineering Pvt. Ltd.",
    time: "Just now",
    type: "company",
    unread: true
  },
  {
    id: 2,
    title: "Service Update",
    message: "Our electrical installation and maintenance services are available.",
    time: "1 hour ago",
    type: "service",
    unread: true
  },
  {
    id: 3,
    title: "Enquiry Received",
    message: "Your enquiry details can be tracked through the contact section.",
    time: "Yesterday",
    type: "enquiry",
    unread: false
  },
  {
    id: 4,
    title: "Company News",
    message: "Explore our latest projects and engineering solutions.",
    time: "2 days ago",
    type: "news",
    unread: false
  }
];

function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const markAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false }))
    );
  };

  const markRead = (id) => {
    setNotifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "service":
        return <FaTools />;
      case "enquiry":
        return <FaUserCheck />;
      case "news":
        return <FaBullhorn />;
      default:
        return <FaEnvelope />;
    }
  };

  return (
    <div className="notification-page">
      <div className="container py-5">

        <Link to="/landing/home" className="notification-back">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="notification-heading">
          <div>
            <h2>
              <FaBell /> Notifications
            </h2>
            <p>Stay updated with Converlink Engineering.</p>
          </div>

          <div className="unread-count">
            {unreadCount} Unread
          </div>
        </div>

        <div className="notification-card">

          <div className="notification-toolbar">
            <h5>All Notifications</h5>

            <button
              className="mark-read-btn"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <FaCheckDouble /> Mark all as read
            </button>
          </div>

          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`notification-item ${
                  item.unread ? "unread" : ""
                }`}
              >
                <div className="notification-icon">
                  {getIcon(item.type)}
                </div>

                <div className="notification-details">
                  <div className="notification-title">
                    <h6>{item.title}</h6>
                    {item.unread && (
                      <span className="unread-dot"></span>
                    )}
                  </div>

                  <p>{item.message}</p>
                  <small>{item.time}</small>
                </div>

                <div className="notification-actions">
                  {item.unread && (
                    <button
                      title="Mark as read"
                      aria-label={`Mark ${item.title} as read`}
                      onClick={() => markRead(item.id)}
                    >
                      <FaCheckDouble />
                    </button>
                  )}

                  <button
                    title="Delete notification"
                    aria-label={`Delete ${item.title}`}
                    className="delete-notification"
                    onClick={() => deleteNotification(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <FaBell />
              <h5>You're all caught up!</h5>
              <p>You have no notifications.</p>
            </div>
          )}

          <div className="notification-footer">
            Showing your latest company updates.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Notifications;