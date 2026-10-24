import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaProjectDiagram,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";



const initialProjects = [
  {
    id: 1,
    name: "Office Electrical Installation",
    category: "Electrical Work",
    location: "Noida, Uttar Pradesh",
    date: "2026-08-15",
    status: "Completed",
  },
  {
    id: 2,
    name: "Commercial Building Maintenance",
    category: "Maintenance",
    location: "Delhi, India",
    date: "2026-09-10",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Interior Office Setup",
    category: "Interior Designing",
    location: "Greater Noida",
    date: "2026-10-01",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Equipment Installation",
    category: "Installation",
    location: "Ghaziabad, Uttar Pradesh",
    date: "2026-10-15",
    status: "Pending",
  },
];

const emptyForm = {
  name: "",
  category: "Electrical Work",
  location: "",
  date: "",
  status: "Pending",
};

function ManageProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.category} ${project.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      category: project.category,
      location: project.location,
      date: project.date,
      status: project.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...form }
            : project
        )
      );
    } else {
      setProjects((previous) => [
        ...previous,
        { id: Date.now(), ...form },
      ]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const deleteProject = (id) => {
    if (window.confirm("Kya aap is project ko delete karna chahte hain?")) {
      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "project-completed";
    if (status === "In Progress") return "project-progress";
    return "project-pending";
  };

  const updateStatus = (id, status) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === id ? { ...project, status } : project
      )
    );
  };

  return (
    <div className="manage-projects">
      {/* Page Header */}
      <div className="projects-page-header">
        <div>
          <span className="projects-eyebrow">ADMIN PANEL</span>
          <h2>Manage Projects</h2>
          <p>Manage, track and organize your company projects.</p>
        </div>

        <button
          type="button"
          className="btn project-add-btn"
          onClick={openAddForm}
        >
          <FaPlus className="me-2" />
          Add Project
        </button>
      </div>

      {/* Summary Cards */}
      <div className="project-summary-grid">
        <div className="project-summary-card">
          <div className="project-summary-icon">
            <FaProjectDiagram />
          </div>
          <div>
            <p>Total Projects</p>
            <h3>{projects.length}</h3>
          </div>
        </div>

        <div className="project-summary-card">
          <div className="project-summary-icon completed-icon">
            <FaBuilding />
          </div>
          <div>
            <p>Completed</p>
            <h3>
              {projects.filter((p) => p.status === "Completed").length}
            </h3>
          </div>
        </div>

        <div className="project-summary-card">
          <div className="project-summary-icon progress-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <p>In Progress</p>
            <h3>
              {projects.filter((p) => p.status === "In Progress").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="projects-search">
        <input
          type="search"
          className="form-control"
          placeholder="Search by project, category or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="project-form-card">
          <div className="project-form-header">
            <h4>{editingId !== null ? "Edit Project" : "Add New Project"}</h4>

            <button
              type="button"
              className="project-close-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter project name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>Electrical Work</option>
                  <option>Maintenance</option>
                  <option>Installation</option>
                  <option>Interior Designing</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Project Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Project Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Project Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button type="submit" className="btn project-save-btn">
                  {editingId !== null ? "Update Project" : "Save Project"}
                </button>

                <button
                  type="button"
                  className="btn project-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="projects-table-card">
        <div className="projects-table-header">
          <h4>All Projects</h4>
          <span>{filteredProjects.length} projects found</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong className="project-name">
                      {project.name}
                    </strong>
                  </td>
                  <td>{project.category}</td>
                  <td>{project.location}</td>
                  <td>{project.date || "—"}</td>
                  <td>
                    <select
                      className={`project-status-select ${getStatusClass(
                        project.status
                      )}`}
                      value={project.status}
                      onChange={(e) =>
                        updateStatus(project.id, e.target.value)
                      }
                      aria-label={`Status for ${project.name}`}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td>
                    <div className="project-action-buttons">
                      <button
                        type="button"
                        className="project-edit-btn"
                        onClick={() => openEditForm(project)}
                        title="Edit project"
                        aria-label={`Edit ${project.name}`}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="project-delete-btn"
                        onClick={() => deleteProject(project.id)}
                        title="Delete project"
                        aria-label={`Delete ${project.name}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageProjects;
