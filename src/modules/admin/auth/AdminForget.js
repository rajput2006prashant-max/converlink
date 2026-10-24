import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function AdminForgotPassword() {
  return (
    <Fragment>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "900px" }}
        >
          <div className="row g-0">
            {/* Left Section */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <h1 className="fw-bold mb-3">Forgot Password?</h1>

              <p className="fs-5">
                Admin account recovery
              </p>

              <p className="text-white-50">
                Don't worry! Enter your registered official email address
                to begin recovering your admin account.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-dark rounded-pill p-3">
                  Secure Admin Access
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-7 p-4 p-lg-5">
              <div className="text-center mb-4">
                <div
                  className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "75px", height: "75px" }}
                >
                  <span style={{ fontSize: "35px" }}>🔐</span>
                </div>

                <h2 className="fw-bold text-dark">Reset Admin Password</h2>

                <p className="text-secondary">
                  Enter your registered official email.
                </p>
              </div>

              <form>
                <div className="mb-4">
                  <label
                    htmlFor="adminEmail"
                    className="form-label fw-semibold"
                  >
                    Official Email Address
                  </label>

                  <input
                    type="email"
                    id="adminEmail"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your official email"
                    autoComplete="email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center mt-4">
                <Link
                  to="/admin-login"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  ← Back to Admin Login
                </Link>
              </div>

              <div className="text-center mt-3">
                <Link
                  to="/"
                  className="text-secondary text-decoration-none small"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminForgotPassword;