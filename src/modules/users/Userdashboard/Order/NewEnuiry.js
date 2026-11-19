
import React, {
  useEffect,
  useState,
  useCallback
} from "react";
import axios from "axios";

function NewEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API URLs
  const ENQUIRY_API = "http://localhost:8700/NewEnuiry";
  const PROJECT_API = "http://localhost:8700/totalproject";

  // NewEnuiry data ko TotalProject mein sync karna
  const syncTotalProjects = async (data) => {
    try {
      const response = await axios.get(PROJECT_API);
      const totalProjects = response.data;

      let nextId =
        totalProjects.length > 0
          ? Math.max(
              ...totalProjects.map(
                (project) => Number(project.projectId) || 0
              )
            ) + 1
          : 1;

      for (const enquiry of data) {
        const existingProject = totalProjects.find(
          (project) =>
            String(project.id) === String(enquiry.id)
        );

        if (existingProject) {
          await axios.patch(
            `${PROJECT_API}/${existingProject.id}`,
            {
              ...enquiry,
              projectId:
                existingProject.projectId || nextId
            }
          );

          if (!existingProject.projectId) {
            nextId++;
          }
        } else {
          await axios.post(PROJECT_API, {
            ...enquiry,
            projectId: nextId
          });

          nextId++;
        }
      }

      console.log("TotalProject synced successfully");
    } catch (error) {
      console.error("TotalProject Sync Error:", error);
    }
  };

  // Fetch enquiries
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(ENQUIRY_API);

      setEnquiries(response.data);

      // Sync data with TotalProject
      await syncTotalProjects(response.data);

    } catch (err) {
      console.error("Enquiry Fetch Error:", err);

      setError(
        "Enquiries load nahi hui. JSON Server check karo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // New enquiries count
  const newEnquiries = enquiries.filter(
    (enquiry) =>
      (enquiry.status || "New").toLowerCase() === "new"
  );

  // Search functionality
  const filteredEnquiries = enquiries.filter((enquiry) =>
    `
      ${enquiry.id || ""}
      ${enquiry.clientName || ""}
      ${enquiry.service || ""}
      ${enquiry.email || ""}
      ${enquiry.mobile || ""}
      ${enquiry.amount || ""}
      ${enquiry.status || ""}
      ${enquiry.message || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Approve enquiry
  const approveEnquiry = async (id) => {
    try {
      const response = await axios.patch(
        `${ENQUIRY_API}/${id}`,
        {
          status: "Approved"
        }
      );

      const updatedEnquiry = response.data;

      // Check existing project
      const projectResponse = await axios.get(PROJECT_API);

      const existingProject = projectResponse.data.find(
        (project) =>
          String(project.id) === String(id)
      );

      if (existingProject) {
        await axios.patch(
          `${PROJECT_API}/${existingProject.id}`,
          {
            ...updatedEnquiry,
            projectId: existingProject.projectId
          }
        );
      } else {
        const projects = projectResponse.data;

        const nextId =
          projects.length > 0
            ? Math.max(
                ...projects.map(
                  (project) =>
                    Number(project.projectId) || 0
                )
              ) + 1
            : 1;

        await axios.post(PROJECT_API, {
          ...updatedEnquiry,
          projectId: nextId
        });
      }

      setEnquiries((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? updatedEnquiry
            : item
        )
      );

      alert(
        "Enquiry approved and Project ID generated!"
      );

    } catch (err) {
      console.error("Approve Error:", err);

      alert(
        "Enquiry approve nahi hui. Please try again."
      );
    }
  };

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

  return (
    <div className="container-fluid p-4">

      {/* PAGE HEADING */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">
          New Enquiries
        </h3>

        <p className="text-secondary">
          View and manage your customer enquiries
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">
              Total Enquiries
            </h6>

            <h3 className="fw-bold">
              {enquiries.length}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">
              New Enquiries
            </h6>

            <h3 className="fw-bold text-primary">
              {newEnquiries.length}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-secondary">
              Services Requested
            </h6>

            <h3 className="fw-bold text-success">
              {
                new Set(
                  enquiries
                    .map((e) => e.service)
                    .filter(Boolean)
                ).size
              }
            </h3>
          </div>
        </div>

      </div>

      {/* ENQUIRY TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-body">

          {/* TABLE HEADER */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

            <h5 className="fw-bold mb-0">
              Customer Enquiry List
            </h5>

            <div className="d-flex gap-2">

              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "280px" }}
                placeholder="Search client, email, mobile..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <button
                className="btn btn-primary"
                onClick={fetchEnquiries}
                title="Refresh enquiries"
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>

            </div>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="text-center py-5">

              <div className="spinner-border text-primary"></div>

              <p className="text-secondary mt-2">
                Loading enquiries...
              </p>

            </div>

          ) : error ? (

            /* ERROR */
            <div className="alert alert-danger">
              {error}

              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchEnquiries}
              >
                Retry
              </button>
            </div>

          ) : (

            /* RESPONSIVE TABLE */
            <div
              className="table-responsive"
              style={{
                width: "100%",
                overflowX: "auto"
              }}
            >

              <table
                className="table table-hover align-middle mb-0"
                style={{
                  width: "100%",
                  tableLayout: "fixed"
                }}
              >

                <thead className="table-light">
                  <tr>
                    <th >S.No</th>
                    <th >Client Name</th>
                    <th >Email</th>
                    <th>Mobile</th>
                    <th >Service</th>
                    <th >Date</th>
                    <th >Requirements</th>
                    <th >Price (₹)</th>
                    <th >Status</th>
                    <th >Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.length > 0 ? (

                    filteredEnquiries.map((enquiry, index) => (

                      <tr key={enquiry.id}>

                        {/* S.No */}
                        <td>
                          {index + 1}
                        </td>

                        {/* Client Name */}
                        <td
                          className="fw-semibold"
                          style={{
                            whiteSpace: "normal",
                            overflowWrap: "anywhere"
                          }}
                        >
                          {enquiry.clientName || "-"}
                        </td>

                        {/* Email */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            overflowWrap: "anywhere"
                          }}
                        >
                          {enquiry.email || "-"}
                        </td>

                        {/* Mobile */}
                        <td>
                          {enquiry.mobile || "-"}
                        </td>

                        {/* Service */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            overflowWrap: "anywhere"
                          }}
                        >
                          {enquiry.service || "-"}
                        </td>

                        {/* Date */}
                        <td>
                          {enquiry.date || "-"}
                        </td>

                        {/* Requirements */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            overflowWrap: "anywhere"
                          }}
                        >
                          {enquiry.message || "-"}
                        </td>

                        {/* Amount */}
                        <td>
                          <span className="fw-bold text-success">
                            {formatAmount(enquiry.amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge ${
                              (enquiry.status || "New").toLowerCase() === "approved"
                                ? "bg-success"
                                : (enquiry.status || "New").toLowerCase() === "rejected"
                                ? "bg-danger"
                                : "bg-primary"
                            }`}
                          >
                            {enquiry.status || "New"}
                          </span>
                        </td>

                        {/* Action */}
                        <td>

                          {(enquiry.status || "New").toLowerCase() === "new" ? (

                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                approveEnquiry(enquiry.id)
                              }
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Approve
                            </button>

                          ) : (

                            <span className="text-success fw-semibold">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Approved
                            </span>

                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-secondary py-5"
                      >
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No enquiry found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* TABLE FOOTER */}
        {!loading && !error && (
          <div className="card-footer bg-white text-secondary">
            Showing {filteredEnquiries.length} of {enquiries.length} enquiries
          </div>
        )}

      </div>

    </div>
  );
}

export default NewEnquiry;
