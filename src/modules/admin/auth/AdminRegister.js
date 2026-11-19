
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

function UserRegistor() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch Password
  const password = watch("pass");

  // Registration Function
  const myform = async (p) => {
    try {
      // Check duplicate email
      const response = await axios.get(
        "http://localhost:8700/admin"
      );

      const alreadyExists = response.data.some(
        (item) =>
          item.email &&
          item.email.toLowerCase() ===
            p.email.trim().toLowerCase()
      );

      if (alreadyExists) {
        toast.error("Email already registered!");
        return;
      }

      // Save Admin Registration Data
      await axios.post("http://localhost:8700/admin", {
        username: p.username.trim(),
        email: p.email.trim().toLowerCase(),
        pass: p.pass,
        phone: p.phone,
        gender: p.gender,
        role: p.role,
        comments: p.comments,
      });

      toast.success("Admin Registration Successful!", {
        theme: "dark",
        autoClose: 1000,
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/admin-login");
      }, 1200);

    } catch (error) {
      console.log(error);
      toast.error("Registration failed! Check JSON Server.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">

      <ToastContainer />

      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <div className="row g-0">

          {/* Left Section */}
          <div className="col-md-4 bg-primary text-white p-4 p-lg-5 d-flex flex-column justify-content-center">

            <h1 className="fw-bold mb-3">
              Admin Registration
            </h1>

            <p className="mb-4">
              Create your administrator account.
            </p>

            <div className="bg-white bg-opacity-10 rounded-3 p-3">
              <h5 className="fw-semibold">
                Create Account
              </h5>

              <p className="small mb-0">
                Fill in your details to get started.
              </p>
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

          {/* Registration Form */}
          <div className="col-md-8 p-4 p-lg-5">

            <h2 className="fw-bold mb-2">
              Admin Registration
            </h2>

            <p className="text-secondary mb-4">
              Please fill in the information below.
            </p>

            <form onSubmit={handleSubmit(myform)}>
              <div className="row">

                {/* Username */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />

                  {errors.username && (
                    <p className="text-danger small">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />

                  {errors.email && (
                    <p className="text-danger small">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter password"
                      autoComplete="new-password"
                      {...register("pass", {
                        required: "Password is required",
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
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {errors.pass && (
                    <p className="text-danger small">
                      {errors.pass.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      className="form-control"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password ||
                          "Passwords do not match",
                      })}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-danger small">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter phone number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                  />

                  {errors.phone && (
                    <p className="text-danger small">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Gender
                  </label>

                  <select
                    className="form-select"
                    defaultValue=""
                    {...register("gender", {
                      required: "Please select gender",
                    })}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>
                  </select>

                  {errors.gender && (
                    <p className="text-danger small">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Role
                  </label>

                  <select
                    className="form-select"
                    defaultValue=""
                    {...register("role", {
                      required: "Please select role",
                    })}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="admin">Admin</option>
                  </select>

                  {errors.role && (
                    <p className="text-danger small">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Comments */}
                <div className="col-12 mb-4">
                  <label className="form-label fw-semibold">
                    Comments
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your comments here..."
                    {...register("comments")}
                  />
                </div>

                {/* Submit Button */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Register Admin
                  </button>
                </div>

              </div>
            </form>

            {/* Login Link */}
            <p className="text-center text-secondary mt-4 mb-0">
              Already have an account?{" "}

              <Link
                to="/admin-login"
                className="text-primary fw-semibold text-decoration-none"
              >
                Admin Login
              </Link>
            </p>

            {/* Home Link */}
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
  );
}

export default UserRegistor;
