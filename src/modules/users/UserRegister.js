
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // Input values update karna
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Registration form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Password check
    if (formData.password !== formData.confirmPassword) {
      setError("Password aur Confirm Password match nahi karte!");

      toast.error("Passwords do not match!", {
        theme: "colored",
        autoClose: 2500,
        position: "top-right",
      });

      return;
    }

    // Registered users get karna
    let users = [];

    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");

      if (!Array.isArray(users)) {
        users = [];
      }
    } catch (error) {
      toast.error("Unable to read registered users!", {
        theme: "colored",
        autoClose: 2500,
      });
      return;
    }

    const email = formData.email.trim().toLowerCase();

    // Existing email check
    const alreadyRegistered = users.some(
      (user) => user.email?.toLowerCase() === email
    );

    if (alreadyRegistered) {
      setError("Ye email pehle se registered hai!");

      toast.warning("This email is already registered!", {
        theme: "colored",
        autoClose: 2500,
        position: "top-right",
      });

      return;
    }

    // New user create karna
    const newUser = {
      name: formData.name.trim(),
      email: email,
      password: formData.password,
    };

    users.push(newUser);

    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      toast.error("Registration failed. Please try again!", {
        theme: "colored",
        autoClose: 2500,
      });
      return;
    }

    // Form reset
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Success toast
    toast.success("Registration successful! Please login.", {
      theme: "colored",
      autoClose: 1800,
      position: "top-right",
      onClose: () => navigate("/user-login"),
    });
  };

  return (
    <Fragment>
      {/* Toast Container */}
      <ToastContainer />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "1000px" }}
        >
          <div className="row g-0">
            {/* Left Section */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <h1 className="fw-bold mb-3">User Registration</h1>

              <p className="fs-5">
                Welcome to Converlink Engineering.
              </p>

              <p className="text-white-50">
                Register your account to access company services
                and manage your enquiries.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-dark rounded-pill p-3">
                  Secure User Access
                </span>
              </div>

              <div className="mt-5">
                <p className="fw-semibold">User Benefits</p>
                <ul className="list-unstyled text-white-50">
                  <li className="mb-2">✓ Explore company services</li>
                  <li className="mb-2">✓ Submit enquiries</li>
                  <li>✓ Connect with our team</li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-7 p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-2">
                Create User Account
              </h2>

              <p className="text-secondary mb-4">
                Enter your details to register.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="userName"
                    name="name"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="userEmail"
                    name="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="userPassword" className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    id="userPassword"
                    name="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Create password (minimum 6 characters)"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Register User
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Already registered?{" "}
                <Link
                  to="/user-login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  User Login
                </Link>
              </p>

              <div className="text-center mt-3">
                <Link
                  to="/"
                  className="text-secondary text-decoration-none small"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default UserRegister;
