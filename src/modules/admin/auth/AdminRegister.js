
import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminRegister() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("adminPassword");

  const myform = (data) => {
    const admins = JSON.parse(
      localStorage.getItem("admins") || "[]"
    );

    const email = data.adminEmail.trim().toLowerCase();
    const adminId = data.adminId.trim();

    const alreadyExists = admins.some(
      (admin) =>
        admin.adminEmail === email ||
        admin.adminId === adminId
    );

    if (alreadyExists) {
      toast.error("Email or Admin ID already registered!");
      return;
    }

    const newAdmin = {
      adminName: data.adminName.trim(),
      adminEmail: email,
      adminId,
      adminPassword: data.adminPassword,
    };

    admins.push(newAdmin);

    localStorage.setItem("admins", JSON.stringify(admins));

    toast.success("Admin registration successful!", {
      autoClose: 1500,
      onClose: () => navigate("/admin-login"),
    });
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
                Admin Registration
              </h1>

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
              <h2 className="fw-bold text-dark mb-2">
                Create Admin Account
              </h2>

              <p className="text-secondary mb-4">
                Enter your details to register.
              </p>

              <form onSubmit={handleSubmit(myform)}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="adminName" className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    id="adminName"
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter admin name"
                    autoComplete="name"
                    {...register("adminName", {
                      required: "Full name is required",
                    })}
                  />

                  {errors.adminName && (
                    <p className="text-danger small mt-1">
                      {errors.adminName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label fw-semibold">
                    Official Email
                  </label>

                  <input
                    id="adminEmail"
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter official email"
                    autoComplete="email"
                    {...register("adminEmail", {
                      required: "Email is required",
                    })}
                  />

                  {errors.adminEmail && (
                    <p className="text-danger small mt-1">
                      {errors.adminEmail.message}
                    </p>
                  )}
                </div>

                {/* Admin ID */}
                <div className="mb-3">
                  <label htmlFor="adminId" className="form-label fw-semibold">
                    Admin ID
                  </label>

                  <input
                    id="adminId"
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter admin ID"
                    {...register("adminId", {
                      required: "Admin ID is required",
                    })}
                  />

                  {errors.adminId && (
                    <p className="text-danger small mt-1">
                      {errors.adminId.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="adminPassword"
                    className="form-label fw-semibold"
                  >
                    Password
                  </label>

                  <input
                    id="adminPassword"
                    type="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Create password"
                    autoComplete="new-password"
                    {...register("adminPassword", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />

                  {errors.adminPassword && (
                    <p className="text-danger small mt-1">
                      {errors.adminPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />

                  {errors.confirmPassword && (
                    <p className="text-danger small mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
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

export default AdminRegister;
