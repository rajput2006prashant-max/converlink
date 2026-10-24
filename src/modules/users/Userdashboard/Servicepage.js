
import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlug,
  FaTools,
  FaBolt,
  FaPaintRoller,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaPlug />,
      title: "Electrical Work",
      description:
        "Professional electrical wiring, lighting and electrical system solutions.",
      features: [
        "Electrical Wiring",
        "Lighting Installation",
        "Electrical Maintenance"
      ]
    },
    {
      icon: <FaTools />,
      title: "Maintenance",
      description:
        "Reliable maintenance services to keep your equipment and property in good condition.",
      features: [
        "Regular Inspection",
        "Repair Services",
        "Preventive Maintenance"
      ]
    },
    {
      icon: <FaBolt />,
      title: "Installation",
      description:
        "Efficient installation services with attention to quality and safety.",
      features: [
        "Equipment Installation",
        "Electrical Fittings",
        "System Setup"
      ]
    },
    {
      icon: <FaPaintRoller />,
      title: "Interior Designing",
      description:
        "Functional and attractive interior solutions for offices and other spaces.",
      features: [
        "Space Planning",
        "Office Interiors",
        "Modern Design Solutions"
      ]
    }
  ];

  return (
    <div style={{ color: "#102D4F" }}>

      {/* Hero Section */}
      <section
        className="py-5 text-white"
        style={{
          background: "linear-gradient(120deg, #102D4F, #164E78)"
        }}
      >
        <div className="container py-4 text-center">
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{ backgroundColor: "#38C8F5", color: "#102D4F" }}
          >
            OUR EXPERTISE
          </span>

          <h1 className="display-4 fw-bold">
            Our <span style={{ color: "#38C8F5" }}>Services</span>
          </h1>

          <p className="lead text-white-50 mt-3 mx-auto"
             style={{ maxWidth: "700px" }}>
            Complete engineering solutions designed to meet your
            electrical, maintenance, installation and interior needs.
          </p>

          <Link to="/landing/contact" className="btn btn-lg mt-3"
                style={{ backgroundColor: "#38C8F5", color: "#102D4F" }}>
            Enquire Now <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

      {/* Services Cards */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">What We Offer</h2>
          <p className="text-secondary">
            Quality work, dependable service and practical solutions.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-4"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#E7F8FE",
                      color: "#087FC4",
                      fontSize: "30px"
                    }}
                  >
                    {service.icon}
                  </div>

                  <h4 className="fw-bold">{service.title}</h4>

                  <p className="text-secondary">
                    {service.description}
                  </p>

                  <hr />

                  <ul className="list-unstyled mb-4">
                    {service.features.map((feature, i) => (
                      <li className="mb-2" key={i}>
                        <FaCheckCircle
                          className="me-2"
                          style={{ color: "#087FC4" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="btn w-100 fw-semibold"
                    style={{
                      backgroundColor: "#102D4F",
                      color: "#FFFFFF"
                    }}
                  >
                    Get Service <FaArrowRight className="ms-2" />
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Contact Section */}
      <section className="container pb-5">
        <div
          className="rounded-4 p-4 p-md-5 text-white text-center"
          style={{ backgroundColor: "#102D4F" }}
        >
          <h2 className="fw-bold">Need Our Services?</h2>
          <p className="text-white-50">
            Get in touch with Converlink Engineering to discuss your project.
          </p>

          <Link
            to="/landing/contact"
            className="btn btn-lg fw-semibold mt-2"
            style={{ backgroundColor: "#38C8F5", color: "#102D4F" }}
          >
            Contact Us <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Services;

