
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ManageOrders() {
  const API = "http://localhost:8700/orders";

  const initialForm = {
    clientName: "",
    email: "",
    mobile: "",
    service: "",
    amount: "",
    orderDate: new Date().toISOString().slice(0, 10),
    status: "Pending"
  };

  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // GET ORDERS
  const getOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Orders API Error:", err);
      setError(err.message || "Orders load nahi ho rahe hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

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
      orderDate: new Date().toISOString().slice(0, 10)
    });
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const handleEdit = (order) => {
    setEditId(order.id);

    setFormData({
      clientName: order.clientName || "",
      email: order.email || "",
      mobile: order.mobile || "",
      service: order.service || "",
      amount: order.amount || "",
      orderDate: order.orderDate || "",
      status: order.status || "Pending"
    });

    setShowForm(true);
  };

  // ADD / UPDATE ORDER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const orderData = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (editId) {
        await axios.patch(`${API}/${editId}`, orderData);
        alert("Order successfully updated!");
      } else {
        await axios.post(API, orderData);
        alert("New order successfully added!");
      }

      setShowForm(false);
      setEditId(null);
      setFormData(initialForm);

      await getOrders();
    } catch (err) {
      console.error("Save Order Error:", err);
      alert("Order save nahi hua. JSON Server check karo.");
    } finally {
      setSaving(false);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      await getOrders();
    } catch (err) {
      console.error("Status Error:", err);
      alert("Status update nahi hua.");
    }
  };

  // DELETE ORDER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is order ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);
      alert("Order deleted successfully!");
      await getOrders();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Order delete nahi hua.");
    }
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  // SEARCH
  const filteredOrders = orders.filter((order) => {
    const value = search.toLowerCase();

    return (
      String(order.clientName || "").toLowerCase().includes(value) ||
      String(order.email || "").toLowerCase().includes(value) ||
      String(order.mobile || "").toLowerCase().includes(value) ||
      String(order.service || "").toLowerCase().includes(value) ||
      String(order.status || "").toLowerCase().includes(value)
    );
  });

  // SUMMARY
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalAmount = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  const statusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success";
      case "In Progress":
        return "bg-primary";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <div className="container-fluid p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Orders</h3>
          <p className="text-muted mb-0">
            Manage and track all customer orders
          </p>
        </div>

        <button
          className="btn text-white mt-2"
          style={{ backgroundColor: "#087FC4" }}
          onClick={handleAdd}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Order
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Total Orders</p>
              <h3 className="fw-bold">{orders.length}</h3>
              <i className="bi bi-cart text-primary fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Pending Orders</p>
              <h3 className="fw-bold text-warning">{pendingOrders}</h3>
              <i className="bi bi-clock-history text-warning fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Completed Orders</p>
              <h3 className="fw-bold text-success">{completedOrders}</h3>
              <i className="bi bi-check-circle text-success fs-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Total Order Amount</p>
              <h3 className="fw-bold text-primary">
                ₹{totalAmount.toLocaleString("en-IN")}
              </h3>
              <i className="bi bi-currency-rupee text-primary fs-4"></i>
            </div>
          </div>
        </div>

      </div>

      {/* ORDER TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Order List</h5>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-primary"
                onClick={getOrders}
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
              <p className="mt-2">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={getOrders}
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
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={order.id}>

                        <td>{index + 1}</td>

                        <td className="fw-semibold">
                          {order.clientName}
                        </td>

                        <td>
                          <div>{order.email}</div>
                          <small className="text-muted">
                            {order.mobile}
                          </small>
                        </td>

                        <td>{order.service}</td>

                        <td>
                          ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td>{order.orderDate || "-"}</td>

                        <td>
                          <select
                            className={`form-select form-select-sm ${statusClass(order.status)}`}
                            style={{ minWidth: "125px" }}
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td>
                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(order)}
                              title="Edit"
                            >
                             <FaEdit/>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(order.id)}
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
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>
          )}

        </div>

        <div className="card-footer bg-white text-muted">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

      </div>

      {/* ADD / EDIT ORDER FORM */}
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
              width: "550px",
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
                {editId ? "Edit Order" : "Add New Order"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={closeForm}
              ></button>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>

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

                <div className="mb-3">
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

                <div className="mb-3">
                  <label className="form-label">Mobile *</label>
                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                  />
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
                  <label className="form-label">Order Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    min="0"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Order Date</label>
                  <input
                    type="date"
                    name="orderDate"
                    className="form-control"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Order Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                        ? "Update Order"
                        : "Save Order"}
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

export default ManageOrders;
