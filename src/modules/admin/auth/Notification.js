
import React, { useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaTools,
  FaProjectDiagram,
  FaUserPlus,
  FaCheckDouble,
  FaTrash,
  FaCheck,
  FaFilter
} from "react-icons/fa";


const initialNotifications = [
  {
    id: 1,
    title: "New Enquiry Received",
    message: "A new customer has submitted an electrical work enquiry.",
    type: "Enquiry",
    time: "5 minutes ago",
    icon: "enquiry",
    read: false
  },
  {
    id: 2,
    title: "Project Updated",
    message: "The installation project status has been updated.",
    type: "Project",
    time: "30 minutes ago",
    icon: "project",
    read: false
  },
  {
    id: 3,
    title: "New User Registered",
    message: "A new user has registered on the company website.",
    type: "User",
    time: "1 hour ago",
    icon: "user",
    read: false
  },
  {
    id: 4,
    title: "Maintenance Request",
    message: "A customer has requested a maintenance service.",
    type: "Enquiry",
    time: "3 hours ago",
    icon: "tools",
    read: true
  },
  {
    id: 5,
    title: "Project Completed",
    message: "An interior designing project has been marked as completed.",
    type: "Project",
    time: "Yesterday",
    icon: "project",
    read: true
  }
];

function AdminNotification() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");
  const [showUnread, setShowUnread] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType =
      filter === "All" || notification.type === filter;

    const matchesRead = !showUnread || !notification.read;

    return matchesType && matchesRead;
  });

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  const getIcon = (icon) => {
    switch (icon) {
      case "enquiry":
        return <FaEnvelope />;
      case "project":
        return <FaProjectDiagram />;
      case "user":
        return <FaUserPlus />;
      default:
        return <FaTools />;
    }
  };

  return (
    <div className="admin-notification-page">
      <div className="notification-heading">
        <div>
          <h2>Notifications</h2>
          <p>Stay updated with your company activities.</p>
        </div>

        <button
          className="notification-mark-all"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <FaCheckDouble /> Mark All as Read
        </button>
      </div>

      <div className="notification-stats">
        <div className="notification-stat-card">
          <div className="notification-stat-icon total">
            <FaBell />
          </div>
          <div>
            <span>Total Notifications</span>
            <h3>{notifications.length}</h3>
          </div>
        </div>

        <div className="notification-stat-card">
          <div className="notification-stat-icon unread">
            <FaEnvelope />
          </div>
          <div>
            <span>Unread Notifications</span>
            <h3>{unreadCount}</h3>
          </div>
        </div>

        <div className="notification-stat-card">
          <div className="notification-stat-icon read">
            <FaCheck />
          </div>
          <div>
            <span>Read Notifications</span>
            <h3>{notifications.length - unreadCount}</h3>
          </div>
        </div>
      </div>

      <div className="notification-panel">
        <div className="notification-panel-header">
          <div>
            <h3>Recent Activity</h3>
            <p>You have {unreadCount} unread notifications.</p>
          </div>

          <div className="notification-filters">
            <FaFilter />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter notification type"
            >
              <option value="All">All Types</option>
              <option value="Enquiry">Enquiries</option>
              <option value="Project">Projects</option>
              <option value="User">Users</option>
            </select>

            <button
              className={showUnread ? "unread-filter active" : "unread-filter"}
              onClick={() => setShowUnread(!showUnread)}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="notification-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "is-read" : "is-unread"
                }`}
              >
                <div className={`notification-item-icon ${notification.icon}`}>
                  {getIcon(notification.icon)}
                </div>

                <div className="notification-item-content">
                  <div className="notification-title-row">
                    <h4>{notification.title}</h4>
                    {!notification.read && (
                      <span className="notification-new-badge">New</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <span>{notification.type}</span>
                    <span>{notification.time}</span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      title="Mark as read"
                      aria-label={`Mark ${notification.title} as read`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <FaCheck />
                    </button>
                  )}

                  <button
                    className="notification-delete"
                    title="Delete notification"
                    aria-label={`Delete ${notification.title}`}
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="notification-empty">
              <FaBell />
              <h4>No notifications found</h4>
              <p>Try changing your filter to see other notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNotification;
