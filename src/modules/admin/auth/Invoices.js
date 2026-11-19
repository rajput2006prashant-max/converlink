
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8700/invoices";

const initialForm = {
  clientName: "",
  email: "",
  mobile: "",
  service: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  status: "Draft"
};

function ManageInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invoice data fetch
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setInvoices(response.data);
      setError("");
    } catch (err) {
      setError("Invoice data load nahi ho raha hai. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Input handle
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice"
          ? Number(value)
          : value
    }));
  };

  // Total amount
  const totalAmount =
    Number(formData.quantity) * Number(formData.unitPrice);

  // Add form open
  const openAddForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  // Edit invoice
  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setFormData({
      ...initialForm,
      ...invoice
    });
    setShowForm(true);
  };

  // Save invoice
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const invoiceData = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        totalAmount,
        invoiceNo:
          editingId
            ? formData.invoiceNo
            : `INV-${Date.now()}`,
      };

      if (editingId) {
        await axios.patch(
          `${API_URL}/${editingId}`,
          invoiceData
        );
        alert("Invoice successfully updated!");
      } else {
        await axios.post(API_URL, invoiceData);
        alert("New invoice successfully added!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchInvoices();
    } catch (err) {
      alert("Invoice save nahi hua. JSON Server check karo.");
    }
  };

  // Delete invoice
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is invoice ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchInvoices();
    } catch (err) {
      alert("Invoice delete nahi hua.");
    }
  };

  // Status update
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { status });
      fetchInvoices();
    } catch (err) {
      alert("Status update nahi hua.");
    }
  };

  // Search
  const filteredInvoices = invoices.filter((invoice) =>
    [
      invoice.invoiceNo,
      invoice.clientName,
      invoice.email,
      invoice.mobile,
      invoice.service,
      invoice.status
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Currency format
  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    });

  const totalValue = invoices.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const paidAmount = invoices
    .filter((item) => item.status === "Paid")
    .reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    );

  const pendingCount = invoices.filter(
    (item) => item.status === "Sent" || item.status === "Overdue"
  ).length;

  const statusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Sent":
        return "primary";
      case "Overdue":
        return "danger";
      case "Cancelled":
        return "secondary";
      default:
        return "warning";
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Manage Invoices
          </h3>
          <p className="text-muted mb-0">
            Create and manage all company invoices
          </p>
        </div>

        <button
          className="btn text-white"
          style={{ backgroundColor: "#087FC4" }}
          onClick={openAddForm}
        >
          + Create Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Invoices</p>
              <h3 className="fw-bold" style={{ color: "#102D4F" }}>
                {invoices.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Invoice Value</p>
              <h4 className="fw-bold text-primary">
                {formatAmount(totalValue)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Paid Amount</p>
              <h4 className="fw-bold text-success">
                {formatAmount(paidAmount)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Pending Invoices</p>
              <h3 className="fw-bold text-warning">
                {pendingCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h5 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
              Invoice List
            </h5>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "300px" }}
              placeholder="Search invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {loading ? (
            <p className="text-center py-4">Loading invoices...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Invoice No.</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice, index) => (
                      <tr key={invoice.id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">
                          {invoice.invoiceNo}
                        </td>
                        <td>
                          <div className="fw-semibold">
                            {invoice.clientName}
                          </div>
                          <small className="text-muted">
                            {invoice.email}
                          </small>
                        </td>
                        <td>{invoice.service}</td>
                        <td>{invoice.invoiceDate}</td>
                        <td>{invoice.dueDate || "-"}</td>
                        <td className="fw-semibold">
                          {formatAmount(invoice.totalAmount)}
                        </td>
                        <td>
                          <select
                            className={`form-select form-select-sm text-${statusColor(invoice.status)}`}
                            style={{ minWidth: "115px" }}
                            value={invoice.status}
                            onChange={(e) =>
                              handleStatusChange(
                                invoice.id,
                                e.target.value
                              )
                            }
                          >
                            {[
                              "Draft",
                              "Sent",
                              "Paid",
                              "Overdue",
                              "Cancelled"
                            ].map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(invoice)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(invoice.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-muted">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 2000,
            overflowY: "auto"
          }}
        >
          <div
            className="card border-0 shadow-lg w-100"
            style={{ maxWidth: "750px", maxHeight: "95vh", overflowY: "auto" }}
          >
            <div
              className="card-header text-white d-flex justify-content-between align-items-center py-3"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">
                {editingId ? "Edit Invoice" : "Create New Invoice"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={() => setShowForm(false)}
                type="button"
              ></button>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Client Name *</label>
                    <input
                      type="text"
                      name="clientName"
                      className="form-control"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile *</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
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

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="2"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      className="form-control"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      name="unitPrice"
                      className="form-control"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Total Amount</label>
                    <input
                      type="text"
                      className="form-control fw-bold"
                      value={formatAmount(totalAmount)}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Invoice Date *</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      className="form-control"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      className="form-control"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Invoice Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#087FC4" }}
                  >
                    {editingId ? "Update Invoice" : "Save Invoice"}
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

export default ManageInvoices;
