
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaUser,
  FaUserShield,
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";


function Welcome() {
  const services = [
    {
      title: "Electrical Work",
      description: "Safe, reliable and efficient electrical solutions.",
      icon: <FaBolt />,
      color: "#087FC4"
    },
    {
      title: "Maintenance",
      description: "Keep your systems running smoothly and efficiently.",
      icon: <FaTools />,
      color: "#16A36A"
    },
    {
      title: "Installation",
      description: "Professional installation for lasting performance.",
      icon: <FaPlug />,
      color: "#7952E8"
    },
    {
      title: "Interior Designing",
      description: "Modern and functional spaces for better living.",
      icon: <FaPaintRoller />,
      color: "#F59E0B"
    }
  ];

  return (
    <div className="welcome-page">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg welcome-navbar">
        <div className="container">
          <Link to="/" className="navbar-brand welcome-brand">
            <FaBuilding className="brand-icon" />
            <span>
              CONVERLINK
              <small>ENGINEERING PVT. LTD.</small>
            </span>
          </Link>

          {/* Login Dropdown */}
          <div className="dropdown">
            <button
              className="btn login-dropdown dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUser className="me-2" />
              Login
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <Link className="dropdown-item py-3" to="/user-login">
                  <FaUser className="me-2 text-primary" />
                  User Login
                </Link>
              </li>

              <li>
                <Link className="dropdown-item py-3" to="/admin-login">
                  <FaUserShield className="me-2 text-primary" />
                  Admin Login
                </Link>
              </li>

              <li><hr className="dropdown-divider" /></li>

            
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="welcome-hero">
        <div className="container">
          <div className="row align-items-center g-4">

            <div className="col-lg-6">
              <span className="welcome-badge">
                Welcome to Converlink Engineering
              </span>

              <h1 className="hero-title">
                Engineering Solutions
                <span>You Can Trust</span>
              </h1>

              <p className="hero-description">
                We provide professional electrical work, maintenance,
                installation and interior designing services for your
                residential, commercial and industrial needs.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/user-login" className="btn hero-btn-primary">
                  <FaUser className="me-2" />
                  User Login
                  <FaArrowRight className="ms-2" />
                </Link>

                <Link to="/admin-login" className="btn hero-btn-outline">
                  <FaUserShield className="me-2" />
                  Admin Login
                  <FaArrowRight className="ms-2" />
                </Link>
              </div>

              <div className="trust-line">
                <FaCheckCircle />
                <span>Reliable Service</span>
                <FaCheckCircle />
                <span>Quality Work</span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="col-lg-6">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern commercial engineering building"
                  className="hero-image"
                />

                <div className="image-label">
                  <FaBuilding />
                  <div>
                    <strong>Converlink Engineering</strong>
                    <small>Building Better Solutions</small>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">WHAT WE DO</span>
            <h2 className="section-title">Our Professional Services</h2>
            <p className="text-secondary">
              Complete solutions for your engineering and design needs.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-sm-6 col-lg-3" key={index}>
                <div
                  className="service-card h-100"
                  style={{ "--service-color": service.color }}
                >
                  <div className="service-icon">
                    {service.icon}
                  </div>

                  <h5>{service.title}</h5>
                  <p>{service.description}</p>

                  <Link to="/user-login" className="service-link">
                    Learn More <FaArrowRight className="ms-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="contact-banner">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div>
            <h2>Have a Project in Mind?</h2>
            <p className="mb-0">
              Let us help you find the right engineering solution.
            </p>
          </div>

          <Link to="/user-login" className="btn contact-btn">
            Get Started <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <Link to="/" className="footer-brand">
            <FaBuilding className="me-2" />
            CONVERLINK
          </Link>

          <p className="mb-0">
            © {new Date().getFullYear()} Converlink Engineering Pvt. Ltd.
            All rights reserved.
          </p>

          <span className="footer-tagline">
            Quality Work. Trusted Solutions.
          </span>
        </div>
      </footer>

    </div>
  );
}

export default Welcome;
