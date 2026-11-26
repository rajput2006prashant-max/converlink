import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { useGlobalSettings } from "../../../Context/SettingsContext";

const API = "http://localhost:8700/admin";

function ManageAdmins() {
  // States
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useGlobalSettings();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [editId, setEditId] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Admin",
    status: "Active",
  });

  // Fetch Admin Data
  const getAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);

      console.log("Admin Data:", response.data);

      if (Array.isArray(response.data)) {
        setAdmins(response.data);
      } else {
        setAdmins([]);
        setError("Admin data format is incorrect.");
      }
    } catch (error) {
      console.log("Admin Fetch Error:", error);

      setError(
        error.response?.status === 404
          ? "Admin API not found. Check db.json admin key."
          : "Admin data load nahi ho raha hai.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      role: "Admin",
      status: "Active",
    });

    setEditId(null);
  };

  // Add Admin
  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  // Add / Update Admin
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId !== null) {
        await axios.patch(`${API}/${editId}`, formData);

        alert("Admin Updated Successfully!");
      } else {
        // Check duplicate email
        const duplicateEmail = admins.some(
          (admin) =>
            String(admin.email || "").toLowerCase() ===
            formData.email.toLowerCase(),
        );

        if (duplicateEmail) {
          alert("This email already exists!");
          return;
        }

        await axios.post(API, formData);

        alert("Admin Added Successfully!");
      }

      setShowForm(false);
      resetForm();

      await getAdmins();
    } catch (error) {
      console.log("Save Admin Error:", error);
      alert("Something went wrong!");
    }
  };

  // Edit Admin
  const handleEdit = (admin) => {
    setEditId(admin.id);

    setFormData({
      name: admin.name || admin.username || "",
      email: admin.email || "",
      mobile: admin.mobile || admin.phone || "",
      role: admin.role || "Admin",
      status: admin.status || "Active",
    });

    setShowForm(true);
  };

  // View Admin
  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setShowDetails(true);
  };

  // Delete Admin
  const handleDelete = async (admin) => {
    if (admin.role === "Super Admin") {
      alert("Super Admin account cannot be deleted here.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${admin.name || admin.username}?`,
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${admin.id}`);

      alert("Admin Deleted Successfully!");

      await getAdmins();
    } catch (error) {
      console.log("Delete Admin Error:", error);
      alert("Admin Delete Failed!");
    }
  };

  // Search Filter
  const filteredAdmins = admins.filter((admin) => {
    const searchValue = search.toLowerCase();

    return (
      String(admin.name || admin.username || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(admin.email || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(admin.mobile || admin.phone || "").includes(searchValue) ||
      String(admin.role || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(admin.status || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // Summary Counts
  const totalAdmins = admins.length;

  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active",
  ).length;

  const inactiveAdmins = admins.filter(
    (admin) => admin.status === "Inactive",
  ).length;

  const superAdmins = admins.filter(
    (admin) => admin.role === "Super Admin",
  ).length;

  return (
    <div className="manage-admins-page">
      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{
              background:"#087FC4",
              width:"210px",
              borderRadius:"10px",
              padding:"10px",
            }}>Manage Admins</h4>

          <p className="fw-bold mb-1" style={{ color: "blue" }}>
            Manage company administrator accounts and roles.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>
          Add New Admin
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="dashboard-card" style={{ backgroundColor: "#087FC4",width:"200px",
            borderRadius:"5px",
            padding:"10px" }}     >
            <p className="card-label">Total Admins</p>
            <h3>{totalAdmins}</h3>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="dashboard-card" style={{ backgroundColor: "#087FC4",width:"200px",
            borderRadius:"5px",
            padding:"10px" }}>
            <p className="card-label">Active Admins</p>
            <h3>{activeAdmins}</h3>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="dashboard-card" style={{ backgroundColor: "#087FC4",width:"200px",
            borderRadius:"5px",
            padding:"10px" }}>
            <p className="card-label">Inactive Admins</p>
            <h3>{inactiveAdmins}</h3>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="dashboard-card" style={{ backgroundColor: "#087FC4",
            width:"200px",
            borderRadius:"5px",
            padding:"10px"
           }}>
            <p className="card-label">Super Admins</p>
            <h3>{superAdmins}</h3>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div
  className="dashboard-panel"
  style={{
    background: theme === "dark" ? "#202C40" : "transparent",
    color: theme === "dark" ? "#fff" : "#212529",
    transition: "all 0.3s ease"
  }}
>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 ">
          <h5
            className="mb-0"
            style={{ color: "white", backgroundColor: "#087FC4", width:"190px", borderRadius: "5px", padding:"10px" }}
          >
            All Administrators
          </h5>

          <input
            type="text"
            className="form-control"
            placeholder="Search name, email, mobile..."
            style={{ maxWidth: "300px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No</th>
                <th>Admin Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Loading Admins...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No Admins Found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin, index) => (
                  <tr key={admin.id}>
                    {/* Serial Number */}
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {admin.name || admin.username || "-"}
                    </td>

                    <td>{admin.email || "-"}</td>

                    <td>{admin.mobile || admin.phone || "-"}</td>

                    <td>
                      <span
                        className={`badge ${
                          admin.role === "Super Admin"
                            ? "bg-primary"
                            : admin.role === "Manager"
                              ? "bg-info text-dark"
                              : "bg-secondary"
                        }`}
                      >
                        {admin.role || "Admin"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          admin.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {admin.status || "Active"}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Admin"
                          onClick={() => handleView(admin)}
                        >
                          <CiViewList />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Admin"
                          onClick={() => handleEdit(admin)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Admin"
                          onClick={() => handleDelete(admin)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className=" small">
          Showing {filteredAdmins.length} of {admins.length} admins
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="user-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                {editId !== null ? "Edit Admin" : "Add New Admin"}
              </h5>

              <button
                className="btn-close"
                onClick={() => setShowForm(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Admin Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter admin name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number</label>

                <input
                  type="tel"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter 10 digit mobile"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Admin Role</label>

                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={
                    editId !== null &&
                    admins.find((admin) => String(admin.id) === String(editId))
                      ?.role === "Super Admin"
                  }
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Account Status</label>

                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editId !== null ? "Update Admin" : "Save Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedAdmin && (
        <div
          className="user-modal-backdrop"
          onClick={() => setShowDetails(false)}
        >
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Admin Details</h5>

              <button
                className="btn-close"
                onClick={() => setShowDetails(false)}
              ></button>
            </div>

            <div className="admin-details">
              <h5 className="mb-3">
                {selectedAdmin.name || selectedAdmin.username || "-"}
              </h5>

              <p>
                <strong>Admin ID:</strong> {selectedAdmin.id}
              </p>

              <p>
                <strong>Email:</strong> {selectedAdmin.email || "-"}
              </p>

              <p>
                <strong>Mobile:</strong>{" "}
                {selectedAdmin.mobile || selectedAdmin.phone || "-"}
              </p>

              <p>
                <strong>Role:</strong> {selectedAdmin.role || "Admin"}
              </p>

              <p>
                <strong>Status:</strong> {selectedAdmin.status || "Active"}
              </p>
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => setShowDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAdmins;
