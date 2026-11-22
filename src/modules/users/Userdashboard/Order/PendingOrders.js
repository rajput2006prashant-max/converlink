
import React, { useState } from "react";
import { useProjects } from "../../../../Context/ProjectContext";

function PendingOrder() {

  const { projects, cancelProject } = useProjects();
  const [search, setSearch] = useState("");

  // Sirf Pending projects
  const pendingProjects = projects.filter(
    (project) => project.status === "Pending"
  );

  // Search functionality
  const filteredProjects = pendingProjects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">

      <h3 className="fw-bold mb-1">Pending Orders</h3>
      <p className="text-primary">
        Manage your pending projects and orders
      </p>

      {/* Summary Card */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-secondary">Total Pending Orders</h6>
            <h3 className="fw-bold text-warning">
              {pendingProjects.length}
            </h3>
          </div>
        </div>

      </div>

      {/* Pending Project Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

            <h5 className="fw-bold mb-0">
              Pending Orders List
            </h5>

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

            <table className="table table-hover align-middle">

              <thead className="table-primary">
                <tr>
                  <th>S.No</th>
                  <th>Project Name</th>
                  <th>Client Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProjects.length > 0 ? (

                  filteredProjects.map((project, index) => (

                    <tr key={project.id}>

                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {project.name}
                      </td>

                      <td>{project.clientName}</td>

                      <td>{project.service}</td>

                      <td>{project.date}</td>

                      <td>{project.amount}</td>

                      <td>
                        <span className="badge bg-warning text-dark">
                          {project.status}
                        </span>
                      </td>

                      {/* Cancel Button */}
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this order?")) {
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
