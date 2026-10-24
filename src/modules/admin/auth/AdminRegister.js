import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function AdminRegister() {
  return (
    <Fragment>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "1000px" }}
        >
          <div className="row g-0">
            {/* Left Section */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <h1 className="fw-bold mb-3">Admin Registration</h1>

              <p className="fs-5">
                Welcome to Converlink Engineering.
              </p>

              <p className="text-white-50">
                Register your administrator account to manage company
                services, enquiries, and website information.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-dark rounded-pill p-3">
                  Secure Admin Access
                </span>
              </div>

              <div className="mt-5">
                <p className="fw-semibold">Admin Responsibilities</p>
                <ul className="list-unstyled text-white-50">
                  <li className="mb-2">✓ Manage enquiries</li>
                  <li className="mb-2">✓ Manage company services</li>
                  <li>✓ Update website information</li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-7 p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-2">Create Admin Account</h2>

              <p className="text-secondary mb-4">
                Enter your details to register.
              </p>

              <form>
                <div className="mb-3">
                  <label htmlFor="adminName" className="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="adminName"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter admin name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label fw-semibold">
                    Official Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter official email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="adminId" className="form-label fw-semibold">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    id="adminId"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter admin ID"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="adminPassword" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Create password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Register Admin
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Already registered?{" "}
                <Link
                  to="/admin-login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Admin Login
                </Link>
              </p>

              <div className="text-center mt-3">
                <Link to="/" className="text-secondary text-decoration-none small">
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

export default AdminRegister;
