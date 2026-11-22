
import React from "react";
import { Link } from "react-router-dom";
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

  const companyName = settings?.general?.websiteName || "CONVERLINK";
  const subtitle = settings?.general?.companyName || "Converlink Engineering Pvt. Ltd.";

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

  const headerColor = isDark ? "#101820" : "#102D4F";
  const inputColor = isDark ? "#263449" : "#ffffff";

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
            <FaBuilding style={{ color: "#38C8F5", fontSize: "32px" }} />

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
            <div className="input-group" style={{ maxWidth: "220px" }}>
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
              className="position-relative text-white"
              title={text.notifications}
            >
              <FaBell size={21} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                3
              </span>
            </Link>

            {/* Messages */}
            <Link
              to="/landing/message"
              className="position-relative text-white"
              title={text.messages}
            >
              <FaEnvelope size={21} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                2
              </span>
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
                    style={{ color: isDark ? "#ffffff" : "#212529" }}
                    to="/landing/user-login"
                  >
                    <FaUserCircle className="me-2 text-primary" />
                    {text.userLogin}
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{ color: isDark ? "#ffffff" : "#212529" }}
                    to="/landing/profile"
                  >
                    {text.profile}
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{ color: isDark ? "#ffffff" : "#212529" }}
                    to="/landing"
                  >
                    {text.dashboard}
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    style={{ color: isDark ? "#ffffff" : "#212529" }}
                    to="/landing/setting"
                  >
                    {text.settings}
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

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
