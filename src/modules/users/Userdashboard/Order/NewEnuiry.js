
import React, { useEffect, useState } from "react";
import axios from "axios";

function NewEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // JSON Server se saara data fetch karna
  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8700/NewEnuiry"
      );

      setEnquiries(response.data);
      setError("");
    } catch (err) {
      console.error("Enquiry Fetch Error:", err);
      setError("Enquiries load nahi hui. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Sirf New enquiries ka count
  const newEnquiries = enquiries.filter(
    (enquiry) =>
      (enquiry.status || "New").toLowerCase() === "new"
  );

  // Search functionality - saari enquiries mein search
  const filteredEnquiries = enquiries.filter((enquiry) =>
    (enquiry.clientName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (enquiry.service || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (enquiry.email || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (enquiry.mobile || "")
      .toString()
      .includes(search)
  );

  // Approve enquiry
  const approveEnquiry = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8700/NewEnuiry/${id}`,
        {
          status: "Approved",
        }
      );

      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "Approved" }
            : item
        )
      );

    } catch (err) {
      console.error("Approve Error:", err);
      alert("Enquiry approve nahi hui. Please try again.");
    }
  };

  return (
    <div className="container-fluid p-4">

      <h3 className="fw-bold mb-1">New Enquiries</h3>

      <p className="text-secondary">
        View and manage your customer enquiries
      </p>

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
                  enquiries.map((e) => e.service).filter(Boolean)
                ).size
              }
            </h3>
          </div>
        </div>

      </div>

      {/* ENQUIRY TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-body">

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
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-primary"
                onClick={fetchEnquiries}
                title="Refresh enquiries"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>

          </div>

          {loading ? (

            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="text-secondary mt-2">
                Loading enquiries...
              </p>
            </div>

          ) : error ? (

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
                    <th>Requirements</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.length > 0 ? (

                    filteredEnquiries.map((enquiry, index) => (

                      <tr key={enquiry.id}>

                        <td>{index + 1}</td>

                        <td className="fw-semibold">
                          {enquiry.clientName || "-"}
                        </td>

                        <td>{enquiry.email || "-"}</td>

                        <td>{enquiry.mobile || "-"}</td>

                        <td>{enquiry.service || "-"}</td>

                        <td>{enquiry.date || "-"}</td>

                        <td style={{ minWidth: "180px" }}>
                          {enquiry.message || "-"}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              (enquiry.status || "New").toLowerCase() === "approved"
                                ? "bg-success"
                                : "bg-primary"
                            }`}
                          >
                            {enquiry.status || "New"}
                          </span>
                        </td>

                        <td>
                          {(enquiry.status || "New").toLowerCase() === "new" ? (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => approveEnquiry(enquiry.id)}
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-success fw-semibold">
                              Approved
                            </span>
                          )}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="9"
                        className="text-center text-secondary py-4"
                      >
                        No enquiry found
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

export default NewEnquiry;
