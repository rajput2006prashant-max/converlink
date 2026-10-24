
import React, { useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaTrash,
  FaSearch,
  FaTimes,
  FaPhoneAlt,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";



const initialEnquiries = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    service: "Electrical Work",
    message: "I need electrical installation for my new office.",
    date: "2026-10-20",
    status: "New",
  },
  {
    id: 2,
    name: "Amit Verma",
    email: "amit@example.com",
    phone: "9876501234",
    service: "Maintenance",
    message: "I want regular maintenance for our commercial building.",
    date: "2026-10-21",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876512340",
    service: "Interior Designing",
    message: "Please share details about office interior design.",
    date: "2026-10-22",
    status: "Resolved",
  },
  {
    id: 4,
    name: "Vikas Kumar",
    email: "vikas@example.com",
    phone: "9876523451",
    service: "Installation",
    message: "I need installation services for office equipment.",
    date: "2026-10-23",
    status: "New",
  },
];

function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const searchText = [
      enquiry.name,
      enquiry.email,
      enquiry.service,
      enquiry.phone,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setEnquiries((previous) =>
      previous.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      )
    );

    setSelectedEnquiry((previous) =>
      previous && previous.id === id
        ? { ...previous, status }
        : previous
    );
  };

  const deleteEnquiry = (id) => {
    if (window.confirm("Kya aap is enquiry ko delete karna chahte hain?")) {
      setEnquiries((previous) =>
        previous.filter((enquiry) => enquiry.id !== id)
      );

      setSelectedEnquiry((previous) =>
        previous && previous.id === id ? null : previous
      );
    }
  };

  const statusClass = (status) => {
    if (status === "New") return "enquiry-status-new";
    if (status === "In Progress") return "enquiry-status-progress";
    return "enquiry-status-resolved";
  };

  return (
    <div className="manage-enquiries">
      {/* Header */}
      <div className="enquiries-header">
        <div>
          <span className="enquiries-eyebrow">ADMIN PANEL</span>
          <h2>Manage Enquiries</h2>
          <p>View customer enquiries and manage their status.</p>
        </div>

        <div className="enquiries-header-icon">
          <FaEnvelope />
        </div>
      </div>

      {/* Summary cards */}
      <div className="enquiries-summary">
        <div className="enquiry-summary-card">
          <div className="enquiry-summary-icon">
            <FaEnvelope />
          </div>
          <div>
            <p>Total Enquiries</p>
            <h3>{enquiries.length}</h3>
          </div>
        </div>

        <div className="enquiry-summary-card">
          <div className="enquiry-summary-icon new-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <p>New Enquiries</p>
            <h3>
              {enquiries.filter((e) => e.status === "New").length}
            </h3>
          </div>
        </div>

        <div className="enquiry-summary-card">
          <div className="enquiry-summary-icon progress-icon">
            <FaEye />
          </div>
          <div>
            <p>In Progress</p>
            <h3>
              {enquiries.filter((e) => e.status === "In Progress").length}
            </h3>
          </div>
        </div>

        <div className="enquiry-summary-card">
          <div className="enquiry-summary-icon resolved-icon">
            <FaEnvelope />
          </div>
          <div>
            <p>Resolved</p>
            <h3>
              {enquiries.filter((e) => e.status === "Resolved").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="enquiries-toolbar">
        <div className="enquiry-search-box">
          <FaSearch />
          <input
            type="search"
            placeholder="Search name, email, phone or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select enquiry-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter enquiries by status"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="enquiries-table-card">
        <div className="enquiries-table-heading">
          <h4>Customer Enquiries</h4>
          <span>{filteredEnquiries.length} records found</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle enquiries-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>
                    <div className="enquiry-customer">
                      <div className="enquiry-avatar">
                        {enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{enquiry.name}</strong>
                        <small>{enquiry.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>{enquiry.service}</td>
                  <td>{enquiry.date}</td>

                  <td>
                    <select
                      className={`enquiry-status-select ${statusClass(
                        enquiry.status
                      )}`}
                      value={enquiry.status}
                      onChange={(e) =>
                        updateStatus(enquiry.id, e.target.value)
                      }
                      aria-label={`Status for ${enquiry.name}`}
                    >
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </td>

                  <td>
                    <div className="enquiry-actions">
                      <button
                        type="button"
                        className="enquiry-view-btn"
                        onClick={() => setSelectedEnquiry(enquiry)}
                        title="View enquiry"
                        aria-label={`View enquiry from ${enquiry.name}`}
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="enquiry-delete-btn"
                        onClick={() => deleteEnquiry(enquiry.id)}
                        title="Delete enquiry"
                        aria-label={`Delete enquiry from ${enquiry.name}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry details */}
      {selectedEnquiry && (
        <div
          className="enquiry-modal-backdrop"
          onClick={() => setSelectedEnquiry(null)}
        >
          <section
            className="enquiry-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enquiry-modal-header">
              <div>
                <span className="enquiries-eyebrow">CUSTOMER DETAILS</span>
                <h3 id="enquiry-detail-title">Enquiry Details</h3>
              </div>

              <button
                type="button"
                className="enquiry-modal-close"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="enquiry-detail-row">
              <FaUser />
              <div>
                <small>Customer Name</small>
                <strong>{selectedEnquiry.name}</strong>
              </div>
            </div>

            <div className="enquiry-detail-row">
              <FaEnvelope />
              <div>
                <small>Email Address</small>
                <strong>{selectedEnquiry.email}</strong>
              </div>
            </div>

            <div className="enquiry-detail-row">
              <FaPhoneAlt />
              <div>
                <small>Phone Number</small>
                <strong>{selectedEnquiry.phone}</strong>
              </div>
            </div>

            <div className="enquiry-detail-row">
              <FaCalendarAlt />
              <div>
                <small>Enquiry Date</small>
                <strong>{selectedEnquiry.date}</strong>
              </div>
            </div>

            <div className="enquiry-message">
              <small>Requested Service</small>
              <strong>{selectedEnquiry.service}</strong>

              <small>Customer Message</small>
              <p>{selectedEnquiry.message}</p>
            </div>

            <div className="enquiry-detail-status">
              <label htmlFor="detail-status">Update Status</label>
              <select
                id="detail-status"
                className="form-select"
                value={selectedEnquiry.status}
                onChange={(e) =>
                  updateStatus(selectedEnquiry.id, e.target.value)
                }
              >
                <option>New</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <button
              type="button"
              className="btn enquiry-done-btn"
              onClick={() => setSelectedEnquiry(null)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default ManageEnquiries;
