
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8700/NewEnuiry";

function PendingOrder() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH PROJECTS FROM JSON SERVER
  const getProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API);
      setProjects(response.data);
    } catch (error) {
      console.log("Pending Projects Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  // ONLY PENDING PROJECTS
  const pendingProjects = projects.filter(
    (project) =>
      String(project.status || "").toLowerCase().trim() === "pending"
  );

  // SEARCH FUNCTIONALITY
  const filteredProjects = pendingProjects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      String(project.name || "").toLowerCase().includes(searchText) ||
      String(project.clientName || "").toLowerCase().includes(searchText) ||
      String(project.service || "").toLowerCase().includes(searchText) ||
      String(project.email || "").toLowerCase().includes(searchText)
    );
  });

  // CANCEL PROJECT
  const cancelProject = async (id) => {
    try {
      await axios.patch(`${API}/${id}`, {
        status: "Cancelled"
      });

      setProjects((prev) =>
        prev.map((project) =>
          String(project.id) === String(id)
            ? { ...project, status: "Cancelled" }
            : project
        )
      );

      alert("Order cancelled successfully!");
    } catch (error) {
      console.log("Cancel Project Error:", error);
      alert("Order cancel nahi ho paya.");
    }
  };

  return (
    <div className="container-fluid p-4">

      <h3 className="fw-bold mb-1">Pending Orders</h3>

      <p className="text-primary">
        Manage your pending projects and orders
      </p>

      {/* SUMMARY CARD */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-secondary">
              Total Pending Orders
            </h6>

            <h3 className="fw-bold text-warning">
              {pendingProjects.length}
            </h3>
          </div>
        </div>
      </div>

      {/* PENDING PROJECT TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

            <h5 className="fw-bold mb-0">
              Pending Orders List
            </h5>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "280px" }}
                placeholder="Search project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-primary"
                onClick={getProjects}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>

          </div>

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
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Service</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Date</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Amount</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Status</th>
                  <th style={{ border: "1px solid #cbd5e1", background: "#102D4F", color: "#fff" }}>Action</th>
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
                      <p className="mt-2 mb-0">
                        Loading Pending Orders...
                      </p>
                    </td>
                  </tr>
                ) : filteredProjects.length > 0 ? (

                  filteredProjects.map((project, index) => (

                    <tr key={project.id}>

                      <td style={{ border: "1px solid #cbd5e1" }}>
                        {index + 1}
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

                      {/* CANCEL BUTTON */}
                      <td style={{ border: "1px solid #cbd5e1" }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order?"
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
