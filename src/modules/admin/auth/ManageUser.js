
import React, { useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaUserShield
} from "react-icons/fa";


function ManageUsers() {
  const initialUsers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      role: "User",
      status: "Active"
    },
    {
      id: 2,
      name: "Amit Verma",
      email: "amit@example.com",
      phone: "9876543211",
      role: "Manager",
      status: "Active"
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@example.com",
      phone: "9876543212",
      role: "User",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "9876543213",
      role: "User",
      status: "Active"
    }
  ];

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: "User",
    status: "Active"
  };

  const [form, setForm] = useState(emptyForm);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingId(user.id);
    setForm({ ...user });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingId ? { ...form, id: editingId } : user
        )
      );
    } else {
      const newUser = {
        ...form,
        id: Date.now()
      };

      setUsers((previous) => [newUser, ...previous]);
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((previous) => previous.filter((user) => user.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active"
            }
          : user
      )
    );
  };

  return (
    <div className="manage-users-page">
      {/* Header */}
      <div className="mu-header">
        <div>
          <span className="mu-eyebrow">ADMINISTRATION</span>
          <h2>Manage Users</h2>
          <p>Manage company users, accounts and access roles.</p>
        </div>

        <button className="mu-add-btn" onClick={openAddForm}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      {/* Statistics */}
      <div className="mu-stats">
        <div className="mu-stat-card">
          <div className="mu-stat-icon blue"><FaUsers /></div>
          <div>
            <p>Total Users</p>
            <h3>{users.length}</h3>
          </div>
        </div>

        <div className="mu-stat-card">
          <div className="mu-stat-icon green"><FaUserShield /></div>
          <div>
            <p>Active Users</p>
            <h3>{users.filter((u) => u.status === "Active").length}</h3>
          </div>
        </div>

        <div className="mu-stat-card">
          <div className="mu-stat-icon purple"><FaUserShield /></div>
          <div>
            <p>Managers</p>
            <h3>{users.filter((u) => u.role === "Manager").length}</h3>
          </div>
        </div>
      </div>

      {/* User Table */}
      <section className="mu-panel">
        <div className="mu-toolbar">
          <div>
            <h4>All Users</h4>
            <p>{filteredUsers.length} users found</p>
          </div>

          <div className="mu-filters">
            <div className="mu-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>

        <div className="mu-table-wrap">
          <table className="mu-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="mu-user-info">
                      <div className="mu-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.name}</strong>
                        <small>ID: {user.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="mu-contact">
                      <span><FaEnvelope /> {user.email}</span>
                      <span><FaPhone /> {user.phone}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`mu-role ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`mu-status ${user.status.toLowerCase()}`}
                      onClick={() => toggleStatus(user.id)}
                      title="Click to change status"
                    >
                      <span />
                      {user.status}
                    </button>
                  </td>

                  <td>
                    <div className="mu-actions">
                      <button
                        className="mu-icon-btn edit"
                        title="Edit user"
                        onClick={() => openEditForm(user)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="mu-icon-btn delete"
                        title="Delete user"
                        onClick={() => deleteUser(user.id)}
                      >
                        <FaTrash />
                      </button>

                      <button
                        className="mu-icon-btn view"
                        title="View user"
                        onClick={() => setSelectedUser(user)}
                      >
                        <FaUsers />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="mu-no-data">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="mu-modal-backdrop">
          <div className="mu-modal">
            <div className="mu-modal-heading">
              <div>
                <h4>{editingId !== null ? "Edit User" : "Add New User"}</h4>
                <p>Enter user details below.</p>
              </div>

              <button
                className="mu-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              <div className="mu-form-row">
                <div>
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mu-form-actions">
                <button
                  type="button"
                  className="mu-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mu-add-btn">
                  {editingId !== null ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {selectedUser && (
        <div className="mu-modal-backdrop">
          <div className="mu-modal mu-view-modal">
            <div className="mu-modal-heading">
              <h4>User Details</h4>
              <button
                className="mu-close-btn"
                onClick={() => setSelectedUser(null)}
                aria-label="Close details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mu-detail-avatar">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="mu-detail-name">{selectedUser.name}</h3>

            <div className="mu-detail-row">
              <strong>Email</strong><span>{selectedUser.email}</span>
            </div>
            <div className="mu-detail-row">
              <strong>Phone</strong><span>{selectedUser.phone}</span>
            </div>
            <div className="mu-detail-row">
              <strong>Role</strong><span>{selectedUser.role}</span>
            </div>
            <div className="mu-detail-row">
              <strong>Status</strong><span>{selectedUser.status}</span>
            </div>

            <button
              className="mu-add-btn mu-full-btn"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
