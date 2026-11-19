
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminForgotPassword() {
  const navigate = useNavigate();

  const [emailVerified, setEmailVerified] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [verifiedAdmin, setVerifiedAdmin] = useState(null);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  // STEP 1: Verify Admin Email
  const verifyEmail = async (data) => {
    try {
      const email = data.adminEmail.trim().toLowerCase();

      const response = await axios.get(
        "http://localhost:8700/admin"
      );

      const adminExists = response.data.find(
        (admin) =>
          admin.email?.trim().toLowerCase() === email
      );

      if (!adminExists) {
        toast.error("Admin account not found!");
        return;
      }

      setAdminEmail(adminExists.email);
      setVerifiedAdmin(adminExists);
      setEmailVerified(true);

      toast.success("Admin email verified successfully!");

    } catch (error) {
      console.error("Email verification error:", error);
      toast.error("Server error! Please start JSON Server.");
    }
  };

  // STEP 2: Reset Admin Password
  const resetPassword = async (data) => {
    try {
      if (!verifiedAdmin || !verifiedAdmin.id) {
        toast.error("Please verify your admin email first!");
        return;
      }

      await axios.patch(
        `http://localhost:8700/admin/${verifiedAdmin.id}`,
        {
          pass: data.newPassword,
        }
      );

      toast.success("Admin password reset successful!", {
        autoClose: 1500,
        onClose: () => {
          navigate("/admin-login", { replace: true });
        },
      });

    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Password update failed!");
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

            {/* LEFT SECTION */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">

              <h1 className="fw-bold mb-3">
                Forgot Password?
              </h1>

              <p className="fs-5">
                Admin account recovery
              </p>

              <p className="text-white-50">
                Verify your registered official email to reset
                your admin account password.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-dark rounded-pill p-3">
                  Secure Admin Access
                </span>
              </div>

            </div>

            {/* RIGHT SECTION */}
            <div className="col-md-7 p-4 p-lg-5">

              <div className="text-center mb-4">

                <div
                  className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "75px", height: "75px" }}
                >
                  <span style={{ fontSize: "35px" }}>
                    🔐
                  </span>
                </div>

                <h2 className="fw-bold text-dark">
                  Reset Admin Password
                </h2>

                <p className="text-secondary">
                  {!emailVerified
                    ? "Enter your registered official email."
                    : "Create your new password."}
                </p>

              </div>

              {/* EMAIL VERIFICATION FORM */}
              {!emailVerified ? (

                <form onSubmit={handleSubmit(verifyEmail)}>

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

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                  >
                    Verify Email
                  </button>

                </form>

              ) : (

                /* PASSWORD RESET FORM */

                <form onSubmit={handleSubmit(resetPassword)}>

                  <div className="alert alert-success">
                    Email verified:
                    <strong className="ms-2">
                      {adminEmail}
                    </strong>
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="mb-3">

                    <label
                      htmlFor="newPassword"
                      className="form-label fw-semibold"
                    >
                      New Password
                    </label>

                    <div className="input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        className="form-control form-control-lg"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters required",
                          },
                        })}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {errors.newPassword && (
                      <p className="text-danger small mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}

                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="mb-4">

                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm New Password
                    </label>

                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === newPassword ||
                            "Passwords do not match",
                        })}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="text-danger small mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                  >
                    Reset Password
                  </button>

                </form>

              )}

              {/* BACK TO LOGIN */}
              <div className="text-center mt-4">

                <Link
                  to="/admin-login"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  ← Back to Admin Login
                </Link>

              </div>

              {/* BACK TO HOME */}
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
