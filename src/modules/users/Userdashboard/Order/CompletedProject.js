import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaCheckCircle,
  FaSearch,
  FaSyncAlt,
  FaProjectDiagram,
  FaCalendarAlt,
  FaTrophy,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const API = "http://localhost:8700/NewEnuiry";

function CompletedProject() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH COMPLETED PROJECTS
  const getProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API);

      const completed = response.data.filter((project) => {
        const status = String(project.status || "")
          .toLowerCase()
          .replace(/[\s_-]/g, "");

        return status === "completed";
      });

      setProjects(completed);
    } catch (error) {
      console.error("Error loading completed projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  // SEARCH
  const filteredProjects = projects.filter((project) =>
    [
      project.clientName,
      project.email,
      project.mobile,
      project.service,
      project.message,
      project.projectId,
      project.status,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="container-fluid py-3">
      {/* HEADER */}
      <div
        className="p-4 mb-4 rounded-4 text-white shadow"
        style={{
          background: "linear-gradient(120deg, #102D4F, #087FC4)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-light text-success mb-2">
              PROJECT MANAGEMENT
            </span>

            <h3 className="fw-bold mb-2">
              <FaCheckCircle className="me-2" />
              Completed Projects
            </h3>

            <p className="mb-0 text-white-50">
              View all successfully completed projects.
            </p>
          </div>

          <button
            className="btn btn-light text-primary fw-semibold"
            onClick={getProjects}
          >
            <FaSyncAlt className="me-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">Completed Projects</p>
                <h3 className="fw-bold mb-0">{projects.length}</h3>
              </div>

              <div className="rounded-circle p-3 bg-success bg-opacity-10 text-success">
                <FaCheckCircle size={25} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">Project Status</p>
                <h5 className="fw-bold text-success mb-0">Successfully Done</h5>
              </div>

              <div className="rounded-circle p-3 bg-primary bg-opacity-10 text-primary">
                <FaTrophy size={25} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">Showing Results</p>
                <h3 className="fw-bold mb-0">{filteredProjects.length}</h3>
              </div>

              <div className="rounded-circle p-3 bg-info bg-opacity-10 text-info">
                <FaProjectDiagram size={25} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT TABLE */}
      <div className="card border-0 shadow-sm rounded-4">
        <div
          className="card-header  border-0 p-3"
          style={{
            background: "",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h5 className="fw-bold mb-0  text-primary">
              <FaProjectDiagram className="me-2 text-primary" />
              Completed Project List
            </h5>

            <div className="input-group inprogress-search">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search project or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table table-hover table-bordered align-middle mb-0"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #cbd5e1",
                borderRadius: "0",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    S.No
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Client Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Mobile
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Message
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Project Date
                  </th>
                  <th
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#102D4F",
                      color: "#fff",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5"
                      style={{ border: "1px solid #cbd5e1" }}
                    >
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2 mb-0">Loading projects...</p>
                    </td>
                  </tr>
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <tr key={project.id || index}>
                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {index + 1}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <FaUser className="text-primary me-2" />
                        {project.clientName || "N/A"}
                      </td>

                      <td
                        style={{
                          border: "1px solid #cbd5e1",
                          overflowWrap: "anywhere",
                        }}
                      >
                        <FaEnvelope className="text-primary me-2" />
                        {project.email || "N/A"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <FaPhone className="text-primary me-2" />
                        {project.mobile || "N/A"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {project.service || "N/A"}
                      </td>

                      <td
                        style={{
                          border: "1px solid #cbd5e1",
                          minWidth: "150px",
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {project.message || "N/A"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <FaCalendarAlt className="text-primary me-1" />
                        {project.completedDate || project.date || "N/A"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <span className="badge bg-success px-3 py-2">
                          <FaCheckCircle className="me-1" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5"
                      style={{ border: "1px solid #cbd5e1" }}
                    >
                      <FaProjectDiagram size={35} className="text-muted mb-3" />
                      <h6 className="fw-bold">No Completed Projects Found</h6>
                      <p className="text-muted mb-0">
                        Completed projects will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedProject;
