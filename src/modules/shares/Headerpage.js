
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  FaBuilding,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUserCircle
} from "react-icons/fa";

import { useGlobalSettings } from "../../Context/SettingsContext";

function Headerpage() {
  const { theme, language, settings } = useGlobalSettings();

  const isDark = theme === "dark";
  const isHindi = language === "Hindi";

  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Logged-in User Details
  const userData = JSON.parse(
    localStorage.getItem("userLoginData") || "{}"
  );

  const userId = userData.userId || userData.id;

  const companyName =
    settings?.general?.websiteName || "CONVERLINK";

  const subtitle =
    settings?.general?.companyName ||
    "Converlink Engineering Pvt. Ltd.";

  const text = {
    account: isHindi ? "खाता" : "Account",
    search: isHindi ? "खोजें..." : "Search...",
    notifications: isHindi ? "सूचनाएं" : "Notifications",
    messages: isHindi ? "संदेश" : "Messages",
    userLogin: isHindi ? "यूजर लॉगिन" : "User Login",
    profile: isHindi ? "मेरी प्रोफाइल" : "My Profile",
    dashboard: isHindi ? "डैशबोर्ड" : "Dashboard",
    settings: isHindi ? "सेटिंग्स" : "Settings",
    logout: isHindi ? "लॉगआउट" : "Logout"
  };

  // Header Colors
  const headerColor = isDark ? "#101820" : "#102D4F";
  const inputColor = isDark ? "#263449" : "#ffffff";

  // Fetch Unread Messages
  useEffect(() => {
    if (!userId) {
      setMessageCount(0);
      return;
    }

    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8700/messages",
          { params: { userId } }
        );

        const unreadMessages = response.data.filter((msg) => {
          const isCurrentUser =
            String(msg.userId) === String(userId);

          const isAdminMessage =
            String(msg.sender).trim().toLowerCase() === "admin";

          const isUnread = msg.status
            ? String(msg.status).trim().toLowerCase() !== "seen"
            : msg.read === false;

          return isCurrentUser && isAdminMessage && isUnread;
        });

        setMessageCount(unreadMessages.length);

      } catch (error) {
        console.log("Unread Message Error:", error);
      }
    };

    fetchUnreadMessages();

    const interval = setInterval(fetchUnreadMessages, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  // Fetch Unread Notifications
  useEffect(() => {
    if (!userId) {
      setNotificationCount(0);
      return;
    }

    const fetchUnreadNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8700/notifications",
          { params: { userId } }
        );

        const unreadNotifications = response.data.filter(
          (notification) =>
            String(notification.userId) === String(userId) &&
            notification.read === false
        );

        setNotificationCount(unreadNotifications.length);

      } catch (error) {
        console.log("Unread Notification Error:", error);
      }
    };

    fetchUnreadNotifications();

    const interval = setInterval(
      fetchUnreadNotifications,
      3000
    );

    return () => clearInterval(interval);
  }, [userId]);

  // Mark Messages as Seen
  const handleMessagesClick = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        "http://localhost:8700/messages",
        { params: { userId } }
      );

      const unreadMessages = response.data.filter((msg) => {
        return (
          String(msg.userId) === String(userId) &&
          String(msg.sender).trim().toLowerCase() === "admin" &&
          (
            msg.status
              ? String(msg.status).trim().toLowerCase() !== "seen"
              : msg.read === false
          )
        );
      });

      setMessageCount(0);

      await Promise.all(
        unreadMessages.map((msg) =>
          axios.patch(
            `http://localhost:8700/messages/${msg.id}`,
            {
              status: "seen",
              read: true
            }
          )
        )
      );

    } catch (error) {
      console.log("Mark Message Seen Error:", error);
    }
  };

  // Mark Notifications as Read
  const handleNotificationsClick = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        "http://localhost:8700/notifications",
        { params: { userId } }
      );

      const unreadNotifications = response.data.filter(
        (notification) =>
          String(notification.userId) === String(userId) &&
          notification.read === false
      );

      setNotificationCount(0);

      await Promise.all(
        unreadNotifications.map((notification) =>
          axios.patch(
            `http://localhost:8700/notifications/${notification.id}`,
            { read: true }
          )
        )
      );

    } catch (error) {
      console.log("Mark Notification Read Error:", error);
    }
  };

  return (
    <header
      className="shadow"
      style={{
        backgroundColor: headerColor,
        position: "sticky",
        top: 0,
        zIndex: 999,
        transition: "0.3s"
      }}
    >
      <nav
        className="navbar"
        style={{ backgroundColor: headerColor }}
      >
        <div className="container-fluid px-4">

          {/* Company Logo */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          >
            <FaBuilding
              style={{
                color: "#38C8F5",
                fontSize: "32px"
              }}
            />

            <span>
              {companyName}
              <small className="d-block text-white-50">
                {subtitle}
              </small>
            </span>
          </Link>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3 gap-md-4">

            {/* Search */}
            <div
              className="input-group"
              style={{ maxWidth: "220px" }}
            >
              <input
                type="text"
                className="form-control border-0"
                placeholder={text.search}
                style={{
                  backgroundColor: inputColor,
                  color: isDark ? "#ffffff" : "#212529"
                }}
              />

              <span
                className="input-group-text border-0"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
              >
                <FaSearch />
              </span>
            </div>

            {/* Notifications */}
            <Link
              to="/landing/notification"
              onClick={handleNotificationsClick}
              className="position-relative text-white"
              title={text.notifications}
            >
              <FaBell size={21} />

              {notificationCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "11px",
                    minWidth: "19px"
                  }}
                >
                  {notificationCount > 99
                    ? "99+"
                    : notificationCount}
                </span>
              )}
            </Link>

            {/* Messages */}
            <Link
              to="/landing/message"
              onClick={handleMessagesClick}
              className="position-relative text-white"
              title={text.messages}
            >
              <FaEnvelope size={21} />

              {messageCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "11px",
                    minWidth: "19px"
                  }}
                >
                  {messageCount > 99
                    ? "99+"
                    : messageCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="dropdown">
              <button
                className="btn dropdown-toggle fw-semibold"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCircle className="me-2" />
                {text.account}
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#475569" : "#dee2e6"
                }}
              >
                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{
                      color: isDark ? "blue" : "#212529"
                    }}
                    to="/landing/user-login"
                  >
                    <FaUserCircle className="me-2 text-primary" />
                    {text.userLogin}
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{
                      color: isDark ? "blue" : "#212529"
                    }}
                    to="/landing/profile"
                  >
                    {text.profile}
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{
                      color: isDark ? "blue" : "#212529"
                    }}
                    to="/landing"
                  >
                    {text.dashboard}
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{
                      color: isDark ? "blue" : "#212529"
                    }}
                    to="/landing/setting"
                  >
                    {text.settings}
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2 text-danger"
                    to="/"
                  >
                    {text.logout}
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}

export default Headerpage;
