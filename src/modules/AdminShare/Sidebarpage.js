
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
  FaUsers,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBuilding
} from "react-icons/fa";



function Sidebarpage() {
  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/adminlandingpage"
    },
    {
      title: "Manage Services",
      icon: <FaTools />,
      path: "ManageServices"
    },
    {
      title: "Manage Projects",
      icon: <FaProjectDiagram />,
      path: "ManageProject"
    },
    {
      title: "Enquiries",
      icon: <FaEnvelope />,
      path: "Enquiries "
    },
    {
      title: "Manage Users",
      icon: <FaUsers />,
      path: "ManageUser"
    },
    {
      title: "My Profile",
      icon: <FaUserCircle />,
      path: "MyProfile"
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "Settings"
    }
  ];

  return (
    <aside className="admin-sidebar"
      style={{
    width: "260px",
    backgroundColor: "#102D4F",
    position: "fixed",
    top: 98,
    left: 0,
    height: "100vh",
    color: "white",
    overflowY: "auto",
    zIndex: 1000
  }}>
      {/* Sidebar Heading */}
      <div className="sidebar-heading"
      >
        <FaBuilding className="sidebar-logo" />
        <div>
          <h5>Admin Panel</h5>
          <small>Converlink Engineering</small>
        </div>
      </div>

      {/* Menu Heading */}
      <p className="sidebar-label">MAIN MENU</p>

      {/* Navigation Menu */}
      <nav className="sidebar-menu"
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/landing"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Logout */}
      <div className="sidebar-bottom">
        <NavLink to="/admin-login" className="sidebar-link logout-link">
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </NavLink>

        <div className="sidebar-footer">
          <small>© 2026 Converlink Engineering</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebarpage;

