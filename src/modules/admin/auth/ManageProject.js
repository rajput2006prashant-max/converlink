
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const API = "http://localhost:8700/NewEnuiry";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all enquiries
  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);

      // Remove duplicate records using ID
      const uniqueProjects = response.data.filter(
        (project, index, self) =>
          index === self.findIndex(
            (item) => String(item.id) === String(project.id)
          )
      );

      setProjects(uniqueProjects);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Enquiries load nahi ho paayi. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  // Update enquiry status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(`${API}/${id}`, {
        status,
      });

      setProjects((prev) =>
        prev.map((project) =>
          String(project.id) === String(id)
            ? { ...project, ...response.data }
            : project
        )
      );

      alert("Project status successfully updated!");
    } catch (err) {
      console.error("Status Error:", err);
      alert("Status update nahi ho paya.");
    }
  };

  // Delete enquiry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is enquiry ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);

      setProjects((prev) =>
        prev.filter(
          (project) => String(project.id) !== String(id)
        )
      );

      alert("Enquiry deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Enquiry delete nahi ho paayi.");
    }
  };

  // Search
  const filteredProjects = projects.filter((project) =>
    `
      ${project.id || ""}
      ${project.clientName || ""}
      ${project.email || ""}
      ${project.mobile || ""}
      ${project.service || ""}
      ${project.amount || ""}
      ${project.status || ""}
      ${project.message || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Status counts
  const newCount = projects.filter(
    (p) => (p.status || "New") === "New"
  ).length;

  const approvedCount = projects.filter(
    (p) => p.status === "Approved"
  ).length;

  const progressCount = projects.filter(
    (p) => p.status === "In Progress"
  ).length;

  const completedCount = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  const rejectedCount = projects.filter(
    (p) => p.status === "Rejected"
  ).length;

  // Format amount
  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "Not Provided";
    }

    const value = Number(amount);

    if (!Number.isFinite(value)) {
      return "Not Provided";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  // Status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success";
      case "In Progress":
        return "bg-primary";
      case "Completed":
        return "bg-info text-dark";
      case "Rejected":
        return "bg-danger";
      case "New":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid manage-projects-page">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Manage Projects
          </h2>

          <p className="text-muted mb-0"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
            View and manage all customer enquiries and projects.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={getProjects}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Total Enquiries</p>
              <h3 className="fw-bold mb-0">
                {projects.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">New</p>
              <h3 className="fw-bold text-warning mb-0">
                {newCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Approved</p>
              <h3 className="fw-bold text-success mb-0">
                {approvedCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">In Progress</p>
              <h3 className="fw-bold text-primary mb-0">
                {progressCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Completed</p>
              <h3 className="fw-bold text-info mb-0">
                {completedCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Rejected</p>
              <h3 className="fw-bold text-danger mb-0">
                {rejectedCount}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Projects Table */}
      <div className="card shadow-sm border-0">

        {/* Table Header */}
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <h5 className="fw-bold mb-0">
              All Projects / Enquiries
            </h5>

            <div
              className="input-group"
              style={{ maxWidth: "350px" }}
            >
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search client, service, amount..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Table Body */}
        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 mb-0">
                Loading projects...
              </p>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3">
              {error}
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{
                width: "100%",
                overflowX: "auto",
              }}
            >

              <table
                className="table table-hover align-middle mb-0"
                style={{
                  width: "max-content",
                  minWidth: "100%",
                  tableLayout: "auto",
                }}
              >

                <thead className="table-light">
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>ID</th>
                    <th style={{ whiteSpace: "nowrap" }}>Client Details</th>
                    <th style={{ whiteSpace: "nowrap" }}>Service</th>
                    <th style={{ whiteSpace: "nowrap" }}>Amount (₹)</th>
                    <th style={{ minWidth: "180px" }}>Message</th>
                    <th style={{ whiteSpace: "nowrap" }}>Enquiry Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ whiteSpace: "nowrap" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                      <tr key={project.id}>

                        {/* Serial Number ID */}
                        <td>
                          <span className="fw-semibold">
                            {index + 1}
                          </span>
                        </td>

                        {/* Client Details */}
                        <td>
                          <div className="fw-semibold">
                            {project.clientName || "N/A"}
                          </div>

                          <small className="text-muted d-block">
                            {project.email || "N/A"}
                          </small>

                          <small className="text-muted">
                            {project.mobile || "N/A"}
                          </small>
                        </td>

                        {/* Service */}
                        <td>
                          <span className="fw-semibold">
                            {project.service || "N/A"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td>
                          <span
                            className={
                              project.amount !== undefined &&
                              project.amount !== null &&
                              project.amount !== ""
                                ? "fw-bold text-success"
                                : "text-muted"
                            }
                          >
                            {formatAmount(project.amount)}
                          </span>
                        </td>

                        {/* Message */}
                        <td
                          style={{
                            minWidth: "180px",
                            maxWidth: "280px",
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {project.message || "No message"}
                        </td>

                        {/* Date */}
                        <td>
                          {project.date || "N/A"}
                        </td>

                        {/* Status */}
                        <td>
                          <select
                            className={`form-select form-select-sm ${getStatusClass(
                              project.status || "New"
                            )}`}
                            style={{
                              minWidth: "130px",
                              color:
                                project.status === "Completed" ||
                                project.status === "New"
                                  ? "#212529"
                                  : "#fff",
                            }}
                            value={project.status || "New"}
                            onChange={(e) =>
                              handleStatusChange(
                                project.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="New">New</option>
                            <option value="Approved">Approved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        {/* Action */}
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() =>
                              handleDelete(project.id)
                            }
                          >
                            <MdDelete size={18} />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-5 text-muted"
                      >
                        <i className="bi bi-folder2-open fs-2 d-block mb-2"></i>
                        No projects or enquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="card-footer bg-white text-muted">
            Showing {filteredProjects.length} of {projects.length} records
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageProjects;
