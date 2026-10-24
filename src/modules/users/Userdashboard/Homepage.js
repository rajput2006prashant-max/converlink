
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaArrowRight,
  FaCheckCircle,
  FaPhoneAlt
} from "react-icons/fa";

function Home() {
  const services = [
    {
      title: "Electrical Work",
      description: "Professional electrical solutions and installations.",
      icon: <FaPlug />
    },
    {
      title: "Maintenance",
      description: "Dependable maintenance to keep your systems running.",
      icon: <FaTools />
    },
    {
      title: "Installation",
      description: "Quality installation with a focus on safety.",
      icon: <FaBolt />
    },
    {
      title: "Interior Designing",
      description: "Modern interior solutions for your spaces.",
      icon: <FaPaintRoller />
    }
  ];

  return (
    <div style={{ color: "#102D4F" }}>

      {/* Hero Section */}
      <section
        className="container-fluid py-5"
        style={{
          background: "linear-gradient(120deg, #102D4F, #164E78)",
          color: "#fff",
          minHeight: "480px"
        }}
      >
        <div className="container py-4">
          <div className="row align-items-center g-5">

            <div className="col-lg-7">
              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  backgroundColor: "#38C8F5",
                  color: "#102D4F"
                }}
              >
                WELCOME TO CONVERLINK ENGINEERING
              </span>

              <h1 className="display-4 fw-bold">
                Smart Engineering
                <br />
                <span style={{ color: "#38C8F5" }}>
                  Reliable Solutions
                </span>
              </h1>

              <p className="lead mt-4 text-white-50">
                We provide reliable electrical work, maintenance,
                installation and interior designing solutions for
                your business and property.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link
                  to="/landing/services"
                  className="btn btn-lg fw-semibold"
                  style={{
                    backgroundColor: "#38C8F5",
                    color: "#102D4F"
                  }}
                >
                  Explore Services <FaArrowRight className="ms-2" />
                </Link>

                <Link
                  to="/landing/contact"
                  className="btn btn-lg btn-outline-light"
                >
                  Contact Us
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4 mt-5">
                <span>
                  <FaCheckCircle
                    className="me-2"
                    style={{ color: "#38C8F5" }}
                  />
                  Quality Work
                </span>

                <span>
                  <FaCheckCircle
                    className="me-2"
                    style={{ color: "#38C8F5" }}
                  />
                  Reliable Service
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div
                className="rounded-4 p-4 p-md-5 shadow"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <div className="text-center mb-4">
                  <FaBolt
                    style={{ fontSize: "70px", color: "#38C8F5" }}
                  />

                  <h3 className="fw-bold mt-3">
                    Engineering Excellence
                  </h3>

                  <p className="text-white-50 mb-0">
                    Building better spaces through quality solutions.
                  </p>
                </div>

                <div className="row g-3">
                  {services.map((service, index) => (
                    <div className="col-6" key={index}>
                      <Link
                        to="/landing/services"
                        className="text-decoration-none"
                      >
                        <div className="bg-white text-center rounded-3 p-3 h-100">
                          <div
                            className="fs-2 mb-2"
                            style={{ color: "#087FC4" }}
                          >
                            {service.icon}
                          </div>

                          <h6
                            className="mb-0"
                            style={{ color: "#102D4F" }}
                          >
                            {service.title === "Electrical Work"
                              ? "Electrical"
                              : service.title === "Interior Designing"
                              ? "Interiors"
                              : service.title}
                          </h6>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="fw-bold mb-2" style={{ color: "#087FC4" }}>
            WHAT WE DO
          </p>

          <h2 className="fw-bold">Our Services</h2>

          <p className="text-secondary">
            Complete engineering solutions for your needs.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div
                    className="fs-1 mb-3"
                    style={{ color: "#087FC4" }}
                  >
                    {service.icon}
                  </div>

                  <h5 className="fw-bold">{service.title}</h5>

                  <p className="text-secondary">
                    {service.description}
                  </p>

                  <Link
                    to="/landing/services"
                    className="text-decoration-none fw-bold"
                    style={{ color: "#087FC4" }}
                  >
                    Learn More <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Banner */}
      <section className="container pb-5">
        <div
          className="rounded-4 p-4 p-md-5 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          style={{ backgroundColor: "#102D4F" }}
        >
          <div>
            <h2 className="fw-bold">Have a Project in Mind?</h2>

            <p className="mb-0 text-white-50">
              Contact our team to discuss your requirements.
            </p>
          </div>

          <Link
            to="/landing/contact"
            className="btn btn-lg fw-semibold"
            style={{
              backgroundColor: "#38C8F5",
              color: "#102D4F"
            }}
          >
            <FaPhoneAlt className="me-2" />
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
