
import React from "react";
import { Link } from "react-router-dom";
import { useGlobalSettings } from "../../Context/SettingsContext";

export default function Sidebar() {
  const { theme, language } = useGlobalSettings();

  const isDark = theme === "dark";
  const isHindi = language === "Hindi";

  const sidebarColor = isDark ? "#101820" : "#102D4F";
  const textColor = "#ffffff";

  const text = {
    home: isHindi ? "होम" : "Home",
    overview: isHindi ? "अवलोकन" : "Overview",
    about: isHindi ? "हमारे बारे में" : "About",
    contact: isHindi ? "संपर्क करें" : "Contact Us",
    dashboard: isHindi ? "डैशबोर्ड" : "Dashboard",
    services: isHindi ? "सेवाएं देखें" : "Explore Services",
    projects: isHindi ? "मेरे प्रोजेक्ट" : "My Projects",
    props: "Props",
    activity: isHindi ? "हाल की गतिविधियां" : "Recent Activity",
    orders: isHindi ? "ऑर्डर" : "Orders",
    enquiry: isHindi ? "नई पूछताछ" : "New Enquiry",
    totalProject: isHindi ? "कुल प्रोजेक्ट" : "Total Project",
    pending: isHindi ? "लंबित ऑर्डर" : "Pending Orders",
    progress: isHindi ? "प्रगति पर" : "In Progress",
    completed: isHindi ? "पूरे हुए प्रोजेक्ट" : "Completed Project",
    cancelled: isHindi ? "रद्द प्रोजेक्ट" : "Cancelled Project",
    account: isHindi ? "अकाउंट" : "Account",
    profile: isHindi ? "मेरी प्रोफाइल" : "My Profile",
    messages: isHindi ? "मेरे संदेश" : "My Messages",
    notifications: isHindi ? "सूचनाएं" : "Notifications",
    settings: isHindi ? "सेटिंग्स" : "Settings",
    logout: isHindi ? "लॉगआउट" : "Logout"
  };

  const buttonStyle = {
    color: textColor,
    backgroundColor: "transparent",
    border: "none"
  };

  const linkStyle = {
    display: "block",
    color: "#ffffff",
    textDecoration: "none",
    padding: "9px 15px",
    borderRadius: "6px"
  };

  return (
    <div
      className={`user-sidebar ${isDark ? "user-sidebar-dark" : "user-sidebar-light"}`}
      style={{
        width: "262px",
        height: "calc(100vh - 84px)",
        position: "fixed",
        top: "84px",
        left: 0,
        backgroundColor: sidebarColor,
        color: textColor,
        overflowY: "auto",
        zIndex: 1000,
        transition: "background-color 0.3s ease"
      }}
    >
      <div className="p-3">

        {/* Logo */}
        <Link
          to="/"
          className="d-flex align-items-center pb-3 mb-3 text-decoration-none border-bottom border-secondary"
          style={{ color: textColor }}
        >
          <span className="fs-5 fw-bold">CONVERLINK</span>
        </Link>

        <ul className="list-unstyled ps-0">

          {/* Home */}
          <li className="mb-2">
            <button
              className="btn btn-toggle w-100 text-start"
              style={buttonStyle}
              data-bs-toggle="collapse"
              data-bs-target="#home-collapse"
              aria-expanded="true"
            >
              {text.home}
            </button>

            <div className="collapse show" id="home-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                <li><Link to="/" style={linkStyle}>{text.overview}</Link></li>
                <li><Link to="about" style={linkStyle}>{text.about}</Link></li>
                <li><Link to="contact" style={linkStyle}>{text.contact}</Link></li>
              </ul>
            </div>
          </li>

          {/* Dashboard */}
          <li className="mb-2">
            <button
              className="btn btn-toggle w-100 text-start collapsed"
              style={buttonStyle}
              data-bs-toggle="collapse"
              data-bs-target="#dashboard-collapse"
              aria-expanded="false"
            >
              {text.dashboard}
            </button>

            <div className="collapse" id="dashboard-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                <li><Link to="/landing" style={linkStyle}>{text.overview}</Link></li>
                <li><Link to="services" style={linkStyle}>{text.services}</Link></li>
                <li><Link to="project" style={linkStyle}>{text.projects}</Link></li>
                <li><Link to="props" style={linkStyle}>{text.props}</Link></li>
                <li><Link to="*" style={linkStyle}>{text.activity}</Link></li>
              </ul>
            </div>
          </li>

          {/* Orders */}
          <li className="mb-2">
            <button
              className="btn btn-toggle w-100 text-start collapsed"
              style={buttonStyle}
              data-bs-toggle="collapse"
              data-bs-target="#orders-collapse"
              aria-expanded="false"
            >
              {text.orders}
            </button>

            <div className="collapse" id="orders-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                <li><Link to="newenquiry" style={linkStyle}>{text.enquiry}</Link></li>
                <li><Link to="totalproject" style={linkStyle}>{text.totalProject}</Link></li>
                <li><Link to="pendingorders" style={linkStyle}>{text.pending}</Link></li>
                <li><Link to="inprogress" style={linkStyle}>{text.progress}</Link></li>
                <li><Link to="completedproject" style={linkStyle}>{text.completed}</Link></li>
                <li><Link to="cancelledproject" style={linkStyle}>{text.cancelled}</Link></li>
              </ul>
            </div>
          </li>

          {/* Account */}
          <li className="mb-2">
            <button
              className="btn btn-toggle w-100 text-start collapsed"
              style={buttonStyle}
              data-bs-toggle="collapse"
              data-bs-target="#account-collapse"
              aria-expanded="false"
            >
              {text.account}
            </button>

            <div className="collapse" id="account-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                <li><Link to="profile" style={linkStyle}>{text.profile}</Link></li>
                <li><Link to="message" style={linkStyle}>{text.messages}</Link></li>
                <li><Link to="notification" style={linkStyle}>{text.notifications}</Link></li>
                <li><Link to="setting" style={linkStyle}>{text.settings}</Link></li>
                <li><Link to="/" style={linkStyle}>{text.logout}</Link></li>
              </ul>
            </div>
          </li>

        </ul>
      </div>
    </div>
  );
}
