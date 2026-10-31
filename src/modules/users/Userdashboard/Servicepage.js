
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

const serviceNames = [
  "Electrical Work",
  "Maintenance",
  "Installation",
  "Interior Designing",
];

const serviceImages = [
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=4")
      .then((response) => {
        const data = response.data.map((item, index) => ({
          id: index + 1,
          title: serviceNames[index],
          description: item.body,
          image: serviceImages[index],
        }));

        setServices(data);
      })
      .catch(() => {
        setError("Services load nahi ho paayi. Internet connection check karo.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold mb-2" style={{ color: "#102D4F" }}>
        Our Services
      </h2>

      <p className="text-secondary mb-4">
        Explore our engineering solutions and service details.
      </p>

      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-6 col-xl-3" key={service.id}>
            <div className="card h-100 border-0 shadow-sm overflow-hidden">
              <Link to={`/landing/service/${service.id}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Link>

              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{service.title}</h5>

                <p className="text-secondary">
                  {service.description.slice(0, 90)}...
                </p>

                <Link
                  to={`/landing/service/${service.id}`}
                  className="btn text-white mt-auto"
                  style={{ backgroundColor: "#102D4F" }}
                >
                  View Details <FaArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
