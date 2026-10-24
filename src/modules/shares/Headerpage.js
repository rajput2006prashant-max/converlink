
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUserCircle
} from "react-icons/fa";

function Headerpage() {
  return (
    <header
      className="shadow"
      style={{
        backgroundColor: "#102D4F",
        position: "sticky",
        top: 0,
        zIndex: 999
      }}
    >
      <nav className="navbar">
        <div className="container-fluid px-4">

          {/* Company Logo */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          >
            <FaBuilding
              style={{ color: "#38C8F5", fontSize: "32px" }}
            />

            <span>
              CONVERLINK
              <small className="d-block text-white-50">
                ENGINEERING PVT. LTD.
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
                placeholder="Search..."
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
              to="notification"
              className="position-relative text-white"
              title="Notifications"
            >
              <FaBell size={21} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
              >
                3
              </span>
            </Link>

            {/* Messages */}
            <Link
              to="message"
              className="position-relative text-white"
              title="Messages"
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
                Account
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow border-0">

                {/* User Login */}
                <li>
                  <Link className="dropdown-item py-2" to="/user-login">
                    <FaUserCircle className="me-2 text-primary" />
                    User Login
                  </Link>
                </li>

                {/* User Register */}
             
                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* Profile */}
                <li>
                  <Link className="dropdown-item py-2" to="profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/landing">
                    Dashboard
                  </Link>
                </li>
                

                {/* Settings */}
                <li>
                  <Link className="dropdown-item py-2" to="setting">
                    Settings
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* Logout */}
                <li>
                  <Link className="dropdown-item py-2 text-danger" to="/">
                    Logout
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
