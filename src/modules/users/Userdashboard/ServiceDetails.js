
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8700/Services";
const ENQUIRY_API = "http://localhost:8700/NewEnuiry";

function ServiceDetails() {
  const { id } = useParams();

  const [serviceData, setServiceData] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH SERVICES
  const getServices = async () => {
    try {
      setServiceLoading(true);
      setServiceError("");

      const response = await axios.get(API);

      const activeServices = response.data.filter(
        (item) =>
          !item.status ||
          String(item.status).toLowerCase() === "active"
      );

      setServiceData(activeServices);
    } catch (error) {
      console.error("Services Fetch Error:", error);

      setServiceError(
        "Services load nahi ho pa rahi hain. JSON Server check karo."
      );
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  // FIND SERVICE
  const service = serviceData.find(
    (item) => String(item.id) === String(id)
  );

  // GALLERY IMAGES
  const galleryImages = {
    1: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    ],
    2: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    ],
    3: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
    ],
    4: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    ],
  };

  // FAQ
  const faqs = [
    {
      question: `What is included in ${service?.title}?`,
      answer: `Our ${service?.title} service includes the work listed above. Final requirements are discussed according to your project.`,
    },
    {
      question: "How can I request a quotation?",
      answer:
        "Fill out the enquiry form on this page. Our team can discuss your requirements and quotation.",
    },
    {
      question: "Do you provide customized solutions?",
      answer:
        "Yes, solutions can be planned according to your project requirements and available space.",
    },
    {
      question: "How can I get started?",
      answer:
        "Submit your details through the enquiry form and share your project requirements with us.",
    },
  ];

  // DEMO REVIEWS
  const reviews = [
    {
      name: "Amit Sharma",
      role: "Residential Customer",
      rating: 5,
      message:
        "Professional approach and good communication throughout the project.",
    },
    {
      name: "Rahul Verma",
      role: "Business Customer",
      rating: 5,
      message:
        "The team understood our requirements and provided a suitable solution.",
    },
    {
      name: "Neha Singh",
      role: "Residential Customer",
      rating: 4,
      message:
        "Good experience. The work was planned according to our requirements.",
    },
  ];

  // FORM INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT ENQUIRY
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setMessageType("");

    if (!service) {
      setMessageType("danger");
      setSuccess("Service details nahi mili.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      setMessageType("danger");
      setSuccess("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (
      !formData.amount ||
      !Number.isFinite(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      setMessageType("danger");
      setSuccess("Please enter a valid project amount.");
      return;
    }

    try {
      setLoading(true);

      const newEnquiry = {
        clientName: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),

        // CUSTOMER AMOUNT
        amount: Number(formData.amount),

        serviceId: service.id,
        service: service.title,
        message: formData.message.trim(),
        date: new Date().toLocaleDateString("en-IN"),
        enquiryDate: new Date().toISOString(),
        status: "New",
      };

      console.log("Enquiry Data Sending:", newEnquiry);

      const response = await axios.post(
        ENQUIRY_API,
        newEnquiry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Enquiry Saved:", response.data);

      setMessageType("success");
      setSuccess(
        "Your enquiry has been submitted successfully!"
      );

      // RESET FORM
      setFormData({
        name: "",
        email: "",
        mobile: "",
        amount: "",
        message: "",
      });

    } catch (error) {
      console.error("Enquiry Submit Error:", error);

      setMessageType("danger");

      if (error.response) {
        setSuccess(
          `Error ${error.response.status}: Enquiry save nahi hui.`
        );
      } else if (error.request) {
        setSuccess(
          "JSON Server connect nahi ho raha. Server start karo."
        );
      } else {
        setSuccess("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // SERVICE LOADING
  if (serviceLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">Loading Service Details...</h5>
      </div>
    );
  }

  // API ERROR
  if (serviceError) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{serviceError}</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={getServices}
        >
          Try Again
        </button>
      </div>
    );
  }

  // SERVICE NOT FOUND
  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold">Service Not Found</h2>
        <p className="text-secondary">
          The requested service is not available.
        </p>
        <Link to="/landing/services" className="btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const images = galleryImages[service.id] ||
    (service.image ? [service.image] : []);

  const relatedServices = serviceData.filter(
    (item) => String(item.id) !== String(service.id)
  );

  return (
    <div style={{ backgroundColor: "#f7f9fc" }}>

      {/* HERO SECTION */}
      <section
        className="position-relative text-white d-flex align-items-center"
        style={{
          minHeight: "430px",
          backgroundImage: `linear-gradient(90deg, rgba(8,30,55,0.95), rgba(8,30,55,0.55)), url(${service.image || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <Link
                to="/landing/services"
                className="text-white text-decoration-none"
              >
                ← Back to Services
              </Link>

              <p
                className="text-info fw-semibold mt-4 mb-2"
                style={{ letterSpacing: "3px" }}
              >
                CONVERLINK ENGINEERING PVT. LTD.
              </p>

              <span className="badge bg-info text-dark px-3 py-2 mb-3">
                {service.category}
              </span>

              <h1 className="display-3 fw-bold mb-3">
                {service.title}
              </h1>

              <p className="fs-5 text-light mb-4">
                {service.shortDescription}
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a
                  href="#enquiry"
                  className="btn btn-info btn-lg fw-semibold"
                >
                  Get a Free Quote →
                </a>

                <a
                  href="#about"
                  className="btn btn-outline-light btn-lg"
                >
                  Explore Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE HIGHLIGHTS */}
      <section className="container py-4">
        <div className="row g-3 text-center">
          {[
            { icon: "✓", title: "Quality Focused", text: "Attention to detail" },
            { icon: "⚙", title: "Professional Work", text: "Planned solutions" },
            { icon: "◆", title: "Custom Solutions", text: "Project-based approach" },
          ].map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <h2 className="text-info">{item.icon}</h2>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-secondary mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SERVICE */}
      <section id="about" className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <img
              src={service.image}
              alt={service.title}
              className="img-fluid rounded-4 shadow"
              style={{
                width: "100%",
                height: "380px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="col-lg-6">
            <p className="text-primary fw-bold text-uppercase">
              About Our Service
            </p>

            <h2 className="fw-bold mb-3">
              Professional {service.title} Solutions
            </h2>

            <p className="text-secondary lh-lg">
              {service.description}
            </p>

            <h5 className="fw-bold mt-4 mb-3">
              What Makes Our Service Special?
            </h5>

            {(Array.isArray(service.benefits) ? service.benefits : []).map(
              (benefit, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <span
                    className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: "28px", height: "28px", flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  <span className="text-secondary">{benefit}</span>
                </div>
              )
            )}

            <h5 className="fw-bold mt-4">
              Pricing:{" "}
              <span className="text-primary">
                {service.price || "Custom Quote"}
              </span>
            </h5>
          </div>
        </div>
      </section>

      {/* WORK INCLUDED */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-primary fw-bold">OUR EXPERTISE</p>
            <h2 className="fw-bold">What We Offer</h2>
            <p className="text-secondary">
              Explore the work included in this service.
            </p>
          </div>

          <div className="row g-3">
            {(Array.isArray(service.workIncludes) ? service.workIncludes : []).map(
              (work, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="border rounded-4 p-4 h-100 shadow-sm">
                    <div className="text-info fs-3 mb-2">✦</div>
                    <h5 className="fw-bold">{work}</h5>
                    <p className="text-secondary small mb-0">
                      Planned according to your project requirements.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="text-primary fw-bold">OUR PROJECT GALLERY</p>
          <h2 className="fw-bold">Work & Inspiration</h2>
          <p className="text-secondary">
            A visual look at {service.title.toLowerCase()}.
          </p>
        </div>

        <div className="row g-3">
          {images.map((image, index) => (
            <div className="col-6 col-lg-3" key={index}>
              <img
                src={image}
                alt={`${service.title} gallery ${index + 1}`}
                className="img-fluid rounded-4 shadow-sm w-100"
                style={{ height: "220px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* WORKING PROCESS */}
      <section className="py-5 text-white" style={{ background: "#102D4F" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-info fw-bold">HOW WE WORK</p>
            <h2 className="fw-bold">Our Working Process</h2>
            <p className="text-light">
              A simple and organized approach to every project.
            </p>
          </div>

          <div className="row g-4">
            {(Array.isArray(service.process) ? service.process : []).map(
              (step, index) => (
                <div className="col-md-6 col-lg-3" key={index}>
                  <div className="border border-secondary rounded-4 p-4 h-100">
                    <div
                      className="rounded-circle bg-info text-dark fw-bold d-flex align-items-center justify-content-center mb-4"
                      style={{ width: "55px", height: "55px", fontSize: "22px" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h5 className="fw-bold">Step {index + 1}</h5>
                    <p className="text-light mb-0">{step}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="text-primary fw-bold">CUSTOMER FEEDBACK</p>
          <h2 className="fw-bold">What People Say</h2>
          <p className="text-secondary">
            Sample reviews for design preview.
          </p>
        </div>

        <div className="row g-4">
          {reviews.map((review, index) => (
            <div className="col-md-4" key={index}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div className="text-warning fs-5 mb-3">
                  {"★".repeat(review.rating)}
                  <span className="text-secondary">
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="text-secondary lh-lg">
                  "{review.message}"
                </p>

                <hr />

                <h6 className="fw-bold mb-1">{review.name}</h6>
                <small className="text-secondary">{review.role}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-primary fw-bold">HAVE QUESTIONS?</p>
            <h2 className="fw-bold">Frequently Asked Questions</h2>
          </div>

          <div className="accordion" id="serviceFAQ">
            {faqs.map((faq, index) => (
              <div className="accordion-item mb-3 border rounded-3" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    } fw-semibold`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${index}`}
                    aria-expanded={index === 0}
                    aria-controls={`faq${index}`}
                  >
                    {faq.question}
                  </button>
                </h2>

                <div
                  id={`faq${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#serviceFAQ"
                >
                  <div className="accordion-body text-secondary">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <p className="text-primary fw-bold">EXPLORE MORE</p>
          <h2 className="fw-bold">Related Services</h2>
        </div>

        <div className="row g-4">
          {relatedServices.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <img
                  src={item.image || "https://placehold.co/600x400?text=Service"}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: "210px", objectFit: "cover" }}
                />

                <div className="card-body p-4">
                  <small className="text-primary fw-semibold">
                    {item.category}
                  </small>

                  <h5 className="fw-bold mt-2">{item.title}</h5>

                  <p className="text-secondary">
                    {item.shortDescription}
                  </p>

                  <Link
                    to={`/landing/service/${item.id}`}
                    className="btn btn-outline-primary"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section
        id="enquiry"
        className="py-5"
        style={{ backgroundColor: "#eaf3fa" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="bg-white shadow-lg rounded-4 overflow-hidden">
                <div className="row g-0">

                  <div
                    className="col-lg-5 text-white p-4 p-md-5 d-flex flex-column justify-content-center"
                    style={{ backgroundColor: "#102D4F" }}
                  >
                    <p className="text-info fw-bold">LET'S CONNECT</p>

                    <h2 className="fw-bold">
                      Start Your Project With Us
                    </h2>

                    <p className="text-light mt-3">
                      Interested in {service.title}? Share your requirements
                      and send us an enquiry.
                    </p>

                    <h5 className="mt-3">Selected Service</h5>

                    <p className="text-info fw-semibold mb-0">
                      {service.title}
                    </p>
                  </div>

                  <div className="col-lg-7 p-4 p-md-5">
                    <h3 className="fw-bold mb-2">Send an Enquiry</h3>

                    <p className="text-secondary">
                      Fill in your details below.
                    </p>

                    {success && (
                      <div className={`alert alert-${messageType}`} role="alert">
                        {success}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>

                      {/* NAME */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-lg"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* EMAIL */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* MOBILE */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Mobile Number
                        </label>

                        <input
                          type="tel"
                          name="mobile"
                          className="form-control form-control-lg"
                          placeholder="Enter 10 digit mobile number"
                          pattern="[0-9]{10}"
                          maxLength="10"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* AMOUNT */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Project Amount (₹)
                        </label>

                        <div className="input-group input-group-lg">
                          <span className="input-group-text">₹</span>

                          <input
                            type="number"
                            name="amount"
                            className="form-control"
                            placeholder="Enter your project amount"
                            min="1"
                            step="1"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <small className="text-muted">
                          Enter your estimated project budget.
                        </small>
                      </div>

                      {/* MESSAGE */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Project Requirements
                        </label>

                        <textarea
                          name="message"
                          className="form-control"
                          rows="4"
                          placeholder="Tell us about your project..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Enquiry →"
                        )}
                      </button>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        className="py-5 text-center text-white"
        style={{ background: "#102D4F" }}
      >
        <div className="container">
          <h2 className="fw-bold">
            Let's Build Something Great Together
          </h2>

          <p className="text-light mt-3">
            Connect with Converlink Engineering for your next project.
          </p>

          <a
            href="#enquiry"
            className="btn btn-info btn-lg fw-semibold mt-2"
          >
            Contact Our Team
          </a>
        </div>
      </section>

    </div>
  );
}

export default ServiceDetails;
