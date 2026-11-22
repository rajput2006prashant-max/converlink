
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";

import { useGlobalSettings } from "../../Context/SettingsContext";

function Footerpage() {
  const { theme, language } = useGlobalSettings();

  const isDark = theme === "dark";
  const isHindi = language === "Hindi";

  const footerColor = isDark ? "#101827" : "#102D4F";
  const bottomColor = isDark ? "#080f1c" : "#0A2038";

  const text = {
    description: isHindi
      ? "इलेक्ट्रिकल कार्य, रखरखाव, इंस्टॉलेशन और इंटीरियर डिजाइनिंग के लिए आपका विश्वसनीय साथी।"
      : "Your trusted partner for electrical work, maintenance, installation and interior designing solutions.",

    quickLinks: isHindi ? "महत्वपूर्ण लिंक" : "Quick Links",
    home: isHindi ? "होम" : "Home",
    services: isHindi ? "सेवाएं" : "Services",
    projects: isHindi ? "प्रोजेक्ट" : "Projects",
    contact: isHindi ? "संपर्क करें" : "Contact",

    ourServices: isHindi ? "हमारी सेवाएं" : "Our Services",
    electrical: isHindi ? "इलेक्ट्रिकल कार्य" : "Electrical Work",
    maintenance: isHindi ? "रखरखाव" : "Maintenance",
    installation: isHindi ? "इंस्टॉलेशन" : "Installation",
    interior: isHindi ? "इंटीरियर डिजाइनिंग" : "Interior Designing",

    contactUs: isHindi ? "हमसे संपर्क करें" : "Contact Us",

    rights: isHindi
      ? "सर्वाधिकार सुरक्षित।"
      : "All rights reserved.",

    tagline: isHindi
      ? "गुणवत्तापूर्ण कार्य। विश्वसनीय समाधान।"
      : "Quality Work. Trusted Solutions."
  };

  const headingStyle = {
    color: "#ffffff"
  };

  const paragraphStyle = {
    color: "#cbd5e1"
  };

  const linkStyle = {
    color: "#cbd5e1",
    textDecoration: "none"
  };

  return (
    <footer
      style={{
        backgroundColor: footerColor,
        color: "#ffffff",
        transition: "0.3s"
      }}
    >
      <div className="container py-5">
        <div className="row g-4">

          {/* Company Details */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold mb-3" style={headingStyle}>
              CONVERLINK{" "}
              <span style={{ color: "#38C8F5" }}>
                ENGINEERING
              </span>
            </h4>

            <p style={paragraphStyle}>
              {text.description}
            </p>

            <div className="d-flex gap-3 mt-4">

              <a
                href="https://wa.me/9015189096"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.instagram.com/thakur_prashant_chauhan_01/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.linkedin.com/in/prashant-kumar-9a3984320"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3" style={headingStyle}>
              {text.quickLinks}
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link to="/landing/home" style={linkStyle}>
                  <FaArrowRight className="me-2" />
                  {text.home}
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/landing/services" style={linkStyle}>
                  <FaArrowRight className="me-2" />
                  {text.services}
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/landing/project" style={linkStyle}>
                  <FaArrowRight className="me-2" />
                  {text.projects}
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/landing/contact" style={linkStyle}>
                  <FaArrowRight className="me-2" />
                  {text.contact}
                </Link>
              </li>

            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3" style={headingStyle}>
              {text.ourServices}
            </h5>

            <p style={paragraphStyle}>
              <FaBolt className="me-2" />
              {text.electrical}
            </p>

            <p style={paragraphStyle}>
              <FaTools className="me-2" />
              {text.maintenance}
            </p>

            <p style={paragraphStyle}>
              <FaPlug className="me-2" />
              {text.installation}
            </p>

            <p style={paragraphStyle}>
              <FaPaintRoller className="me-2" />
              {text.interior}
            </p>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3" style={headingStyle}>
              {text.contactUs}
            </h5>

            <p style={paragraphStyle}>
              <FaPhoneAlt className="me-2" />
              9015189096
            </p>

            <p style={paragraphStyle}>
              <FaEnvelope className="me-2" />
              Converlink@gmail.com
            </p>

            <p style={paragraphStyle}>
              <FaMapMarkerAlt className="me-2" />
              Aakash Nagar Ghaziabad 201013.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="py-3"
        style={{
          backgroundColor: bottomColor,
          borderTop: "1px solid rgba(255,255,255,0.12)"
        }}
      >
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">

          <p className="mb-0 small" style={paragraphStyle}>
            © {new Date().getFullYear()} Converlink Engineering Pvt. Ltd.{" "}
            {text.rights}
          </p>

          <p className="mb-0 small" style={paragraphStyle}>
            {text.tagline}
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footerpage;
