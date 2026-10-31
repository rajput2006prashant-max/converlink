
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const myform = (data) => {
    // Demo admin credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    if (
      data.email === adminEmail &&
      data.pass === adminPassword
    ) {
      localStorage.setItem("adminLoggedIn", "true");

      toast.success("Admin login successful!", {
        onClose: () => navigate("/adminlandingpage"),
        autoClose: 1200,
      });
    } else {
      toast.error("Invalid admin email or password!");
    }
  };

  return (
    <Fragment>
      <ToastContainer position="top-right" />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "900px" }}
        >
          <div className="row g-0">
            {/* Left Section */}
            <div className="col-md-6 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <h1 className="fw-bold mb-3">Welcome Back!</h1>

              <p className="fs-5">
                Sign in to manage your website.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-primary rounded-pill p-3">
                  Simple. Secure. Smart.
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-6 p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-2">
                Admin Login
              </h2>

              <p className="text-secondary mb-4">
                Please enter your account details.
              </p>

              <form onSubmit={handleSubmit(myform)}>
                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                  {errors.email && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your password"
                    {...register("pass", {
                      required: "Password is required",
                      minLength: {
                        value: 5,
                        message: "Minimum 5 characters required",
                      },
                      maxLength: {
                        value: 10,
                        message: "Maximum 10 characters allowed",
                      },
                    })}
                  />

                  {errors.pass && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.pass.message}
                    </p>
                  )}
                </div>

                {/* Remember and Forgot */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />

                    <label
                      className="form-check-label"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forget-password"
                    className="text-primary text-decoration-none small"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminLogin;
