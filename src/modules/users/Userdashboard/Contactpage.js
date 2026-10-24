
import React from "react";
import { useForm } from "react-hook-form";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaCommentDots,
  FaPaperPlane,
  FaBuilding
} from "react-icons/fa";

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact Details:", data);
    alert("Your message has been submitted successfully!");
    reset();
  };

  return (
    <div
      className="container-fluid py-4 px-3 px-md-4"
      style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}
    >
      {/* Heading */}
      <div className="mb-4">
        <span className="badge rounded-pill px-3 py-2 mb-2"
          style={{ backgroundColor: "#DDF4FF", color: "#087FC4" }}>
          GET IN TOUCH
        </span>

        <h2 className="fw-bold" style={{ color: "#102D4F" }}>
          Contact Us
        </h2>

        <p className="text-secondary">
          Have a question? Contact the Converlink Engineering team.
        </p>
      </div>

      <div className="row g-4">

        {/* Contact Information */}
        <div className="col-lg-4">
          <div
            className="text-white rounded-4 p-4 p-md-5 h-100"
            style={{ backgroundColor: "#102D4F" }}
          >
            <FaBuilding size={42} style={{ color: "#38C8F5" }} />

            <h3 className="fw-bold mt-4 mb-3">
              Let's Talk
            </h3>

            <p className="text-white-50 mb-5">
              We are here to help with your electrical, maintenance,
              installation and interior designing requirements.
            </p>

            <div className="d-flex gap-3 mb-4">
              <FaPhoneAlt size={21} style={{ color: "#38C8F5" }} />
              <div>
                <h6 className="fw-bold">Phone</h6>
                <p className="text-white-50 small mb-0">
                  9015189096
                </p>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <FaEnvelope size={21} style={{ color: "#38C8F5" }} />
              <div>
                <h6 className="fw-bold">Email</h6>
                <p className="text-white-50 small mb-0">
                  Converlink@gmail.com
                </p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <FaMapMarkerAlt size={21} style={{ color: "#38C8F5" }} />
              <div>
                <h6 className="fw-bold">Address</h6>
                <p className="text-white-50 small mb-0">
                 Aakash Nagar Ghaziabad 201013.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-bold mb-2" style={{ color: "#102D4F" }}>
                Send Us a Message
              </h4>

              <p className="text-secondary mb-4">
                Fill out the form below and tell us how we can help.
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
                        placeholder="Enter your name"
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
                      Phone Number
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaPhoneAlt />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter phone number"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Subject *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subject"
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
                      Your Message *
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light align-items-start pt-3">
                        <FaCommentDots />
                      </span>
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Write your message here..."
                        {...register("message", {
                          required: "Please enter your message",
                          minLength: {
                            value: 10,
                            message: "Message must be at least 10 characters"
                          }
                        })}
                      />
                    </div>

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
                      className="btn btn-lg w-100 text-white fw-semibold"
                      style={{ backgroundColor: "#087FC4" }}
                    >
                      Send Message <FaPaperPlane className="ms-2" />
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

export default Contact;
