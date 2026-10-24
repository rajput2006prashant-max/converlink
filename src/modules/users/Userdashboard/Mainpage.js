
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
  FaBell,
  FaBolt,
  FaWrench,
  FaPlug,
  FaPaintRoller,
  FaArrowRight,
  FaUserCircle
} from "react-icons/fa";



function Dashboardpage() {
  const services = [
    {
      title: "Electrical Work",
      description: "Electrical installation and repair solutions.",
      icon: <FaBolt />
    },
    {
      title: "Maintenance",
      description: "Reliable maintenance for your requirements.",
      icon: <FaWrench />
    },
    {
      title: "Installation",
      description: "Professional installation services.",
      icon: <FaPlug />
    },
    {
      title: "Interior Designing",
      description: "Modern and functional interior solutions.",
      icon: <FaPaintRoller />
    }
  ];

  return (
    <div className="user-dashboard">

      {/* Welcome Section */}
      <section className="user-welcome">
        <div>
          <span className="welcome-tag">USER DASHBOARD</span>
          <h2>Welcome Back!</h2>
          <p>
            Explore our engineering services and manage your enquiries
            with Converlink Engineering.
          </p>

          <Link to="/landing/services" className="user-primary-btn">
            Explore Services <FaArrowRight />
          </Link>
        </div>

        <div className="welcome-user-icon">
          <FaUserCircle />
        </div>
      </section>

      {/* Overview Cards */}
      <div className="row g-4 user-overview">
        <div className="col-sm-6 col-xl-4">
          <Link to="/landing/services" className="user-overview-card">
            <span className="overview-icon services-icon">
              <FaTools />
            </span>
            <div>
              <h5>Our Services</h5>
              <p>Explore all services</p>
            </div>
            <FaArrowRight className="overview-arrow" />
          </Link>
        </div>

        <div className="col-sm-6 col-xl-4">
          <Link to="/landing/project" className="user-overview-card">
            <span className="overview-icon projects-icon">
              <FaProjectDiagram />
            </span>
            <div>
              <h5>Our Projects</h5>
              <p>View company projects</p>
            </div>
            <FaArrowRight className="overview-arrow" />
          </Link>
        </div>

        <div className="col-sm-6 col-xl-4">
          <Link to="/landing/enquiries" className="user-overview-card">
            <span className="overview-icon enquiries-icon">
              <FaEnvelope />
            </span>
            <div>
              <h5>My Enquiries</h5>
              <p>View enquiry page</p>
            </div>
            <FaArrowRight className="overview-arrow" />
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <section className="user-dashboard-section">
        <div className="user-section-heading">
          <div>
            <h4>Our Services</h4>
            <p>Engineering solutions for your needs</p>
          </div>

          <Link to="/landing/services">
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="row g-3">
          {services.map((service) => (
            <div className="col-sm-6 col-xl-3" key={service.title}>
              <div className="user-service-card">
                <div className="user-service-icon">
                  {service.icon}
                </div>
                <h6>{service.title}</h6>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="user-dashboard-section">
        <div className="user-section-heading">
          <div>
            <h4>Quick Access</h4>
            <p>Important pages in one place</p>
          </div>
        </div>

        <div className="user-quick-links">
          <Link to="/landing/about">
            About Our Company
          </Link>

          <Link to="/landing/contact">
            Contact Us
          </Link>

          <Link to="/landing/profile">
            My Profile
          </Link>

          <Link to="/landing/notification">
            <FaBell className="me-2" />
            Notifications
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Dashboardpage;
