
import React from "react";
import { Link } from "react-router-dom";
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
  return (
    <header
      className="shadow"
      style={{
        backgroundColor: "#102D4F",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container-fluid px-4">

          {/* Company Logo */}
          <Link
            to="/landing"
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

          {/* Admin Actions */}
          <div className="d-flex align-items-center gap-3">

            {/* Search */}
            <form
              className="input-group d-none d-md-flex"
              style={{ maxWidth: "230px" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
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

            {/* Notifications */}
            <Link
              to="Notification"
              className="text-white position-relative"
              title="Notifications"
            >
              <FaBell size={21} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Link>

            {/* Messages */}
            <Link
              to="Message"
              className="text-white position-relative"
              title="Messages"
            >
              <FaEnvelope size={21} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark">
                2
              </span>
            </Link>

            {/* Admin Dropdown */}
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
                Admin
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <h6 className="dropdown-header">
                    Admin Panel
                  </h6>
                </li>

                <li>
                  <Link className="dropdown-item py-2" to="/adminlandingpage">
                    <FaTachometerAlt className="me-2" />
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item py-2" to="MyProfile">
                    <FaUser className="me-2" />
                    My Profile
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item py-2" to="Settings">
                    <FaCog className="me-2" />
                    Settings
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <Link className="dropdown-item py-2 text-danger" to="/admin-login">
                    <FaSignOutAlt className="me-2" />
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
