
import React, { Fragment } from "react";
import axios from "axios";
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

  // Admin Login Function
  const myform = async (data) => {

    try {

      // Get Admin Data From JSON Server
      const response = await axios.get(
        "http://localhost:8700/admin"
      );

      const admins = response.data;

      // Get Input Values
      const email = data.email.trim().toLowerCase();
      const password = data.pass;

      // Find Admin
      const admin = admins.find((item) => {

        return (
          item.email.trim().toLowerCase() === email &&
          item.pass === password
        );

      });

      // Check Login
      if (admin) {

        // Save Login Status
        localStorage.setItem("adminLoggedIn", "true");

        // Save Admin Details
        localStorage.setItem(
          "adminLoginData",
          JSON.stringify({
            username: admin.username,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            id: admin.id,
          })
        );

        toast.success("Admin Login Successful!", {
          autoClose: 1200,
          onClose: () => {
            navigate("/adminlandingpage");
          },
        });

      } else {

        toast.error("Invalid Email or Password!");

      }

    } catch (error) {

      console.log(error);

      toast.error("JSON Server is not running!");

    }

  };

  return (

    <Fragment>

      <ToastContainer position="top-right" />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "1000px" }}
        >

          <div className="row g-0">

            {/* Left Section */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">

              <h1 className="fw-bold mb-3">
                Welcome Back!
              </h1>

              <p className="fs-5">
                Admin Portal
              </p>

              <p className="text-white-50">
                Welcome to Converlink Engineering Pvt. Ltd.
                Login to manage your company website,
                services, projects and enquiries.
              </p>

              <div className="mt-4">

                <span className="badge bg-white text-primary rounded-pill p-3">
                  Secure Admin Access
                </span>

              </div>

              <div className="mt-5">

                <h5 className="fw-semibold">
                  Admin Responsibilities
                </h5>

                <ul className="list-unstyled text-white-50 mt-3">

                  <li className="mb-2">
                    ✓ Manage Enquiries
                  </li>

                  <li className="mb-2">
                    ✓ Manage Services
                  </li>

                  <li className="mb-2">
                    ✓ Manage Projects
                  </li>

                  <li>
                    ✓ Manage Website Information
                  </li>

                </ul>

              </div>

            </div>

            {/* Right Section */}
            <div className="col-md-7 p-4 p-lg-5">

              <h2 className="fw-bold text-dark mb-2">
                Admin Login
              </h2>

              <p className="text-secondary mb-4">
                Enter your registered account details.
              </p>

              <form onSubmit={handleSubmit(myform)}>

                {/* Email */}
                <div className="mb-4">

                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your registered email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                  {errors.email && (
                    <p className="text-danger small mt-1">
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
                    })}
                  />

                  {errors.pass && (
                    <p className="text-danger small mt-1">
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

              {/* Register Link */}
              <p className="text-center text-secondary mt-4 mb-0">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Sign Up
                </Link>

              </p>

              {/* Back Home */}
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

export default AdminLogin;
