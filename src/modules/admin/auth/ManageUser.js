
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete, MdVisibility } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ManageUsers() {
  const API = "http://localhost:8700/user";
  const PROFILE_API = "http://localhost:8700/userprofile";
  const MESSAGE_API = "http://localhost:8700/messages";

  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    username: "",
    email: "",
    phone: "",
    gender: "",
    role: "user",
    comments: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialForm);

  // GET USERS AND PROFILES
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, profileResponse] = await Promise.all([
        axios.get(API),
        axios.get(PROFILE_API),
      ]);

      setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
      setProfiles(
        Array.isArray(profileResponse.data) ? profileResponse.data : []
      );
    } catch (err) {
      console.error("GET ERROR:", err);
      setError("Users data load nahi ho raha hai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // FIND USER PROFILE
  const getUserProfile = (userId) => {
    return profiles.find(
      (profile) => String(profile.userId) === String(userId)
    );
  };

  // INPUT HANDLE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD / UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      alert("Name aur Email required hain.");
      return;
    }

    try {
      let userId = editId;

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        gender: formData.gender,
        role: formData.role,
        comments: formData.comments,
      };

      if (editId) {
        await axios.patch(
          `${API}/${encodeURIComponent(editId)}`,
          userData
        );
      } else {
        const response = await axios.post(API, {
          ...userData,
          pass: "",
        });

        userId = response.data.id;
      }

      // SAVE PROFILE
      if (userId) {
        const profileData = {
          userId: String(userId),
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone,
          gender: formData.gender,
          role: formData.role,
          address: formData.address,
        };

        const existingProfile = profiles.find(
          (profile) => String(profile.userId) === String(userId)
        );

        if (existingProfile) {
          await axios.patch(
            `${PROFILE_API}/${encodeURIComponent(existingProfile.id)}`,
            profileData
          );
        } else {
          await axios.post(PROFILE_API, profileData);
        }
      }

      alert(editId ? "User successfully updated!" : "New user successfully added!");

      setFormData(initialForm);
      setEditId(null);
      setShowForm(false);

      await getUsers();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("User save nahi hua. API check karo.");
    }
  };

  // EDIT USER
  const handleEdit = (user) => {
    const profile = getUserProfile(user.id);

    setEditId(user.id);

    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      role: user.role || "user",
      comments: user.comments || "",
      address: profile?.address || user.address || "",
    });

    setShowForm(true);
  };

  // DELETE USER + PROFILE + COMPLETE CHAT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is user ko delete karna chahte hain? User profile aur user-admin dono ki complete chat bhi delete ho jayegi."
    );

    if (!confirmDelete) return;

    try {
      // 1. GET ALL MESSAGES
      const messageResponse = await axios.get(MESSAGE_API);

      // 2. FIND ALL MESSAGES OF THIS USER
      // Isme sender user aur sender admin dono include hain
      const userMessages = messageResponse.data.filter(
        (message) => String(message.userId) === String(id)
      );

      // 3. DELETE USER + ADMIN MESSAGES
      await Promise.all(
        userMessages.map((message) =>
          axios.delete(
            `${MESSAGE_API}/${encodeURIComponent(message.id)}`
          )
        )
      );

      // 4. GET USER PROFILES
      const profileResponse = await axios.get(PROFILE_API);

      const userProfiles = profileResponse.data.filter(
        (profile) => String(profile.userId) === String(id)
      );

      // 5. DELETE USER PROFILES
      await Promise.all(
        userProfiles.map((profile) =>
          axios.delete(
            `${PROFILE_API}/${encodeURIComponent(profile.id)}`
          )
        )
      );

      // 6. DELETE USER ACCOUNT
      await axios.delete(
        `${API}/${encodeURIComponent(id)}`
      );

      alert(
        "User, profile aur user-admin dono ki complete chat successfully delete ho gayi!"
      );

      setSelectedUser(null);
      setShowDetails(false);

      await getUsers();

    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Delete nahi hua. JSON Server aur API check karo.");
    }
  };

  // SEARCH USERS
  const filteredUsers = users.filter((user) => {
    const profile = getUserProfile(user.id);
    const searchValue = search.toLowerCase();

    return (
      String(user.username || "").toLowerCase().includes(searchValue) ||
      String(user.email || "").toLowerCase().includes(searchValue) ||
      String(user.phone || "").toLowerCase().includes(searchValue) ||
      String(user.role || "").toLowerCase().includes(searchValue) ||
      String(user.id || "").toLowerCase().includes(searchValue) ||
      String(profile?.address || "").toLowerCase().includes(searchValue)
    );
  });

  // ADD NEW USER
  const handleAddNew = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  // VIEW USER DETAILS
  const handleView = (user) => {
    const profile = getUserProfile(user.id);

    setSelectedUser({
      ...user,
      address: profile?.address || user.address || "",
      profileImage: profile?.profileImage || user.profileImage || "",
    });

    setShowDetails(true);
  };

  // USER AVATAR
  const UserAvatar = ({ user, size = 42 }) => {
    const profile = getUserProfile(user.id);
    const photo = profile?.profileImage || user.profileImage;

    return photo ? (
      <img
        src={photo}
        alt="User"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #087FC4",
        }}
      />
    ) : (
      <div
        className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
        style={{
          width: size,
          height: size,
          backgroundColor: "#087FC4",
          fontSize: size / 2.5,
        }}
      >
        {(user.username || "U").charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="container-fluid p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3
            className="fw-bold mb-1 text-white"
            style={{
              backgroundColor: "#087FC4",
              width: "210px",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            Manage Users
          </h3>

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
            <div className="card-body" style={{ backgroundColor: "#087FC4" }}>
              <p className="text-white mb-1">Total Users</p>
              <h3 className="fw-bold text-white mb-0">{users.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body" style={{ backgroundColor: "#087FC4" }}>
              <p className="text-white mb-1">User Accounts</p>
              <h3 className="fw-bold text-white mb-0">
                {users.filter((user) => user.role === "user").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body" style={{ backgroundColor: "#087FC4" }}>
              <p className="text-white mb-1">Other Roles</p>
              <h3 className="fw-bold text-white mb-0">
                {users.filter((user) => user.role !== "user").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5
              className="fw-bold mb-0 text-white"
              style={{
                backgroundColor: "#087FC4",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              User List
            </h5>

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
                    <th>DP</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => {
                      const profile = getUserProfile(user.id);

                      return (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td><UserAvatar user={user} /></td>
                          <td><small>{user.id || "-"}</small></td>
                          <td className="fw-semibold">{user.username || "-"}</td>
                          <td>{user.email || "-"}</td>
                          <td>{user.phone || "-"}</td>
                          <td>{user.gender || "-"}</td>
                          <td>{profile?.address || user.address || "-"}</td>

                          <td>
                            <span className="badge bg-primary">
                              {user.role || "user"}
                            </span>
                          </td>

                          <td>{user.comments || "-"}</td>

                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleView(user)}
                                title="View Details"
                              >
                                <MdVisibility />
                              </button>

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(user)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(user.id)}
                                title="Delete User and Chat"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
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
            padding: "15px",
          }}
        >
          <div
            className="card border-0 shadow"
            style={{
              width: "550px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
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
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
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

      {/* USER DETAILS POPUP */}
      {showDetails && selectedUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1060,
            padding: "15px",
          }}
        >
          <div
            className="card border-0 shadow"
            style={{
              width: "550px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">User Complete Details</h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setShowDetails(false)}
              ></button>
            </div>

            <div className="card-body text-center">
              {selectedUser.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt="User Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                    border: "4px solid #087FC4",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                  style={{
                    width: "110px",
                    height: "110px",
                    fontSize: "40px",
                    backgroundColor: "#087FC4",
                  }}
                >
                  {(selectedUser.username || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <h4 className="fw-bold mb-1">
                {selectedUser.username || "-"}
              </h4>

              <span className="badge bg-primary mb-3">
                {selectedUser.role || "user"}
              </span>

              <div className="text-start border rounded p-3">
                <p><strong>User ID:</strong> {selectedUser.id || "-"}</p>
                <p><strong>Name:</strong> {selectedUser.username || "-"}</p>
                <p><strong>Email:</strong> {selectedUser.email || "-"}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || "-"}</p>
                <p><strong>Gender:</strong> {selectedUser.gender || "-"}</p>
                <p><strong>Address:</strong> {selectedUser.address || "-"}</p>
                <p><strong>Role:</strong> {selectedUser.role || "-"}</p>
                <p className="mb-0">
                  <strong>Comments:</strong> {selectedUser.comments || "-"}
                </p>
              </div>
            </div>

            <div className="card-footer text-end">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageUsers;
