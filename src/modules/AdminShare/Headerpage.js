
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGlobalSettings } from "../../Context/SettingsContext";

import {
  FaBuilding,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaUser,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt
} from "react-icons/fa";

function Headerpage() {

  const { theme, language } = useGlobalSettings();

  const isDark = theme === "dark";

  // Badge Counts
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Language
  const text = {
    English: {
      search: "Search...",
      admin: "Admin",
      notifications: "Notifications",
      messages: "Messages",
      panel: "Admin Panel",
      dashboard: "Dashboard",
      profile: "My Profile",
      settings: "Settings",
      logout: "Logout"
    },

    Hindi: {
      search: "खोजें...",
      admin: "एडमिन",
      notifications: "सूचनाएं",
      messages: "संदेश",
      panel: "एडमिन पैनल",
      dashboard: "डैशबोर्ड",
      profile: "मेरी प्रोफाइल",
      settings: "सेटिंग्स",
      logout: "लॉगआउट"
    }
  };

  const t = text[language] || text.English;

  // FETCH MESSAGE AND NOTIFICATION COUNT
  useEffect(() => {

    const fetchBadgeCounts = async () => {

      try {

        const [messageRes, notificationRes] = await Promise.all([
          axios.get("http://localhost:8700/messages"),
          axios.get("http://localhost:8700/notifications")
        ]);

        // Check API Data
        console.log("ALL MESSAGES:", messageRes.data);
        console.log("ALL NOTIFICATIONS:", notificationRes.data);

        // USER UNREAD MESSAGES
        const unreadMessages = messageRes.data.filter((item) => {

          return (
            String(item.sender).trim().toLowerCase() === "user" &&
            String(item.status).trim().toLowerCase() !== "seen"
          );

        });

        // UNREAD NOTIFICATIONS
        const unreadNotifications = notificationRes.data.filter(
          (item) => item.read === false
        );

        // Update Counts
        setMessageCount(unreadMessages.length);
        setNotificationCount(unreadNotifications.length);

        console.log("Unread Messages:", unreadMessages.length);
        console.log("Unread Notifications:", unreadNotifications.length);

      } catch (error) {

        console.log("Badge Count Error:", error);

      }

    };

    fetchBadgeCounts();

    // AUTO UPDATE EVERY 5 SECONDS
    const interval = setInterval(fetchBadgeCounts, 5000);

    return () => clearInterval(interval);

  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminLoginData");
    window.location.href = "/admin-login";
  };

  return (

    <header
      className={`shadow admin-header ${
        isDark ? "dark-header" : "light-header"
      }`}
    >

      <nav className="navbar navbar-expand-lg py-3">

        <div className="container-fluid px-4">

          {/* COMPANY LOGO */}

          <Link
            to="/landing"
            className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          >

            <FaBuilding
              style={{
                color: "#38C8F5",
                fontSize: "32px"
              }}
            />

            <span>
              CONVERLINK

              <small className="d-block text-white-50">
                ENGINEERING PVT. LTD.
              </small>

            </span>

          </Link>


          {/* ADMIN ACTIONS */}

          <div className="d-flex align-items-center gap-3">

            {/* SEARCH */}

            <form
              className="input-group d-none d-md-flex"
              style={{ maxWidth: "230px" }}
              onSubmit={(e) => e.preventDefault()}
            >

              <input
                type="search"
                className="form-control header-search"
                placeholder={t.search}
                aria-label="Search"
              />

              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
              >
                <FaSearch />
              </button>

            </form>


            {/* NOTIFICATIONS */}

            <Link
              to="Notification"
              className="text-white position-relative"
              title={t.notifications}
            >

              <FaBell size={21} />

              {notificationCount > 0 && (

                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notificationCount}
                </span>

              )}

            </Link>


            {/* MESSAGES */}

            <Link
              to="Message"
              className="text-white position-relative"
              title={t.messages}
            >

              <FaEnvelope size={21} />

              {messageCount > 0 && (

                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                  {messageCount}
                </span>

              )}

            </Link>


            {/* ADMIN DROPDOWN */}

            <div className="dropdown">

              <button
                className="btn dropdown-toggle fw-semibold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
              >

                <FaUserCircle className="me-2" />

                {t.admin}

              </button>


              <ul
                className={`dropdown-menu dropdown-menu-end shadow border-0 ${
                  isDark ? "dark-dropdown" : ""
                }`}
              >

                <li>
                  <h6 className="dropdown-header">
                    {t.panel}
                  </h6>
                </li>


                <li>

                  <Link
                    className="dropdown-item py-2"
                    to="/adminlandingpage"
                  >

                    <FaTachometerAlt className="me-2" />

                    {t.dashboard}

                  </Link>

                </li>


                <li>

                  <Link
                    className="dropdown-item py-2"
                    to="MyProfile"
                  >

                    <FaUser className="me-2" />

                    {t.profile}

                  </Link>

                </li>


                <li>

                  <Link
                    className="dropdown-item py-2"
                    to="Settings"
                  >

                    <FaCog className="me-2" />

                    {t.settings}

                  </Link>

                </li>


                <li>
                  <hr className="dropdown-divider" />
                </li>


                <li>

                  <button
                    className="dropdown-item py-2 text-danger"
                    type="button"
                    onClick={handleLogout}
                  >

                    <FaSignOutAlt className="me-2" />

                    {t.logout}

                  </button>

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
