
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiViewList } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const ENQUIRY_API = "http://localhost:8700/NewEnuiry";
const PROJECT_API = "http://localhost:8700/totalproject";

function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch Enquiries
  const getEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(ENQUIRY_API);
      setEnquiries(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Enquiries load nahi ho paayi. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnquiries();
  }, []);

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${ENQUIRY_API}/${id}`, { status });

      setEnquiries((previous) =>
        previous.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status }
            : item
        )
      );

      if (
        selectedEnquiry &&
        String(selectedEnquiry.id) === String(id)
      ) {
        setSelectedEnquiry((previous) => ({
          ...previous,
          status
        }));
      }
    } catch (err) {
      console.error("Status Error:", err);
      alert("Status update nahi ho paaya.");
    }
  };

  // Delete Enquiry
  const deleteEnquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is enquiry ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${ENQUIRY_API}/${id}`);

      setEnquiries((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      if (
        selectedEnquiry &&
        String(selectedEnquiry.id) === String(id)
      ) {
        setShowDetails(false);
        setSelectedEnquiry(null);
      }

      alert("Enquiry deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Enquiry delete nahi ho paayi.");
    }
  };

  // Convert Enquiry Into Project
  const convertToProject = async (enquiry) => {
    const confirmConvert = window.confirm(
      "Kya aap is enquiry ko project mein convert karna chahte hain?"
    );

    if (!confirmConvert) return;

    try {
      const projectResponse = await axios.get(PROJECT_API);

      const existingProject = projectResponse.data.find(
        (project) =>
          String(project.enquiryId) === String(enquiry.id)
      );

      if (existingProject) {
        alert("Ye enquiry pehle se project mein convert ho chuki hai.");
        return;
      }

      const projectData = {
        name:
          enquiry.projectName ||
          enquiry.clientName ||
          enquiry.name ||
          enquiry.fullName ||
          "New Project",

        client:
          enquiry.clientName ||
          enquiry.name ||
          enquiry.fullName ||
          "Customer",

        email: enquiry.email || "",
        mobile: enquiry.mobile || enquiry.phone || "",

        service:
          enquiry.service ||
          enquiry.serviceName ||
          "Electrical Work",

        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",

        budget: Number(enquiry.amount || enquiry.budget || 0),

        status: "Pending",

        description:
          enquiry.message ||
          enquiry.description ||
          "Created from customer enquiry.",

        enquiryId: enquiry.id
      };

      await axios.post(PROJECT_API, projectData);

      await axios.patch(`${ENQUIRY_API}/${enquiry.id}`, {
        status: "Approved",
        convertedToProject: true
      });

      setEnquiries((previous) =>
        previous.map((item) =>
          String(item.id) === String(enquiry.id)
            ? {
                ...item,
                status: "Approved",
                convertedToProject: true
              }
            : item
        )
      );

      if (
        selectedEnquiry &&
        String(selectedEnquiry.id) === String(enquiry.id)
      ) {
        setSelectedEnquiry((previous) => ({
          ...previous,
          status: "Approved",
          convertedToProject: true
        }));
      }

      alert("Enquiry successfully converted into Project!");

    } catch (err) {
      console.error("Project Conversion Error:", err);

      alert(
        "Project create nahi ho paaya. Projects API aur JSON Server check karo."
      );
    }
  };

  // Search and Filter
  const filteredEnquiries = enquiries.filter((item) => {
    const name =
      item.clientName || item.name || item.fullName || "";

    const email = item.email || "";
    const mobile = item.mobile || item.phone || "";

    const service =
      item.service || item.serviceName || "";

    const status = item.status || "Pending";

    const matchesSearch =
      `
        ${item.id || ""}
        ${name}
        ${email}
        ${mobile}
        ${service}
        ${item.amount || ""}
        ${item.message || ""}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary Counts
  const total = enquiries.length;

  const pending = enquiries.filter(
    (item) => (item.status || "Pending") === "Pending"
  ).length;

  const approved = enquiries.filter(
    (item) => item.status === "Approved"
  ).length;

  const contacted = enquiries.filter(
    (item) => item.status === "Contacted"
  ).length;

  // Status Badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success";
      case "Contacted":
        return "bg-primary";
      case "Rejected":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  // Amount Format
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
    <div className="container-fluid manage-enquiries-page p-3">

      {/* PAGE HEADING */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Manage Enquiries
          </h3>

          <p className="text-muted mb-0"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
            View and manage customer enquiries.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={getEnquiries}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-3 col-sm-6">
          <div className="card dashboard-card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">
                Total Enquiries
              </p>
              <h3 className="fw-bold mb-0">{total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card dashboard-card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Pending</p>
              <h3 className="fw-bold text-warning mb-0">
                {pending}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card dashboard-card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Contacted</p>
              <h3 className="fw-bold text-primary mb-0">
                {contacted}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card dashboard-card shadow-sm border-0 h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-2">Approved</p>
              <h3 className="fw-bold text-success mb-0">
                {approved}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* ENQUIRY TABLE */}
      <div className="card dashboard-panel shadow-sm border-0">

        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <h5 className="fw-bold mb-0" style={{
              background:"#087FC4",
              width:"150px",
              borderRadius:"10px",
              padding:"10px",
            }}>
              Enquiries List
            </h5>

            <div className="d-flex flex-wrap gap-2 enquiry-filters">

              <input
                type="text"
                className="form-control"
                placeholder="Search name, email, mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="card-body p-0">

          {loading ? (

            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 mb-0">Loading enquiries...</p>
            </div>

          ) : error ? (

            <div className="alert alert-danger m-3">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={getEnquiries}
              >
                Retry
              </button>
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.length > 0 ? (

                    filteredEnquiries.map((item, index) => {
                      const status = item.status || "Pending";

                      return (
                        <tr key={item.id}>

                          <td>{index + 1}</td>

                          <td className="fw-semibold">
                            {item.clientName ||
                              item.name ||
                              item.fullName ||
                              "N/A"}
                          </td>

                          <td>{item.email || "N/A"}</td>

                          <td>
                            {item.mobile || item.phone || "N/A"}
                          </td>

                          <td>
                            {item.service || item.serviceName || "N/A"}
                          </td>

                          <td>
                            <span className={`badge ${getStatusClass(status)}`}>
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex gap-2 align-items-center">

                              {/* VIEW DETAILS */}
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="View Details"
                                onClick={() => {
                                  setSelectedEnquiry({
                                    ...item,
                                    serialNo: index + 1
                                  });
                                  setShowDetails(true);
                                }}
                              >
                                <CiViewList size={20} />
                              </button>

                              {/* STATUS UPDATE */}
                              <select
                                className="form-select form-select-sm enquiry-status-select"
                                value={status}
                                onChange={(e) =>
                                  updateStatus(item.id, e.target.value)
                                }
                                aria-label="Update enquiry status"
                              >
                                <option value="New">New</option>
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                              </select>

                              {/* CONVERT TO PROJECT */}
                              {!item.convertedToProject &&
                                status !== "Rejected" && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    title="Convert to Project"
                                    onClick={() => convertToProject(item)}
                                  >
                                    <i className="bi bi-arrow-left-right"></i>
                                  </button>
                                )}

                              {/* DELETE */}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                                onClick={() => deleteEnquiry(item.id)}
                              >
                               <MdDelete/>
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })

                  ) : (

                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No enquiries found.
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
          <div className="card-footer bg-white text-muted">
            Showing {filteredEnquiries.length} of {enquiries.length} enquiries
          </div>
        )}

      </div>

      {/* ENQUIRY DETAILS MODAL */}
      {showDetails && selectedEnquiry && (

        <div
          className="enquiry-modal-backdrop"
          onClick={() => setShowDetails(false)}
        >

          <div
            className="enquiry-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="enquiry-modal-header">

              <div>
                <h4 className="fw-bold mb-1">
                  Enquiry Details
                </h4>

                <p className="mb-0 text-white-50">
                  Customer enquiry information
                </p>
              </div>

              <button
                className="btn-close btn-close-white"
                onClick={() => setShowDetails(false)}
              ></button>

            </div>

            {/* MODAL BODY */}
            <div className="enquiry-modal-body">

              {/* ENQUIRY OVERVIEW */}
              <div className="enquiry-overview mb-4">

                <div>
                  <small>Enquiry ID</small>

                  <h5 className="fw-bold mb-0">
                    #{selectedEnquiry.serialNo}
                  </h5>
                </div>

                <div>
                  <small>Current Status</small>

                  <div>
                    <span
                      className={`badge ${getStatusClass(
                        selectedEnquiry.status || "Pending"
                      )}`}
                    >
                      {selectedEnquiry.status || "Pending"}
                    </span>
                  </div>
                </div>

              </div>

              {/* CUSTOMER INFORMATION */}
              <div className="detail-section">

                <h6 className="detail-section-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Customer Information
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Customer Name</small>
                      <p>
                        {selectedEnquiry.clientName ||
                          selectedEnquiry.name ||
                          selectedEnquiry.fullName ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Email Address</small>
                      <p className="detail-break">
                        {selectedEnquiry.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Mobile Number</small>
                      <p>
                        {selectedEnquiry.mobile ||
                          selectedEnquiry.phone ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Enquiry Date</small>
                      <p>
                        {selectedEnquiry.date ||
                          selectedEnquiry.createdAt ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* SERVICE INFORMATION */}
              <div className="detail-section">

                <h6 className="detail-section-title">
                  <i className="bi bi-tools me-2"></i>
                  Service Information
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Service Requested</small>
                      <p>
                        {selectedEnquiry.service ||
                          selectedEnquiry.serviceName ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="detail-item">
                      <small>Estimated Amount</small>
                      <p className="text-success fw-bold">
                        {formatAmount(
                          selectedEnquiry.amount ??
                          selectedEnquiry.budget
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="detail-item">
                      <small>Project Name</small>
                      <p>
                        {selectedEnquiry.projectName || "N/A"}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* CUSTOMER REQUIREMENTS */}
              <div className="detail-section">

                <h6 className="detail-section-title">
                  <i className="bi bi-chat-left-text me-2"></i>
                  Customer Requirements
                </h6>

                <div className="requirement-box">
                  {selectedEnquiry.message ||
                    selectedEnquiry.description ||
                    "No requirements or message provided."}
                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="enquiry-modal-footer">

              <button
                className="btn btn-secondary px-4"
                onClick={() => setShowDetails(false)}
              >
                <i className="bi bi-x-circle me-2"></i>
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageEnquiries;
