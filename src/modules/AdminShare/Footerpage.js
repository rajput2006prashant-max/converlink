
import React from "react";
import { Link } from "react-router-dom";
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
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="admin-footer">

      {/* Main Footer */}
      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4 py-5">

          {/* Company Details */}
          <div className="col-md-6 col-lg-4">
            <div className="footer-brand">
              <FaBuilding className="footer-logo" />
              <div>
                <h5>CONVERLINK</h5>
                <span>ENGINEERING PVT. LTD.</span>
              </div>
            </div>

            <p className="footer-description">
              We provide reliable engineering solutions for electrical work,
              maintenance, installation and interior designing.
            </p>

            <div className="footer-socials">
             

              <a href="https://www.instagram.com/"
                 target="_blank" rel="noreferrer"
                 aria-label="Instagram">
                <FaInstagram />
              </a>

              <a href="https://www.linkedin.com/"
                 target="_blank" rel="noreferrer"
                 aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>

              <a href="https://www.whatsapp.com/"
                 target="_blank" rel="noreferrer"
                 aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <h6 className="footer-title">Quick Links</h6>

            <ul className="footer-links">
              <li><Link to="/adminlandingpage">Dashboard</Link></li>
              <li><Link to="ManageServices">Services</Link></li>
              <li><Link to="ManageProject">Projects</Link></li>
              <li><Link to="Enquiries">Enquiries</Link></li>
            </ul>
          </div>

          {/* Admin Links */}
          <div className="col-6 col-lg-2">
            <h6 className="footer-title">Admin Panel</h6>

            <ul className="footer-links">
              <li><Link to="ManageUser">Manage Users</Link></li>
              <li><Link to="MyProfile">My Profile</Link></li>
              <li><Link to="Settings">Settings</Link></li>
              <li><Link to="/admin-login">Logout</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-md-6 col-lg-4">
            <h6 className="footer-title">Contact Information</h6>

            <div className="footer-contact">
              <FaEnvelope />
              <span>Converlink@gmail.com</span>
            </div>

            <div className="footer-contact">
              <FaPhoneAlt />
              <span>+919015189096</span>
            </div>

            <div className="footer-contact">
              <FaMapMarkerAlt />
              <span>India</span>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="container-fluid px-4 px-lg-5 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <p className="mb-0">
            © {new Date().getFullYear()} Converlink Engineering Pvt. Ltd.
            All rights reserved.
          </p>

          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to Top <FaArrowUp />
          </button>
        </div>
      </div>

    </footer>
  );
}

export default Footerpage;
