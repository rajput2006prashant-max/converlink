
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="d-flex flex-column p-3 text-white vh-100"
   style={{
    width: "260px",
    backgroundColor: "#102D4F",
    position: "fixed",
    top: 84,
    left: 0,
    height: "100vh",
    color: "white",
    overflowY: "auto",
    zIndex: 1000
  }}
    >
      <h4 className="mb-4 border-bottom pb-3">
        <i className="bi bi-building text-info me-2"></i>
        CONVERLINK
      </h4>

      <p className="text-info fw-bold small">MAIN MENU</p>

      <nav className="nav nav-pills flex-column gap-2">

       
       

        <Link to="home" className="nav-link text-white">
          <i className="bi bi-house me-2"></i> Home
        </Link>

          <Link to="about" className="nav-link text-white">
          <i className="bi bi-tools me-2"></i> About
        </Link>

        <Link to="services" className="nav-link text-white">
          <i className="bi bi-tools me-2"></i> Services
        </Link>

        <Link to="project" className="nav-link text-white">
          <i className="bi bi-building me-2"></i> Projects
        </Link>

        <Link to="enquiries" className="nav-link text-white">
          <i className="bi bi-envelope me-2"></i> Enquiries
        </Link>

 <Link to="contact" className="nav-link text-white">
          <i className="bi bi-envelope me-2"></i> Contact
        </Link>

        

      </nav>

      <div className="mt-auto border-top pt-3">
        <Link to="/login" className="nav-link text-danger">
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
