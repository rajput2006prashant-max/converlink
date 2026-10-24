
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
  FaUsers,
  FaBolt,
  FaWrench,
  FaPlug,
  FaPaintRoller,
  FaArrowRight,
  FaClock
} from "react-icons/fa";


function AdminDashboardpage() {
  const stats = [
    {
      title: "Total Services",
      count: "04",
      icon: <FaTools />,
      color: "#168aad"
    },
    {
      title: "Total Projects",
      count: "12",
      icon: <FaProjectDiagram />,
      color: "#7c5ce7"
    },
    {
      title: "New Enquiries",
      count: "08",
      icon: <FaEnvelope />,
      color: "#e89b25"
    },
    {
      title: "Total Users",
      count: "25",
      icon: <FaUsers />,
      color: "#20a477"
    }
  ];

  const services = [
    {
      title: "Electrical Work",
      icon: <FaBolt />,
      description: "Electrical installation and repair"
    },
    {
      title: "Maintenance",
      icon: <FaWrench />,
      description: "Regular maintenance solutions"
    },
    {
      title: "Installation",
      icon: <FaPlug />,
      description: "Professional installation work"
    },
    {
      title: "Interior Designing",
      icon: <FaPaintRoller />,
      description: "Modern interior design services"
    }
  ];

  return (
    <div className="admin-dashboard container-fluid">

      {/* Heading */}
      <div className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">CONVERLINK ENGINEERING</span>
          <h2>Admin Dashboard</h2>
          <p>Welcome back! Here's your company overview.</p>
        </div>

        <span className="dashboard-status">
          <span className="status-dot"></span>
          Admin Panel
        </span>
      </div>

      {/* Statistics */}
      <div className="row g-3 g-xl-4 dashboard-stats">
        {stats.map((item) => (
          <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
            <div className="dashboard-stat-card">
              <div
                className="stat-icon"
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}18`
                }}
              >
                {item.icon}
              </div>

              <div className="stat-content">
                <p>{item.title}</p>
                <h3>{item.count}</h3>
                <small>Company overview</small>
              </div>

              <div className="stat-arrow">
                <FaArrowRight />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h4>Our Services</h4>
            <p>Services offered by Converlink Engineering</p>
          </div>

          <Link
            to="/adminlanding/manageservices"
            className="dashboard-view-link"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="row g-3">
          {services.map((service) => (
            <div className="col-12 col-sm-6 col-xl-3" key={service.title}>
              <div className="dashboard-service-card">
                <div className="service-icon">{service.icon}</div>
                <h6>{service.title}</h6>
                <p>{service.description}</p>
                <span className="service-label">Company Service</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Enquiries */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h4>Recent Enquiries</h4>
            <p>Keep track of customer enquiries</p>
          </div>

          <Link
            to="Enquiries"
            className="dashboard-view-link"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="dashboard-empty-state">
          <div className="empty-icon">
            <FaEnvelope />
          </div>
          <h6>No enquiry data connected</h6>
          <p>
            Customer enquiries will appear here after connecting
            this section to your enquiry data.
          </p>

          <Link
            to="Enquiries"
            className="dashboard-btn"
          >
            Open Enquiries <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h4>Quick Actions</h4>
            <p>Quick access to management pages</p>
          </div>
        </div>

        <div className="quick-actions">
          <Link
            to="ManageServices"
            className="quick-action-btn primary-action"
          >
            <FaTools />
            <span>Manage Services</span>
            <FaArrowRight className="action-arrow" />
          </Link>

          <Link
            to="ManageProject"
            className="quick-action-btn purple-action"
          >
            <FaProjectDiagram />
            <span>Manage Projects</span>
            <FaArrowRight className="action-arrow" />
          </Link>

          <Link
            to="Enquiries"
            className="quick-action-btn orange-action"
          >
            <FaClock />
            <span>Check Enquiries</span>
            <FaArrowRight className="action-arrow" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default AdminDashboardpage;
