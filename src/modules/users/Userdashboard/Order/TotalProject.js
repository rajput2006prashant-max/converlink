
import React, { useState, useEffect } from "react";
import axios from "axios";

function TotalProject() {

  const [search, setSearch] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  // JSON Server se Enquiry Data Fetch
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8700/NewEnuiry"
      );

      setProjectData(response.data);

    } catch (error) {
      console.log("Project Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Summary Cards
  const totalProjects = projectData.length;

  const completed = projectData.filter(
    p => p.status === "Completed"
  ).length;

  const inProgress = projectData.filter(
    p => p.status === "In Progress"
  ).length;

  const pending = projectData.filter(
    p => p.status === "Pending" || p.status === "New"
  ).length;

  // Search Filter
  const filteredProjects = projectData.filter(project =>
    (project.clientName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (project.service || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">

      <h3 className="fw-bold mb-1">Total Projects</h3>
      <p className="text-secondary">
        Manage and track your projects
      </p>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">Total Projects</h6>
            <h3 className="fw-bold">{totalProjects}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">Completed</h6>
            <h3 className="text-success fw-bold">{completed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">In Progress</h6>
            <h3 className="text-primary fw-bold">{inProgress}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">Pending / New</h6>
            <h3 className="text-warning fw-bold">{pending}</h3>
          </div>
        </div>

      </div>

      {/* Project Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

            <h5 className="fw-bold mb-0">My Projects</h5>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "280px" }}
              placeholder="Search project or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>S.No</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading Projects...
                    </td>
                  </tr>

                ) : filteredProjects.length > 0 ? (

                  filteredProjects.map((project, index) => (

                    <tr key={project.id}>

                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {project.clientName}
                      </td>

                      <td>{project.email}</td>

                      <td>{project.mobile}</td>

                      <td>{project.service}</td>

                      <td>{project.date}</td>

                      <td>{project.message}</td>

                      <td>
                        <span className={`badge ${
                          project.status === "Completed"
                            ? "bg-success"
                            : project.status === "In Progress"
                            ? "bg-primary"
                            : project.status === "Approved"
                            ? "bg-info text-dark"
                            : "bg-warning text-dark"
                        }`}>
                          {project.status}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="8" className="text-center text-secondary py-4">
                      No project found
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

export default TotalProject;
