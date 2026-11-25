
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaProjectDiagram,
  FaSearch,
  FaClock,
  FaCalendarAlt,
  FaTools,
  FaSyncAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCommentAlt
} from "react-icons/fa";

const API = "http://localhost:8700/NewEnuiry";

function InProgress() {

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH PROJECTS
  const getProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const inProgressData = data.filter((project) => {
        const status = String(project.status || "")
          .toLowerCase()
          .replace(/[\s_-]/g, "");

        return status === "inprogress";
      });

      setProjects(inProgressData);

    } catch (error) {
      console.error("Project API Error:", error);
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
      project.status
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <div className="container-fluid py-3 inprogress-page">

      <style>
        {`
          .inprogress-page {
            color: #102D4F;
          }

          .inprogress-header {
            background: linear-gradient(120deg, #102D4F, #087FC4);
            color: white;
            padding: 25px;
            border-radius: 18px;
          }

          .inprogress-card {
            border: none;
            border-radius: 16px;
            transition: 0.3s;
          }

          .inprogress-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          }

          .inprogress-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #e7f4ff;
            color: #087FC4;
            font-size: 21px;
          }

          .inprogress-table th {
            background: #102D4F;
            color: white;
            white-space: nowrap;
          }

          .inprogress-table td {
            vertical-align: middle;
          }

          .inprogress-search {
            max-width: 350px;
          }
        `}
      </style>

      {/* HEADER */}
      <div className="inprogress-header mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <span className="badge bg-info text-dark mb-2">
              USER PROJECTS
            </span>

            <h3 className="fw-bold mb-2">
              <FaProjectDiagram className="me-2" />
              In Progress Projects
            </h3>

            <p className="mb-0 text-white-50">
              Track your ongoing projects and their progress.
            </p>
          </div>

          <button
            className="btn btn-light"
            onClick={getProjects}
          >
            <FaSyncAlt className="me-2" />
            Refresh
          </button>

        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-4 col-sm-6">
          <div className="card inprogress-card shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">In Progress Projects</p>
                <h2 className="fw-bold mb-0">{projects.length}</h2>
              </div>

              <div className="inprogress-icon">
                <FaProjectDiagram />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="card inprogress-card shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">Project Status</p>
                <h5 className="fw-bold mb-0 text-danger">Running</h5>
              </div>

              <div className="inprogress-icon">
                <FaClock />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="card inprogress-card shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary mb-1">Showing Results</p>
                <h2 className="fw-bold mb-0">{filteredProjects.length}</h2>
              </div>

              <div className="inprogress-icon">
                <FaTools />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PROJECT TABLE */}
      <div className="card inprogress-card shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div>
              <h5 className="fw-bold mb-1">My Ongoing Projects</h5>
              <small className=" text-primary">
                Details of your running projects
              </small>
            </div>

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

          {loading ? (

            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading projects...</p>
            </div>

          ) : (

            <div className="table-responsive">

<table
  className="table table-hover table-bordered align-middle mb-0"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #cbd5e1",
    borderRadius: "0"
  }}
>
  <thead>
    <tr>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>S.No</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Client Name</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Email</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Mobile</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Service</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Message</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Project Date</th>
      <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Status</th>
    </tr>
  </thead>

  <tbody>
    {filteredProjects.length > 0 ? (
      filteredProjects.map((project, index) => (
        <tr key={project.id || index}>
          <td style={{ border: "1px solid #cbd5e1" }}>
            {index + 1}
          </td>

          <td style={{ border: "1px solid #cbd5e1" }}>
            <FaUser className="text-primary me-2" />
            {project.clientName || "N/A"}
          </td>

          <td style={{ border: "1px solid #cbd5e1", overflowWrap: "anywhere" }}>
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
              overflowWrap: "anywhere"
            }}
          >
            <FaCommentAlt className="text-primary me-1" />
            {project.message || "N/A"}
          </td>

          <td style={{ border: "1px solid #cbd5e1" }}>
            <FaCalendarAlt className="text-primary me-1" />
            {project.date || "N/A"}
          </td>

          <td style={{ border: "1px solid #cbd5e1" }}>
            <span className="badge bg-primary px-3 py-2">
              In Progress
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

          <h6 className="text-muted">
            No In Progress Projects Found
          </h6>

          <small className="text-muted">
            Your ongoing projects will appear here.
          </small>
        </td>
      </tr>
    )}
  </tbody>
</table>

            </div>

          )}

        </div>
      </div>

    </div>
  );
}

export default InProgress;
