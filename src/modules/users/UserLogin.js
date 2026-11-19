
import React, { Fragment, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLinkedin,
  FaFacebook,
  FaGithub
} from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";

function UserLogin() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Normal User Login
  const myform = async (data) => {

    try {

      const response = await axios.get(
        "http://localhost:8700/user"
      );

      const users = response.data;

      const email = data.email.trim().toLowerCase();
      const password = data.pass;

      const user = users.find((item) => {

        return (
          item.email.trim().toLowerCase() === email &&
          item.pass === password
        );

      });

      if (user) {

        localStorage.setItem("userLoggedIn", "true");

        localStorage.setItem(
          "userLoginData",
          JSON.stringify({
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            id: user.id,
          })
        );

        toast.success("User Login Successful!", {
          autoClose: 1200,
          onClose: () => {
            navigate("/landing");
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

  // Social Login Handler
  const handleSocialLogin = (provider) => {

    toast.info(
      `${provider} Login requires OAuth configuration.`
    );

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
                User Portal
              </p>

              <p className="text-white-50">
                Welcome to Converlink Engineering Pvt. Ltd.
                Login to manage your company website,
                services, projects and enquiries.
              </p>

              <div className="mt-4">

                <span className="badge bg-white text-primary rounded-pill p-3">
                  Secure User Access
                </span>

              </div>

              <div className="mt-5">

                <h5 className="fw-semibold">
                  User Responsibilities
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
                User Login
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

                  <div className="input-group">

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      {...register("pass", {
                        required: "Password is required",
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
                    to="/user-forgot"
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

              {/* OR Divider */}
              <div className="d-flex align-items-center my-4">

                <hr className="flex-grow-1" />

                <span className="px-3 text-secondary small">
                  OR CONTINUE WITH
                </span>

                <hr className="flex-grow-1" />

              </div>

              {/* Social Login Buttons */}
              <div className="d-grid gap-3">

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="btn btn-outline-dark py-2 fw-semibold"
                >
                  <FaGoogle className="me-2 text-danger" />
                  Continue with Google
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("LinkedIn")}
                  className="btn btn-outline-dark py-2 fw-semibold"
                >
                  <FaLinkedin className="me-2 text-primary" />
                  Continue with LinkedIn
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="btn btn-outline-dark py-2 fw-semibold"
                >
                  <FaFacebook className="me-2 text-primary" />
                  Continue with Facebook
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("GitHub")}
                  className="btn btn-outline-dark py-2 fw-semibold"
                >
                  <FaGithub className="me-2" />
                  Continue with GitHub
                </button>

              </div>

              {/* Register Link */}
              <p className="text-center text-secondary mt-4 mb-0">

                Don't have an account?{" "}

                <Link
                  to="/user-register"
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

export default UserLogin;
