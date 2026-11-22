
import React from "react";
import { NavLink } from "react-router-dom";
import { useGlobalSettings } from "../../Context/SettingsContext";

import {
  FaBuilding,
  FaHome,
  FaUsers,
  FaUserShield,
  FaTools,
  FaProjectDiagram,
  FaClipboardList,
  FaShoppingCart,
  FaFileInvoice,
  FaReceipt,
  FaComments,
  FaBell,
  FaChartLine,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";



function AdminSidebar({ closeSidebar }) {

  const { theme, language } = useGlobalSettings();

  const isDark = theme === "dark";

  const translations = {
    English: {
      dashboard: "Dashboard",
      users: "Manage Users",
      admins: "Manage Admins",
      services: "Manage Services",
      projects: "Manage Projects",
      enquiries: "New Enquiries",
      orders: "Manage Orders",
      quotations: "Quotations",
      invoices: "Invoices",
      messages: "Messages",
      notifications: "Notifications",
      reports: "Reports",
      profile: "My Profile",
      settings: "Settings",
      logout: "Logout",
      menu: "MAIN MENU"
    },

    Hindi: {
      dashboard: "डैशबोर्ड",
      users: "यूजर्स प्रबंधित करें",
      admins: "एडमिन प्रबंधित करें",
      services: "सेवाएं प्रबंधित करें",
      projects: "प्रोजेक्ट प्रबंधित करें",
      enquiries: "नई पूछताछ",
      orders: "ऑर्डर प्रबंधित करें",
      quotations: "कोटेशन",
      invoices: "इनवॉइस",
      messages: "संदेश",
      notifications: "सूचनाएं",
      reports: "रिपोर्ट",
      profile: "मेरी प्रोफाइल",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      menu: "मुख्य मेनू"
    }
  };

  const t = translations[language] || translations.English;

  const menuItems = [
    {
      name: t.dashboard,
      path: "/adminlandingpage",
      icon: <FaHome />,
      end: true
    },
    {
      name: t.users,
      path: "/adminlandingpage/ManageUser",
      icon: <FaUsers />
    },
    {
      name: t.admins,
      path: "/adminlandingpage/ManageAdmin",
      icon: <FaUserShield />
    },
    {
      name: t.services,
      path: "/adminlandingpage/ManageServices",
      icon: <FaTools />
    },
    {
      name: t.projects,
      path: "/adminlandingpage/ManageProject",
      icon: <FaProjectDiagram />
    },
    {
      name: t.enquiries,
      path: "/adminlandingpage/Enquiries",
      icon: <FaClipboardList />
    },
    {
      name: t.orders,
      path: "/adminlandingpage/ManageOrder",
      icon: <FaShoppingCart />
    },
    {
      name: t.quotations,
      path: "/adminlandingpage/Quotations",
      icon: <FaFileInvoice />
    },
    {
      name: t.invoices,
      path: "/adminlandingpage/Invoices",
      icon: <FaReceipt />
    },
    {
      name: t.messages,
      path: "/adminlandingpage/Message",
      icon: <FaComments />
    },
    {
      name: t.notifications,
      path: "/adminlandingpage/Notification",
      icon: <FaBell />
    },
    {
      name: t.reports,
      path: "/adminlandingpage/reports",
      icon: <FaChartLine />
    },
    {
      name: t.profile,
      path: "/adminlandingpage/MyProfile",
      icon: <FaUser />
    },
    {
      name: t.settings,
      path: "/adminlandingpage/Settings",
      icon: <FaCog />
    }
  ];

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminLoginData");
    window.location.href = "/admin-login";
  };

  return (
    <aside
      className={`admin-sidebar ${isDark ? "dark-sidebar" : "light-sidebar"}`}
      style={{
        width: "260px",
        position: "fixed",
        top: "98px",
        left: 0,
        height: "calc(100vh - 98px)",
        overflowY: "auto",
        zIndex: 1000,
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* COMPANY BRAND */}
      <div className="sidebar-brand d-flex align-items-center gap-3 p-3">

        <FaBuilding className="brand-icon fs-3" />

        <div>
          <h5 className="mb-0 fw-bold">CONVERLINK</h5>
          <small>ENGINEERING PVT. LTD.</small>
        </div>

      </div>

      {/* MAIN MENU */}
      <div className="sidebar-heading px-3 py-2">
        {t.menu}
      </div>

      <div className="sidebar-menu px-2">

        {menuItems.map((item, index) => (

          <NavLink
            key={index}
            to={item.path}
            end={item.end || false}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>

          </NavLink>

        ))}

      </div>

      {/* LOGOUT */}
      <div className="sidebar-bottom mt-auto px-2">

        <button
          className="sidebar-link logout-btn w-100"
          onClick={handleLogout}
          type="button"
        >

          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>

          <span>{t.logout}</span>

        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;
