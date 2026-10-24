import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function UserForgot() {
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
              <FaLock size={60} />
              <h1 className="fw-bold mb-3">Forgot Password?</h1>

              <p className="fs-5">
                Don't worry! It happens to everyone.
              </p>

              <p className="text-white-50">
                Enter your registered email address to start the password
                recovery process.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-primary rounded-pill p-3">
                  Simple. Secure. Smart.
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

                <h2 className="fw-bold text-dark">Reset Your Password</h2>

                <p className="text-secondary">
                  Enter your email address to continue.
                </p>
              </div>

              <form>
                    <div className="input-group mb-3">
                             <span className="input-group-text bg-light">
                               <FaEnvelope />
                             </span>
                             <input
                               type="email"
                               className="form-control form-control-lg"
                               placeholder="Enter your email"
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
                  to="/user-login"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  ← Back to User Login
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

export default UserForgot;