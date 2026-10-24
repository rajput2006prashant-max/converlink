
import React from "react";
import { useForm } from "react-hook-form";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTools,
  FaCommentDots,
  FaPaperPlane
} from "react-icons/fa";

function Enquiry() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Enquiry Details:", data);
    alert("Your enquiry has been submitted successfully!");
    reset();
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4"
      style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}>

      {/* Page Heading */}
      <div className="mb-4">
        <span className="badge rounded-pill px-3 py-2 mb-2"
          style={{ backgroundColor: "#DDF4FF", color: "#087FC4" }}>
          CUSTOMER SUPPORT
        </span>

        <h2 className="fw-bold" style={{ color: "#102D4F" }}>
          Enquiry Management
        </h2>

        <p className="text-secondary">
          Submit your enquiry for our engineering services.
        </p>
      </div>

      <div className="row g-4">

        {/* Left Information Panel */}
        <div className="col-lg-4">
          <div className="h-100 rounded-4 p-4 p-md-5 text-white"
            style={{ backgroundColor: "#102D4F" }}>

            <FaBuilding size={42} style={{ color: "#38C8F5" }} />

            <h3 className="fw-bold mt-4 mb-3">
              Let's Discuss Your Project
            </h3>

            <p className="text-white-50">
              Tell us what you need. Our team can review your requirements
              and get back to you.
            </p>

            <hr className="border-light opacity-25 my-4" />

            <div className="d-flex gap-3 mb-4">
              <FaTools size={22} style={{ color: "#38C8F5" }} />
              <div>
                <h6 className="fw-bold">Our Services</h6>
                <p className="small text-white-50 mb-0">
                  Electrical Work, Maintenance, Installation and Interior Designing
                </p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <FaCommentDots size={22} style={{ color: "#38C8F5" }} />
              <div>
                <h6 className="fw-bold">Your Requirements Matter</h6>
                <p className="small text-white-50 mb-0">
                  Share your project details using the form.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Enquiry Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">

              <h4 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
                Send an Enquiry
              </h4>

              <p className="text-secondary mb-4">
                Please fill in all required details.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="row g-3">

                  {/* Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Full Name *
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your full name"
                        {...register("name", {
                          required: "Name is required"
                        })}
                      />
                    </div>

                    {errors.name && (
                      <small className="text-danger">
                        {errors.name.message}
                      </small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Email Address *
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "Email is required"
                        })}
                      />
                    </div>

                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Mobile Number *
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter 10-digit mobile number"
                        {...register("phone", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Enter a valid 10-digit mobile number"
                          }
                        })}
                      />
                    </div>

                    {errors.phone && (
                      <small className="text-danger">
                        {errors.phone.message}
                      </small>
                    )}
                  </div>

                  {/* Service */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Select Service *
                    </label>

                    <select
                      className="form-select"
                      defaultValue=""
                      {...register("service", {
                        required: "Please select a service"
                      })}
                    >
                      <option value="" disabled>
                        Choose a service
                      </option>
                      <option value="Electrical Work">Electrical Work</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Installation">Installation</option>
                      <option value="Interior Designing">
                        Interior Designing
                      </option>
                      <option value="Other">Other</option>
                    </select>

                    {errors.service && (
                      <small className="text-danger">
                        {errors.service.message}
                      </small>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Enquiry Subject *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter enquiry subject"
                      {...register("subject", {
                        required: "Subject is required"
                      })}
                    />

                    {errors.subject && (
                      <small className="text-danger">
                        {errors.subject.message}
                      </small>
                    )}
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Project Details *
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Describe your project or requirements..."
                      {...register("message", {
                        required: "Project details are required",
                        minLength: {
                          value: 10,
                          message: "Please enter at least 10 characters"
                        }
                      })}
                    />

                    {errors.message && (
                      <small className="text-danger">
                        {errors.message.message}
                      </small>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg text-white fw-semibold w-100"
                      style={{ backgroundColor: "#087FC4" }}
                    >
                      <FaPaperPlane className="me-2" />
                      Submit Enquiry
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Enquiry;
