import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FaUser,FaEnvelope,FaPhone ,FaLock  } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";

function UserRegister() {
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
              <IoIosLogIn  size={50}/>
              <h1 className="fw-bold mb-3">Join Converlink!</h1>

              <p className="fs-5">
                Create your account and connect with us.
              </p>

              <p className="text-white-50">
                Explore our services and get in touch with our team for your
                electrical, maintenance, installation, and interior design needs.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-primary rounded-pill p-3">
                  Simple. Secure. Smart.
                </span>
              </div>

              <div className="mt-5">
                <h5 className="fw-bold">Our Services</h5>
                <p className="mb-2">Electrical Work</p>
                <p className="mb-2">Maintenance & Installation</p>
                <p className="mb-0">Interior Designing</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-7 p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-2">Create Account</h2>

              <p className="text-secondary mb-4">
                Please fill in your details to register.
              </p>

              <form>
                <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

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

                <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <FaPhone />
              </span>
              <input
                type="tel"
                className="form-control form-control-lg"
                placeholder="Enter your mobile number"
                autoComplete="tel"
                required
              />
            </div>

                 <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

                 <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
            </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    className="form-check-input"
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree to the Terms and Conditions.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Create Account
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Already have an account?{" "}
                <Link
                  to="/user-login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Login
                </Link>
              </p>

              <div className="text-center mt-3">
                <Link to="/" className="text-secondary text-decoration-none">
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

export default UserRegister;