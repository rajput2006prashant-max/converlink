
import React, { useState } from "react";
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
  FaBuilding,
  FaChevronDown
} from "react-icons/fa";

function Sidebarpage() {

  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const menuItems = [
    {
      title: "Manage Services",
      icon: <FaTools />,
      key: "services",
      children: [
        { title: "Add Services", path: "ManageServices" },
        { title: "View Services", path: "ManageServices" }
      ]
    },
    {
      title: "Manage Projects",
      icon: <FaProjectDiagram />,
      key: "projects",
      children: [
        { title: "Total Projects", path: "ManageProject" },
        { title: "Pending Projects", path: "ManageProject" },
        { title: "In Progress", path: "ManageProject" },
        { title: "Completed Projects", path: "ManageProject" },
        { title: "Cancelled Projects", path: "ManageProject" }
      ]
    },
    {
      title: "Enquiries",
      icon: <FaEnvelope />,
      key: "enquiries",
      children: [
        { title: "New Enquiries", path: "Enquiries" },
        { title: "Approved Enquiries", path: "Enquiries" }
      ]
    },
    {
      title: "Manage Users",
      icon: <FaUsers />,
      key: "users",
      children: [
        { title: "All Users", path: "ManageUser" },
        { title: "Active Users", path: "ManageUser" }
      ]
    }
  ];

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: "260px",
        backgroundColor: "#102D4F",
        position: "fixed",
        top: "98px",
        left: 0,
        height: "calc(100vh - 98px)",
        color: "white",
        overflowY: "auto",
        zIndex: 1000,
        paddingBottom: "20px"
      }}
    >

      {/* Sidebar Heading */}
      <div className="sidebar-heading">
        <FaBuilding className="sidebar-logo bg-primary" />

        <div>
          <h5>Admin Panel</h5>
          <small>Converlink Engineering</small>
        </div>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-menu">

        {/* Dashboard */}
        <NavLink
          to="/adminlandingpage"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <FaTachometerAlt />
          </span>
          <span>Dashboard</span>
        </NavLink>

        {/* Dropdown Menus */}
        {menuItems.map((item) => (

          <div key={item.key}>

            <button
              type="button"
              onClick={() => toggleMenu(item.key)}
              className="sidebar-link w-100 border-0 text-start"
              style={{
                backgroundColor:
                  openMenu === item.key ? "#087FC4" : "transparent",
                color: "white",
                cursor: "pointer"
              }}
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>{item.title}</span>

              <FaChevronDown
                className="ms-auto"
                style={{
                  transform:
                    openMenu === item.key
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition: "0.3s"
                }}
              />

            </button>

            {/* Dropdown Submenu */}
            {openMenu === item.key && (

              <div
                style={{
                  backgroundColor: "#173C60",
                  padding: "5px 0"
                }}
              >

                {item.children.map((child, index) => (

                  <NavLink
                    key={index}
                    to={child.path}
                    className="sidebar-link"
                    style={{
                      paddingLeft: "55px",
                      fontSize: "13px"
                    }}
                  >
                    {child.title}
                  </NavLink>

                ))}

              </div>

            )}

          </div>

        ))}

        {/* My Profile */}
        <NavLink
          to="MyProfile"
          className="sidebar-link"
        >
          <span className="sidebar-icon">
            <FaUserCircle />
          </span>
          <span>My Profile</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="Settings"
          className="sidebar-link"
        >
          <span className="sidebar-icon">
            <FaCog />
          </span>
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">

        <NavLink
          to="/admin-login"
          className="sidebar-link logout-link"
        >
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
