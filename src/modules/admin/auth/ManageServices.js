
import React, { useState } from "react";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";


const initialServices = [
  {
    id: 1,
    name: "Electrical Work",
    description: "Professional electrical installation and repair services.",
    icon: "electrical",
    status: "Active",
  },
  {
    id: 2,
    name: "Maintenance",
    description: "Reliable maintenance for buildings and equipment.",
    icon: "maintenance",
    status: "Active",
  },
  {
    id: 3,
    name: "Installation",
    description: "Safe and efficient installation solutions.",
    icon: "installation",
    status: "Active",
  },
  {
    id: 4,
    name: "Interior Designing",
    description: "Modern and functional interior design solutions.",
    icon: "interior",
    status: "Active",
  },
];

const serviceIcons = {
  electrical: <FaBolt />,
  maintenance: <FaTools />,
  installation: <FaPlug />,
  interior: <FaPaintRoller />,
};

const emptyForm = {
  name: "",
  description: "",
  icon: "electrical",
  status: "Active",
};

function ManageServices() {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      icon: service.icon,
      status: service.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    if (editingId !== null) {
      setServices((previous) =>
        previous.map((service) =>
          service.id === editingId
            ? { ...service, ...form }
            : service
        )
      );
    } else {
      setServices((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const deleteService = (id) => {
    const confirmed = window.confirm(
      "Kya aap is service ko delete karna chahte hain?"
    );

    if (confirmed) {
      setServices((previous) =>
        previous.filter((service) => service.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? {
              ...service,
              status:
                service.status === "Active" ? "Inactive" : "Active",
            }
          : service
      )
    );
  };

  return (
    <div className="manage-services">
      <div className="manage-services-header">
        <div>
          <span className="services-eyebrow">ADMIN PANEL</span>
          <h2>Manage Services</h2>
          <p>Add, update and manage your company services.</p>
        </div>

        <button
          type="button"
          className="btn add-service-btn"
          onClick={openAddForm}
        >
          <FaPlus className="me-2" />
          Add Service
        </button>
      </div>

      <div className="services-summary">
        <div className="summary-card">
          <span>Total Services</span>
          <h3>{services.length}</h3>
        </div>

        <div className="summary-card">
          <span>Active Services</span>
          <h3>
            {services.filter((s) => s.status === "Active").length}
          </h3>
        </div>

        <div className="summary-card">
          <span>Inactive Services</span>
          <h3>
            {services.filter((s) => s.status === "Inactive").length}
          </h3>
        </div>
      </div>

      <div className="services-toolbar">
        <input
          type="search"
          className="form-control"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="service-form-card">
          <div className="service-form-heading">
            <h4>{editingId !== null ? "Edit Service" : "Add New Service"}</h4>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter service name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Icon</label>
                <select
                  className="form-select"
                  value={form.icon}
                  onChange={(e) =>
                    setForm({ ...form, icon: e.target.value })
                  }
                >
                  <option value="electrical">Electrical Work</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="installation">Installation</option>
                  <option value="interior">Interior Designing</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter service description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn save-service-btn">
                  {editingId !== null ? "Update Service" : "Save Service"}
                </button>

                <button
                  type="button"
                  className="btn cancel-service-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="services-table-card">
        <div className="services-table-heading">
          <h4>All Services</h4>
          <span>{filteredServices.length} services found</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className="service-name-cell">
                      <div className="service-icon">
                        {serviceIcons[service.icon]}
                      </div>
                      <strong>{service.name}</strong>
                    </div>
                  </td>

                  <td className="service-description">
                    {service.description}
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`status-badge ${
                        service.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                      onClick={() => toggleStatus(service.id)}
                      title="Click to change status"
                    >
                      {service.status}
                    </button>
                  </td>

                  <td>
                    <div className="service-actions">
                      <button
                        type="button"
                        className="edit-service-btn"
                        onClick={() => openEditForm(service)}
                        aria-label={`Edit ${service.name}`}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-service-btn"
                        onClick={() => deleteService(service.id)}
                        aria-label={`Delete ${service.name}`}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    No services found.
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

export default ManageServices;
