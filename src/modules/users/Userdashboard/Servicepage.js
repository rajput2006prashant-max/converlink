
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import serviceData from "../Userdashboard/ServiceData";

function Services() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(serviceData.map((item) => item.category)),
  ];

  const filteredServices = useMemo(() => {
    return serviceData.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div style={{ background: "#f5f8fc" }}>

      {/* HERO SECTION */}
      <section
        className="text-white position-relative"
        style={{
          background:
            "linear-gradient(120deg, #071b31 0%, #102D4F 65%, #087FC4 100%)",
          overflow: "hidden",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center py-lg-5">

            <div className="col-lg-7 py-4">
              <span className="badge rounded-pill px-3 py-2 mb-4"
                style={{ background: "#38C8F5", color: "#102D4F" }}>
                ENGINEERING EXCELLENCE
              </span>

              <h1 className="display-3 fw-bold mb-4">
                Smart Solutions.
                <span className="d-block" style={{ color: "#38C8F5" }}>
                  Better Spaces.
                </span>
              </h1>

              <p className="fs-5 text-light mb-4">
                Discover professional engineering, installation,
                maintenance and interior solutions designed around
                your project requirements.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a href="#our-services" className="btn btn-info btn-lg fw-semibold">
                  Explore Services →
                </a>

                <a href="#service-contact" className="btn btn-outline-light btn-lg">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85"
                alt="Modern engineering architecture"
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  height: "350px",
                  width: "100%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="container py-5">
        <div className="row align-items-center">

          <div className="col-lg-7">
            <p className="fw-bold text-primary mb-2">
              WHAT WE DO
            </p>

            <h2 className="fw-bold display-6" style={{ color: "#102D4F" }}>
              Engineering Services Built Around Your Needs
            </h2>

            <p className="text-secondary mt-3 lh-lg">
              At Converlink Engineering, we focus on providing
              practical and customized solutions for residential
              and commercial projects.
            </p>
          </div>

          <div className="col-lg-5 mt-4 mt-lg-0">
            <div className="row g-3 text-center">

              <div className="col-6">
                <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                  <h2 className="fw-bold text-primary">
                    {serviceData.length.toString().padStart(2, "0")}
                  </h2>
                  <p className="text-secondary mb-0">Core Services</p>
                </div>
              </div>

              <div className="col-6">
                <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                  <h2 className="fw-bold text-primary">360°</h2>
                  <p className="text-secondary mb-0">Project Approach</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="our-services" className="py-5"
        style={{ background: "#edf3f9" }}>

        <div className="container">

          <div className="text-center mb-5">
            <p className="fw-bold text-primary mb-2">
              OUR EXPERTISE
            </p>

            <h2 className="fw-bold display-6" style={{ color: "#102D4F" }}>
              Explore Our Services
            </h2>

            <p className="text-secondary">
              Find the right solution for your next project.
            </p>
          </div>

          {/* SEARCH */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-6">
              <input
                type="search"
                className="form-control form-control-lg rounded-pill shadow-sm"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            {categories.map((category, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`btn rounded-pill px-4 ${
                  selectedCategory === category
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* SERVICE CARDS */}
          <div className="row g-4">

            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div className="col-md-6 col-xl-4" key={service.id}>

                  <div
                    className="card border-0 rounded-4 overflow-hidden h-100 shadow-sm"
                    style={{ transition: "all 0.3s ease" }}
                  >

                    {/* IMAGE */}
                    <div className="position-relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="card-img-top"
                        style={{
                          height: "240px",
                          objectFit: "cover",
                        }}
                      />

                      <span
                        className="badge position-absolute top-0 start-0 m-3 px-3 py-2"
                        style={{
                          background: "#102D4F",
                          color: "#fff",
                        }}
                      >
                        SERVICE 0{index + 1}
                      </span>
                    </div>

                    {/* CARD BODY */}
                    <div className="card-body p-4 d-flex flex-column">

                      <small className="fw-bold text-primary">
                        {service.category}
                      </small>

                      <h4 className="fw-bold mt-2"
                        style={{ color: "#102D4F" }}>
                        {service.title}
                      </h4>

                      <p className="text-secondary lh-lg">
                        {service.shortDescription}
                      </p>

                      <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">

                        <span className="fw-semibold text-dark">
                          {service.price}
                        </span>

                        <Link
                          to={`/landing/service/${service.id}`}
                          className="btn btn-primary rounded-pill px-4"
                        >
                          View Details →
                        </Link>

                      </div>

                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="fw-bold">No Services Found</h4>
                <p className="text-secondary">
                  Try another search or category.
                </p>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="fw-bold text-primary">WHY CONVERLINK</p>
          <h2 className="fw-bold" style={{ color: "#102D4F" }}>
            Why Choose Our Services?
          </h2>
        </div>

        <div className="row g-4">

          {[
            {
              icon: "✓",
              title: "Quality Focus",
              desc: "We prioritize quality and attention to detail.",
            },
            {
              icon: "⚙",
              title: "Planned Approach",
              desc: "Every project starts with understanding your needs.",
            },
            {
              icon: "◆",
              title: "Custom Solutions",
              desc: "Solutions planned around your requirements.",
            },
            {
              icon: "↗",
              title: "Professional Support",
              desc: "Clear communication throughout the project.",
            },
          ].map((item, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="fs-1 text-info mb-3">
                  {item.icon}
                </div>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-secondary mb-0">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CONTACT CTA */}
      <section
        id="service-contact"
        className="py-5 text-white"
        style={{ background: "#102D4F" }}
      >
        <div className="container text-center py-3">

          <p className="fw-bold text-info">
            HAVE A PROJECT IN MIND?
          </p>

          <h2 className="fw-bold display-6">
            Let's Discuss Your Requirements
          </h2>

          <p className="text-light mt-3">
            Connect with our team to discuss a solution for your project.
          </p>

          <Link
            to="/landing/service/1"
            className="btn btn-info btn-lg fw-semibold mt-3 px-4"
          >
            Get Started →
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Services;
