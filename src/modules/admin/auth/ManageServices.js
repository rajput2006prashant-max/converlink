import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const API = "http://localhost:8700/Services";

const emptyForm = {
  title: "",
  category: "",
  image: "",
  shortDescription: "",
  description: "",
  price: "Custom Quote",
  status: "Active",
  benefits: "",
  workIncludes: "",
  process: "",
};

function ManageServices() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch services
  const getServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);
      setServices(response.data);
    } catch (error) {
      setError("Services load nahi ho paayi. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  // Input handle
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add modal
  const handleAdd = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Edit modal
  const handleEdit = (service) => {
    setEditId(service.id);

    setFormData({
      title: service.title || "",
      category: service.category || "",
      image: service.image || "",
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      price: service.price || "Custom Quote",
      status: service.status || "Active",
      benefits: (service.benefits || []).join("\n"),
      workIncludes: (service.workIncludes || []).join("\n"),
      process: (service.process || []).join("\n"),
    });

    setShowModal(true);
  };

  // Convert textarea lines into arrays
  const convertToArray = (value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const serviceData = {
        title: formData.title,
        category: formData.category,
        image: formData.image,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: formData.price,
        status: formData.status,
        benefits: convertToArray(formData.benefits),
        workIncludes: convertToArray(formData.workIncludes),
        process: convertToArray(formData.process),
        rating: 5,
      };

      if (editId !== null) {
        await axios.patch(`${API}/${editId}`, serviceData);
        alert("Service successfully updated!");
      } else {
        await axios.post(API, serviceData);
        alert("New service successfully added!");
      }

      setShowModal(false);
      setEditId(null);
      setFormData(emptyForm);

      await getServices();
    } catch (error) {
      console.error("Save service error:", error);
      alert("Service save nahi ho paayi. JSON Server check karo.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap is service ko delete karna chahte hain?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      alert("Service deleted successfully!");
      await getServices();
    } catch (error) {
      alert("Service delete nahi ho paayi.");
    }
  };

  // Search
  const filteredServices = services.filter((service) =>
    `${service.title} ${service.category} ${service.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const activeServices = services.filter(
    (service) => service.status === "Active",
  ).length;

  const inactiveServices = services.filter(
    (service) => service.status === "Inactive",
  ).length;

  return (
    <div className="container-fluid py-3">
      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold">Manage Services</h3>

          <p
            className="text-muted mb-0"
            style={{ color: "white", backgroundColor: "#087FC4", width:"310px", borderRadius: "5px", padding:"10px" }}
          >
            Add, edit and manage company services.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>
          Add New Service
        </button>
      </div>

      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" >
            <div className="card-body">
              <p className="text-muted" style={{ color: "white", backgroundColor: "#087FC4", width:"120px", borderRadius: "5px", padding:"10px" }}>Total Services</p>
              <h3 className="fw-bold">{services.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted"  style={{ color: "white", backgroundColor: "#087FC4", width:"130px", borderRadius: "5px", padding:"10px" }}>Active Services</p>
              <h3 className="fw-bold text-success">{activeServices}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted" style={{ color: "white", backgroundColor: "#087FC4", width:"140px", borderRadius: "5px", padding:"10px" }}>Inactive Services</p>
              <h3 className="fw-bold text-danger">{inactiveServices}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h5 className="fw-bold mb-0" style={{
              background:"#087FC4",
              width:"150px",
              borderRadius:"10px",
              padding:"10px",
            }}>Services List</h5>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "300px" }}
              placeholder="Search service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Image</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading services...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <tr key={service.id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={service.image}
                        alt={service.title}
                        width="65"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                      />
                    </td>

                    <td className="fw-semibold">{service.title}</td>
                    <td>{service.category}</td>
                    <td>{service.price}</td>

                    <td>
                      <span
                        className={`badge ${
                          service.status === "Active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(service)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(service.id)}
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflowY: "auto",
          }}
        >
          <div
            className="bg-white rounded-4 shadow p-4 my-auto"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                {editId !== null ? "Edit Service" : "Add New Service"}
              </h5>

              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">Service Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Electrical Work"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Electrical Solutions"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">Image URL</label>
                <input
                  type="url"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  className="form-control"
                  rows="2"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">Price</label>
                <input
                  type="text"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Custom Quote"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Benefits (one per line)
                </label>
                <textarea
                  name="benefits"
                  className="form-control"
                  rows="3"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder={"Quality work\nProfessional team"}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Work Includes (one per line)
                </label>
                <textarea
                  name="workIncludes"
                  className="form-control"
                  rows="3"
                  value={formData.workIncludes}
                  onChange={handleChange}
                  placeholder={"Electrical Wiring\nLighting Installation"}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Process (one per line)
                </label>
                <textarea
                  name="process"
                  className="form-control"
                  rows="3"
                  value={formData.process}
                  onChange={handleChange}
                  placeholder={"Understand requirements\nPrepare plan"}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-primary">Status</label>
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
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editId !== null
                      ? "Update Service"
                      : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageServices;
