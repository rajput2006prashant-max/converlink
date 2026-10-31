
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const defaultServices = [
  {
    id: 1,
    title: "Electrical Work",
    category: "Electrical Solutions",
    description: "Professional electrical installation, wiring and repair services.",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    price: "Custom Quote",
  },
  {
    id: 2,
    title: "Maintenance",
    category: "Repair & Maintenance",
    description: "Reliable maintenance and inspection for your facilities.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    price: "Custom Quote",
  },
  {
    id: 3,
    title: "Installation",
    category: "Installation Services",
    description: "Professional equipment and electrical installation solutions.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    price: "Custom Quote",
  },
  {
    id: 4,
    title: "Interior Designing",
    category: "Interior Solutions",
    description: "Modern and functional interior design for your space.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    price: "Custom Quote",
  },
];

function Servicepage() {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("converlink_services");
      return saved ? JSON.parse(saved) : defaultServices;
    } catch {
      return defaultServices;
    }
  });

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    rating: "5",
    price: "Custom Quote",
  });

  useEffect(() => {
    localStorage.setItem("converlink_services", JSON.stringify(services));
  }, [services]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newService = {
      ...form,
      id: Date.now(),
      rating: Number(form.rating),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80",
    };

    setServices((previous) => [...previous, newService]);

    setForm({
      title: "",
      category: "",
      description: "",
      image: "",
      rating: "5",
      price: "Custom Quote",
    });
  };

  const deleteService = (id) => {
    const updated = services.filter((service) => service.id !== id);
    setServices(updated);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: "#102D4F" }}>
          Our Services
        </h2>
        <p className="text-secondary">
          Add a service and its details will be saved in your browser.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Add New Service</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Service Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter service description"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Image URL</label>
                <input
                  className="form-control"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Custom Quote"
                  required
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn text-white px-4"
                  style={{ backgroundColor: "#087FC4" }}
                >
                  + Save Service
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-6 col-xl-4" key={service.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img
                src={service.image}
                className="card-img-top"
                alt={service.title}
                style={{ height: "210px", objectFit: "cover" }}
              />

              <div className="card-body p-4">
                <small className="text-primary fw-semibold">
                  {service.category}
                </small>

                <h5 className="fw-bold mt-2">{service.title}</h5>

                <p className="text-secondary small">
                  {service.description}
                </p>

                <div className="mb-3">
                  <span style={{ color: "#f5a623" }}>
                    {"★".repeat(Number(service.rating) || 0)}
                  </span>
                  <span className="text-secondary small ms-2">
                    {service.rating}/5
                  </span>
                </div>

                <p className="fw-semibold">{service.price}</p>

                <div className="d-flex gap-2 flex-wrap">
                  <Link
                    to={`/landing/service/${service.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details →
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteService(service.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicepage;
