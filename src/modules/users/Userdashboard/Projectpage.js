
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

function Project() {
  const projects = [
    {
      title: "Electrical Installation",
      category: "Electrical Work",
      description:
        "Professional electrical wiring, lighting and power installation for commercial spaces.",
      icon: <FaBolt />,
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Building Maintenance",
      category: "Maintenance",
      description:
        "Reliable building maintenance and repair solutions for safe and smooth operations.",
      icon: <FaTools />,
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Power & Lighting Setup",
      category: "Installation",
      description:
        "Efficient lighting and electrical systems designed for modern workplaces.",
      icon: <FaPlug />,
      status: "In Progress",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Modern Interior Design",
      category: "Interior Designing",
      description:
        "Functional and stylish interior solutions for offices and commercial environments.",
      icon: <FaPaintRoller />,
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="container-fluid py-4 px-4" style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}>
      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold mb-1">OUR WORK</p>
          <h2 className="fw-bold mb-2" style={{ color: "#102D4F" }}>
            Our Projects
          </h2>
          <p className="text-secondary mb-0">
            Explore our electrical, maintenance, installation and interior projects.
          </p>
        </div>

        <Link to="/landing" className="btn btn-outline-primary">
          Dashboard <FaArrowRight className="ms-2" />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-secondary mb-1">Total Projects</p>
            <h3 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
              04
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-secondary mb-1">Completed Projects</p>
            <h3 className="fw-bold text-success mb-0">03</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-secondary mb-1">In Progress</p>
            <h3 className="fw-bold text-primary mb-0">01</h3>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="row g-4">
        {projects.map((project, index) => (
          <div className="col-sm-6 col-xl-4" key={index}>
            <div className="card h-100 border-0 shadow-sm overflow-hidden project-card">
              <img
                src={project.image}
                className="card-img-top"
                alt={project.title}
                style={{ height: "210px", objectFit: "cover" }}
              />

              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="rounded-3 p-2"
                    style={{
                      color: "#087FC4",
                      backgroundColor: "#E5F4FF",
                      fontSize: "22px"
                    }}
                  >
                    {project.icon}
                  </span>

                  <span
                    className={`badge ${
                      project.status === "Completed"
                        ? "bg-success"
                        : "bg-primary"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-primary small fw-semibold mb-1">
                  {project.category}
                </p>

                <h5 className="fw-bold" style={{ color: "#102D4F" }}>
                  {project.title}
                </h5>

                <p className="text-secondary small">
                  {project.description}
                </p>

                <hr />

                <div className="d-flex align-items-center text-success small fw-semibold">
                  <FaCheckCircle className="me-2" />
                  Quality Work & Reliable Service
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div
        className="rounded-4 p-4 p-md-5 mt-5 text-white"
        style={{ backgroundColor: "#102D4F" }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h3 className="fw-bold">Have a Project in Mind?</h3>
            <p className="mb-0 text-white-50">
              Contact Converlink Engineering to discuss your next project.
            </p>
          </div>

          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/landing/contact" className="btn btn-info fw-semibold">
              Contact Us <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;

