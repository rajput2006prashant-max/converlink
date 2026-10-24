import React from "react";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaCheckCircle,
  FaBullseye,
  FaEye,
  FaUsers,
  FaArrowRight
} from "react-icons/fa";
import { Link } from "react-router-dom";


function About() {
  const services = [
    {
      icon: <FaBolt />,
      title: "Electrical Work",
      description:
        "Reliable electrical solutions for safe and efficient operations."
    },
    {
      icon: <FaTools />,
      title: "Maintenance",
      description:
        "Professional maintenance services to keep your systems running."
    },
    {
      icon: <FaPlug />,
      title: "Installation",
      description:
        "Expert installation services with a focus on quality and safety."
    },
    {
      icon: <FaPaintRoller />,
      title: "Interior Designing",
      description:
        "Creative interior solutions for functional and attractive spaces."
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-tag">ABOUT OUR COMPANY</span>

            <h1>
              Building Better Spaces,
              <span> Creating Better Futures.</span>
            </h1>

            <p>
              Welcome to Converlink Engineering Pvt. Ltd. We provide
              professional engineering, electrical, installation,
              maintenance and interior designing services.
            </p>

            <Link to="/landing/contact" className="about-btn">
              Contact Us <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="about-intro container">
        <div className="about-intro-image">
          <div className="about-image-card">
            <FaTools className="about-large-icon" />
            <h3>Quality in Every Detail</h3>
            <p>Professional solutions for your needs.</p>
          </div>
        </div>

        <div className="about-intro-content">
          <span className="about-tag">WHO WE ARE</span>
          <h2>Your Trusted Engineering Partner</h2>

          <p>
            At Converlink Engineering Pvt. Ltd., we aim to deliver
            dependable services that support our customers' needs.
            Our work focuses on quality, safety, practical solutions
            and professional service.
          </p>

          <p>
            From electrical work and installations to maintenance
            and interior designing, we aim to make every project
            smooth and efficient.
          </p>

          <ul className="about-check-list">
            <li><FaCheckCircle /> Quality-focused solutions</li>
            <li><FaCheckCircle /> Professional service approach</li>
            <li><FaCheckCircle /> Customer satisfaction</li>
            <li><FaCheckCircle /> Safety and reliability</li>
          </ul>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="about-purpose">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-tag">OUR PURPOSE</span>
            <h2>What Drives Us Forward</h2>
            <p>Our focus is on dependable service and lasting customer relationships.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="purpose-card">
                <div className="purpose-icon">
                  <FaBullseye />
                </div>
                <h3>Our Mission</h3>
                <p>
                  To provide reliable engineering and design services
                  through quality workmanship, safety and a commitment
                  to customer needs.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="purpose-card">
                <div className="purpose-icon">
                  <FaEye />
                </div>
                <h3>Our Vision</h3>
                <p>
                  To build lasting partnerships and become a trusted
                  choice for electrical, maintenance, installation
                  and interior solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="about-services container">
        <div className="about-section-heading">
          <span className="about-tag">WHAT WE DO</span>
          <h2>Our Core Services</h2>
          <p>Practical solutions for your project requirements.</p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <div className="about-service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/services" className="service-link">
                  Explore Services <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why">
        <div className="container">
          <div className="about-why-content">
            <span className="about-tag">WHY CONVERLINK?</span>
            <h2>Focused on Quality. Built on Trust.</h2>
            <p>
              We believe that successful projects start with clear
              communication, careful planning and attention to detail.
              Our goal is to deliver a dependable experience at every step.
            </p>

            <div className="why-points">
              <div>
                <FaCheckCircle />
                <span>Quality-focused work</span>
              </div>
              <div>
                <FaUsers />
                <span>Customer-first approach</span>
              </div>
              <div>
                <FaTools />
                <span>Practical solutions</span>
              </div>
            </div>

            <Link to="/landing/contact" className="about-btn">
              Let's Work Together <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;