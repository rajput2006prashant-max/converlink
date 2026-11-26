
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ManageQuotations() {
  const API = "http://localhost:8700/quotations";

  const initialForm = {
    quotationNo: "",
    clientName: "",
    email: "",
    mobile: "",
    service: "",
    description: "",
    quantity: 1,
    unitPrice: "",
    validUntil: "",
    status: "Draft"
  };

  const [quotations, setQuotations] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // GET QUOTATIONS
  const getQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);
      setQuotations(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Quotation API Error:", err);
      setError(err.message || "Quotations load nahi ho rahe hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuotations();
  }, []);

  // CALCULATE TOTAL
  const totalAmount =
    Number(formData.quantity || 0) *
    Number(formData.unitPrice || 0);

  // INPUT HANDLE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // OPEN ADD FORM
  const handleAdd = () => {
    setEditId(null);

    setFormData({
      ...initialForm,
      quotationNo: `QUO-${Date.now()}`,
      validUntil: new Date().toISOString().slice(0, 10)
    });

    setShowForm(true);
  };

  // OPEN EDIT FORM
  const handleEdit = (quotation) => {
    setEditId(quotation.id);

    setFormData({
      quotationNo: quotation.quotationNo || "",
      clientName: quotation.clientName || "",
      email: quotation.email || "",
      mobile: quotation.mobile || "",
      service: quotation.service || "",
      description: quotation.description || "",
      quantity: quotation.quantity || 1,
      unitPrice: quotation.unitPrice || "",
      validUntil: quotation.validUntil || "",
      status: quotation.status || "Draft"
    });

    setShowForm(true);
  };

  // SAVE / UPDATE QUOTATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.quantity) <= 0 ||
        Number(formData.unitPrice) < 0) {
      alert("Quantity aur price sahi enter karo.");
      return;
    }

    try {
      setSaving(true);

      const quotationData = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        totalAmount: totalAmount
      };

      if (editId) {
        await axios.patch(
          `${API}/${editId}`,
          quotationData
        );

        alert("Quotation successfully updated!");
      } else {
        await axios.post(API, quotationData);
        alert("New quotation successfully created!");
      }

      setShowForm(false);
      setEditId(null);
      setFormData(initialForm);

      await getQuotations();

    } catch (err) {
      console.error("Quotation Save Error:", err);
      alert("Quotation save nahi hua. JSON Server check karo.");
    } finally {
      setSaving(false);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      await getQuotations();
    } catch (err) {
      console.error("Status Error:", err);
      alert("Status update nahi hua.");
    }
  };

  // DELETE QUOTATION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is quotation ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);
      alert("Quotation deleted successfully!");
      await getQuotations();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Quotation delete nahi hua.");
    }
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  // SEARCH
  const filteredQuotations = quotations.filter((item) => {
    const value = search.toLowerCase();

    return (
      String(item.quotationNo || "").toLowerCase().includes(value) ||
      String(item.clientName || "").toLowerCase().includes(value) ||
      String(item.email || "").toLowerCase().includes(value) ||
      String(item.mobile || "").toLowerCase().includes(value) ||
      String(item.service || "").toLowerCase().includes(value) ||
      String(item.status || "").toLowerCase().includes(value)
    );
  });

  // SUMMARY
  const draftCount = quotations.filter(
    (item) => item.status === "Draft"
  ).length;

  const sentCount = quotations.filter(
    (item) => item.status === "Sent"
  ).length;

  const acceptedCount = quotations.filter(
    (item) => item.status === "Accepted"
  ).length;

  const totalQuotationValue = quotations.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const statusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-success";
      case "Sent":
        return "bg-primary";
      case "Rejected":
        return "bg-danger";
      case "Expired":
        return "bg-secondary";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <div className="container-fluid p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Quotations</h3>
          <p className="text-muted mb-0"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
            Create and manage customer quotations
          </p>
        </div>

        <button
          className="btn text-white mt-2"
          style={{ backgroundColor: "#087FC4" }}
          onClick={handleAdd}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Create Quotation
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-1">Total Quotations</p>
              <h3 className="fw-bold">{quotations.length}</h3>
              <i className="bi bi-file-earmark-text text-primary fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-1">Draft Quotations</p>
              <h3 className="fw-bold text-warning">{draftCount}</h3>
              <i className="bi bi-pencil-square text-warning fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-1">Sent Quotations</p>
              <h3 className="fw-bold text-primary">{sentCount}</h3>
              <i className="bi bi-send text-primary fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
              <p className="text-muted mb-1">Accepted Quotations</p>
              <h3 className="fw-bold text-success">{acceptedCount}</h3>
              <i className="bi bi-check-circle text-success fs-4"></i>
            </div>
          </div>
        </div>

      </div>

      {/* TOTAL VALUE */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body"style={{
               
                backgroundColor: " #087FC4",
                padding: "10px",
                 borderRadius: "5px",
              }}>
          <p className="text-muted mb-1">Total Quotation Value</p>
          <h3 className="fw-bold text-primary mb-0">
            ₹{totalQuotationValue.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>

      {/* QUOTATION TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0" style={{
              background:"#087FC4",
              width:"180px",
              borderRadius:"10px",
              padding:"10px",
            }}>Quotation List</h5>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search quotations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-primary"
                onClick={getQuotations}
                title="Refresh"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading quotations...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={getQuotations}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Quotation No.</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuotations.length > 0 ? (
                    filteredQuotations.map((item, index) => (
                      <tr key={item.id}>

                        <td>{index + 1}</td>

                        <td className="fw-semibold">
                          {item.quotationNo || "-"}
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {item.clientName}
                          </div>
                          <small className="">
                            {item.email}
                          </small>
                        </td>

                        <td>{item.service}</td>

                        <td className="fw-semibold">
                          ₹{Number(item.totalAmount || 0).toLocaleString("en-IN")}
                        </td>

                        <td>{item.validUntil || "-"}</td>

                        <td>
                          <select
                            className={`form-select form-select-sm ${statusClass(item.status)}`}
                            style={{ minWidth: "115px" }}
                            value={item.status || "Draft"}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value)
                            }
                          >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Expired">Expired</option>
                          </select>
                        </td>

                        <td>
                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                            >
                             <FaEdit />
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item.id)}
                              title="Delete"
                            >
                            <MdDelete/>
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No quotations found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>
          )}

        </div>

        <div className="card-footer bg-white text-muted">
          Showing {filteredQuotations.length} of {quotations.length} quotations
        </div>

      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            padding: "15px"
          }}
        >

          <div
            className="card border-0 shadow"
            style={{
              width: "600px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >

            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">
                {editId ? "Edit Quotation" : "Create New Quotation"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={closeForm}
              ></button>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Quotation Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.quotationNo}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    className="form-control"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile *</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile"
                      required
                    />
                  </div>

                </div>

                <div className="mb-3">
                  <label className="form-label">Service *</label>
                  <select
                    name="service"
                    className="form-select"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service</option>
                    <option value="Electrical Work">Electrical Work</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Installation">Installation</option>
                    <option value="Interior Designing">Interior Designing</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter quotation details"
                  ></textarea>
                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      className="form-control"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      name="unitPrice"
                      className="form-control"
                      min="0"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                </div>

                <div className="alert alert-info">
                  <strong>Total Amount:</strong>
                  <span className="float-end fw-bold">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Valid Until *</label>
                    <input
                      type="date"
                      name="validUntil"
                      className="form-control"
                      value={formData.validUntil}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>

                </div>

                <div className="d-flex justify-content-end gap-2">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#087FC4" }}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editId
                        ? "Update Quotation"
                        : "Save Quotation"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageQuotations;
