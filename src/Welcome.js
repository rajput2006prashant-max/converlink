
import React, { useState } from "react";
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
  FaCheckCircle,
  FaSearch,
  FaHardHat,
  FaAward,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaDraftingCompass,
  FaPhoneAlt
} from "react-icons/fa";

import Footerpage from "./modules/shares/Footerpage";


function Welcome() {
  const [search, setSearch] = useState("");

  const services = [
    {
      title: "Electrical Work",
      description:
        "Safe, reliable and efficient electrical solutions for residential and commercial spaces.",
      icon: <FaBolt />,
      color: "#087FC4"
    },
    {
      title: "Maintenance",
      description:
        "Professional maintenance to keep your systems running smoothly and efficiently.",
      icon: <FaTools />,
      color: "#16A36A"
    },
    {
      title: "Installation",
      description:
        "Expert installation services with quality materials and lasting performance.",
      icon: <FaPlug />,
      color: "#7952E8"
    },
    {
      title: "Interior Designing",
      description:
        "Modern, creative and functional interiors designed around your requirements.",
      icon: <FaPaintRoller />,
      color: "#F59E0B"
    }
  ];

  const projects = [
    {
      title: "Commercial Building",
      category: "Electrical & Engineering",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85"
    },
    {
      title: "Modern Interior",
      category: "Interior Designing",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"
    },
    {
      title: "Industrial Installation",
      category: "Installation & Maintenance",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85"
    }
  ];

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="welcome-page">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark welcome-navbar sticky-top">
        <div className="container">

          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="brand-icon">
              <FaBuilding />
            </div>

            <div className="ms-2">
              <h5 className="mb-0 fw-bold">CONVERLINK</h5>
              <small>ENGINEERING PVT. LTD.</small>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#welcomeNavbar"
            aria-controls="welcomeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="welcomeNavbar">

            <ul className="navbar-nav mx-auto">

              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/landing/about" className="nav-link">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/landing/services" className="nav-link">
                  Services
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/landing/project" className="nav-link">
                  Projects
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/landing/contact" className="nav-link">
                  Contact
                </Link>
              </li>

            </ul>

            <div className="d-flex flex-wrap gap-2 navbar-buttons">

              <Link to="/user-login" className="btn btn-info text-white">
                <FaUser className="me-2" />
                User Login
              </Link>

              <Link to="/admin-login" className="btn btn-outline-light">
                <FaUserShield className="me-2" />
                Admin Login
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="welcome-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <span className="welcome-badge">
                <FaCheckCircle className="me-2" />
                Welcome to Converlink Engineering
              </span>

              <h1 className="hero-title">
                Building Better
                <span> Engineering Solutions</span>
                For Your Future.
              </h1>

              <p className="hero-description">
                We deliver professional electrical work, maintenance,
                installation and interior designing services. Our focus
                is on quality, safety and reliable engineering solutions.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">

                <Link to="/user-login" className="btn hero-btn-primary">
                  Get Started
                  <FaArrowRight className="ms-2" />
                </Link>

                <Link to="/landing/services" className="btn hero-btn-outline">
                  Explore Services
                </Link>

              </div>

              <div className="trust-line mt-4">
                <span>
                  <FaCheckCircle /> Quality Work
                </span>

                <span>
                  <FaCheckCircle /> Reliable Service
                </span>

                <span>
                  <FaCheckCircle /> Professional Team
                </span>
              </div>

            </div>

            <div className="col-lg-6">

              <div className="hero-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern commercial building"
                  className="hero-image"
                />

                <div className="hero-floating-card">
                  <div className="floating-icon">
                    <FaHardHat />
                  </div>

                  <div>
                    <h6 className="mb-1">Professional Solutions</h6>
                    <small>Quality and safety first</small>
                  </div>
                </div>

                <div className="hero-image-label">
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

      {/* COMPANY STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-3">

            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <FaBuilding />
                <h3>04</h3>
                <p>Core Services</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <FaAward />
                <h3>Quality</h3>
                <p>Work Standards</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <FaUsers />
                <h3>Professional</h3>
                <p>Team Approach</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <FaClock />
                <h3>Reliable</h3>
                <p>Service Support</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="container">

          <div className="section-heading text-center">
            <span className="section-label">WHAT WE DO</span>

            <h2 className="section-title">
              Our Professional Services
            </h2>

            <p>
              Complete engineering and designing solutions under one roof.
            </p>
          </div>

          {/* SEARCH */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 col-lg-6">

              <div className="input-group service-search">
                <span className="input-group-text">
                  <FaSearch />
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search our services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* SERVICE CARDS */}
          <div className="row g-4">

            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
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
                      Learn More
                      <FaArrowRight className="ms-2" />
                    </Link>

                  </div>

                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h5 className="text-danger">No Services Found!</h5>
                <p className="text-secondary">
                  Please try searching another service.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1100&q=85"
                alt="Engineering professionals working on a project"
                className="why-image"
              />
            </div>

            <div className="col-lg-6">

              <span className="section-label">WHY CHOOSE US</span>

              <h2 className="section-title text-start">
                Engineering With Quality, Trust & Commitment
              </h2>

              <p className="text-secondary mb-4">
                We aim to provide dependable engineering services
                with attention to quality, safety and customer requirements.
              </p>

              <div className="why-feature">
                <FaShieldAlt />
                <div>
                  <h6>Safety First</h6>
                  <p>We focus on safe and responsible working practices.</p>
                </div>
              </div>

              <div className="why-feature">
                <FaAward />
                <div>
                  <h6>Quality Work</h6>
                  <p>We value quality in every stage of our work.</p>
                </div>
              </div>

              <div className="why-feature">
                <FaDraftingCompass />
                <div>
                  <h6>Professional Approach</h6>
                  <p>Solutions planned around project requirements.</p>
                </div>
              </div>

              <Link to="/landing/about" className="btn hero-btn-primary mt-3">
                About Our Company
                <FaArrowRight className="ms-2" />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="projects-section">
        <div className="container">

          <div className="section-heading text-center">
            <span className="section-label">OUR WORK</span>

            <h2 className="section-title">
              Explore Our Projects
            </h2>

            <p>
              A look at engineering, installation and interior work.
            </p>
          </div>

          <div className="row g-4">

            {projects.map((project, index) => (
              <div className="col-md-6 col-lg-4" key={index}>

                <div className="project-card">
                  <div className="project-image-box">
                    <img src={project.image} alt={project.title} />
                  </div>

                  <div className="project-content">
                    <small>{project.category}</small>
                    <h5>{project.title}</h5>

                    <Link to="/user-login" className="service-link">
                      View Details
                      <FaArrowRight className="ms-2" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="contact-banner">
        <div className="container">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">
              <span className="contact-small-title">
                LET'S WORK TOGETHER
              </span>

              <h2>Have a Project in Mind?</h2>

              <p className="mb-0">
                Let's discuss your requirements and find the right
                engineering solution for your project.
              </p>
            </div>

            <div className="col-lg-4 text-lg-end">
              <Link to="/user-login" className="btn contact-btn">
                <FaPhoneAlt className="me-2" />
                Get Started
                <FaArrowRight className="ms-2" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footerpage />

    </div>
  );
}

export default Welcome;
