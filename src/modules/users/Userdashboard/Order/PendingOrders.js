import React, { useState } from "react";
import { useProjects } from "../../../../Context/ProjectContext";

function PendingOrder() {
  const { projects, cancelProject } = useProjects();
  const [search, setSearch] = useState("");

  // Sirf Pending projects
  const pendingProjects = projects.filter(
    (project) => project.status === "Pending",
  );

  // Search functionality
  const filteredProjects = pendingProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.clientName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4">
      <h3 className="fw-bold mb-1">Pending Orders</h3>
      <p className="text-primary">Manage your pending projects and orders</p>

      {/* Summary Card */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-secondary">Total Pending Orders</h6>
            <h3 className="fw-bold text-warning">{pendingProjects.length}</h3>
          </div>
        </div>
      </div>

      {/* Pending Project Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h5 className="fw-bold mb-0">Pending Orders List</h5>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "280px" }}
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table
              className="table table-hover table-bordered align-middle mb-0"
              style={{
                width: "100%",
                border: "1px solid #cbd5e1",
              }}
            >
              <thead className="table-primary">
                <tr>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>S.No</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Project Name</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Client Name</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Service</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Date</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Amount</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Status</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F",color: "#fff" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <tr key={project.id}>
                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {index + 1}
                      </td>

                      <td
                        className="fw-semibold"
                        style={{
                          border: "1px solid #cbd5e1",
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {project.name || "-"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {project.clientName || "-"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {project.service || "-"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {project.date || "-"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {project.amount || "-"}
                      </td>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <span className="badge bg-warning text-dark px-3 py-2">
                          {project.status || "Pending"}
                        </span>
                      </td>

                      {/* Cancel Button */}
                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order?",
                              )
                            ) {
                              cancelProject(project.id);
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center text-secondary py-4"
                      style={{ border: "1px solid #cbd5e1" }}
                    >
                      No pending orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingOrder;
