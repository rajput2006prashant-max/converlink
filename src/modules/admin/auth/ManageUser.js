
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
function ManageUsers() {
  const API = "http://localhost:8700/user";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    username: "",
    email: "",
    phone: "",
    gender: "",
    role: "user",
    comments: ""
  };

  const [formData, setFormData] = useState(initialForm);

  // 1. GET USERS DATA
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);

      console.log("Users Data:", response.data);

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("GET ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Users data load nahi ho raha hai."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // 2. INPUT HANDLE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 3. ADD / UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      alert("Name aur Email required hain.");
      return;
    }

    try {
      if (editId) {
        await axios.patch(`${API}/${editId}`, formData);
        alert("User successfully updated!");
      } else {
        await axios.post(API, formData);
        alert("New user successfully added!");
      }

      setFormData(initialForm);
      setEditId(null);
      setShowForm(false);

      getUsers();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("User save nahi hua. API check karo.");
    }
  };

  // 4. EDIT USER
  const handleEdit = (user) => {
    setEditId(user.id);

    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      role: user.role || "user",
      comments: user.comments || ""
    });

    setShowForm(true);
  };

  // 5. DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is user ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);

      alert("User successfully deleted!");

      getUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("User delete nahi hua.");
    }
  };

  // 6. SEARCH USERS
  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      String(user.username || "").toLowerCase().includes(searchValue) ||
      String(user.email || "").toLowerCase().includes(searchValue) ||
      String(user.phone || "").toLowerCase().includes(searchValue) ||
      String(user.role || "").toLowerCase().includes(searchValue)
    );
  });

  // 7. RESET FORM
  const handleAddNew = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  return (
    <div className="container-fluid p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Users</h3>
          <p className="text-muted mb-0">
            Manage all registered users
          </p>
        </div>

        <button
          className="btn text-white mt-2"
          style={{ backgroundColor: "#087FC4" }}
          onClick={handleAddNew}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New User
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Users</p>
              <h3 className="fw-bold mb-0">{users.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">User Accounts</p>
              <h3 className="fw-bold text-success mb-0">
                {users.filter(user => user.role === "user").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Other Roles</p>
              <h3 className="fw-bold text-primary mb-0">
                {users.filter(user => user.role !== "user").length}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* USER TABLE */}
      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

            <h5 className="fw-bold mb-0">User List</h5>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-primary"
                onClick={getUsers}
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
              <p className="mt-2 mb-0">Loading users...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={getUsers}
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
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Role</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id}>

                        <td>{index + 1}</td>

                        <td className="fw-semibold">
                          {user.username || "-"}
                        </td>

                        <td>{user.email || "-"}</td>

                        <td>{user.phone || "-"}</td>

                        <td>
                          {user.gender || "-"}
                        </td>

                        <td>
                          <span className="badge bg-primary">
                            {user.role || "user"}
                          </span>
                        </td>

                        <td>
                          {user.comments || "-"}
                        </td>

                        <td>
                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                                <MdDelete/>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(user.id)}
                              title="Delete"
                            >
                               <FaEdit/>
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No users found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        <div className="card-footer bg-white text-muted">
          Showing {filteredUsers.length} of {users.length} users
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
            style={{ width: "550px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto" }}
          >

            <div className="card-header text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">
                {editId ? "Edit User" : "Add New User"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={closeForm}
              ></button>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">User Name *</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter user name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="student">Student</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Comments</label>
                  <textarea
                    name="comments"
                    className="form-control"
                    rows="3"
                    placeholder="Enter comments"
                    value={formData.comments}
                    onChange={handleChange}
                  ></textarea>
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
                  >
                    {editId ? "Update User" : "Save User"}
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

export default ManageUsers;
