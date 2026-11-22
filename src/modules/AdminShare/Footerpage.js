
import React from "react";
import { Link } from "react-router-dom";
import { useGlobalSettings } from "../../Context/SettingsContext";

import {
  FaBuilding,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaArrowUp
} from "react-icons/fa";



function Footerpage() {

  const { theme, language, settings } = useGlobalSettings();

  const isDark = theme === "dark";

  const translations = {
    English: {
      description:
        "We provide reliable engineering solutions for electrical work, maintenance, installation and interior designing.",
      quickLinks: "Quick Links",
      dashboard: "Dashboard",
      services: "Services",
      projects: "Projects",
      enquiries: "Enquiries",
      adminPanel: "Admin Panel",
      users: "Manage Users",
      profile: "My Profile",
      settings: "Settings",
      logout: "Logout",
      contact: "Contact Information",
      country: "India",
      rights: "All rights reserved.",
      backToTop: "Back to Top"
    },

    Hindi: {
      description:
        "हम इलेक्ट्रिकल कार्य, रखरखाव, इंस्टॉलेशन और इंटीरियर डिजाइनिंग के लिए विश्वसनीय इंजीनियरिंग समाधान प्रदान करते हैं।",
      quickLinks: "महत्वपूर्ण लिंक",
      dashboard: "डैशबोर्ड",
      services: "सेवाएं",
      projects: "प्रोजेक्ट",
      enquiries: "पूछताछ",
      adminPanel: "एडमिन पैनल",
      users: "यूजर्स प्रबंधित करें",
      profile: "मेरी प्रोफाइल",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      contact: "संपर्क जानकारी",
      country: "भारत",
      rights: "सर्वाधिकार सुरक्षित।",
      backToTop: "ऊपर जाएं"
    }
  };

  const t = translations[language] || translations.English;

  const companyName =
    settings?.general?.websiteName || "CONVERLINK";

  const companyFullName =
    settings?.general?.companyName ||
    "Converlink Engineering Pvt. Ltd.";

  const email =
    settings?.general?.email || "Converlink@gmail.com";

  const phone =
    settings?.general?.phone || "+919015189096";

  const address =
    settings?.general?.address || t.country;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (

    <footer
      className={`admin-footer ${isDark ? "dark-footer" : "light-footer"}`}
    >

      {/* Main Footer */}
      <div className="container-fluid px-4 px-lg-5">

        <div className="row g-4 py-5">

          {/* Company Details */}
          <div className="col-md-6 col-lg-4">

            <div className="footer-brand">

              <FaBuilding className="footer-logo" />

              <div>
                <h5>{companyName}</h5>
                <span>ENGINEERING PVT. LTD.</span>
              </div>

            </div>

            <p className="footer-description">
              {t.description}
            </p>

            {/* Social Media */}
            <div className="footer-socials">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://www.whatsapp.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">

            <h6 className="footer-title">
              {t.quickLinks}
            </h6>

            <ul className="footer-links">

              <li>
                <Link to="/adminlandingpage">
                  {t.dashboard}
                </Link>
              </li>

              <li>
                <Link to="/adminlandingpage/ManageServices">
                  {t.services}
                </Link>
              </li>

              <li>
                <Link to="/adminlandingpage/ManageProject">
                  {t.projects}
                </Link>
              </li>

              <li>
                <Link to="/adminlandingpage/Enquiries">
                  {t.enquiries}
                </Link>
              </li>

            </ul>

          </div>

          {/* Admin Links */}
          <div className="col-6 col-lg-2">

            <h6 className="footer-title">
              {t.adminPanel}
            </h6>

            <ul className="footer-links">

              <li>
                <Link to="/adminlandingpage/ManageUser">
                  {t.users}
                </Link>
              </li>

              <li>
                <Link to="/adminlandingpage/MyProfile">
                  {t.profile}
                </Link>
              </li>

              <li>
                <Link to="/adminlandingpage/Settings">
                  {t.settings}
                </Link>
              </li>

              <li>
                <Link to="/admin-login">
                  {t.logout}
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact Details */}
          <div className="col-md-6 col-lg-4">

            <h6 className="footer-title">
              {t.contact}
            </h6>

            <div className="footer-contact">
              <FaEnvelope />
              <span>{email}</span>
            </div>

            <div className="footer-contact">
              <FaPhoneAlt />
              <span>{phone}</span>
            </div>

            <div className="footer-contact">
              <FaMapMarkerAlt />
              <span>{address}</span>
            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}
      <div className="footer-bottom">

        <div className="container-fluid px-4 px-lg-5 d-flex flex-wrap justify-content-between align-items-center gap-3">

          <p className="mb-0">
            © {new Date().getFullYear()} {companyFullName}.
            {" "}{t.rights}
          </p>

          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollToTop}
            aria-label={t.backToTop}
          >
            {t.backToTop} <FaArrowUp />
          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footerpage;
