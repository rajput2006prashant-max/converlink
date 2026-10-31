
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserForgot() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");

      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      toast.error("Unable to read registered users!", {
        theme: "colored",
        autoClose: 2500,
      });
      return;
    }

    const user = users.find(
      (item) =>
        item.email &&
        item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      toast.error("Is email se koi registered account nahi mila.", {
        theme: "colored",
        autoClose: 2500,
        position: "top-right",
      });
      return;
    }

    setVerifiedEmail(user.email);

    toast.success("Email verified! Ab naya password set karein.", {
      theme: "colored",
      autoClose: 2500,
      position: "top-right",
    });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye.", {
        theme: "colored",
        autoClose: 2500,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password aur Confirm Password match nahi karte.", {
        theme: "colored",
        autoClose: 2500,
      });
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const updatedUsers = users.map((user) =>
        user.email.toLowerCase() === verifiedEmail.toLowerCase()
          ? { ...user, password: newPassword }
          : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      toast.success("Password reset successful! Please login.", {
        theme: "colored",
        autoClose: 1800,
        position: "top-right",
        onClose: () => navigate("/user-login", { replace: true }),
      });

      setVerifiedEmail("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Password reset nahi ho saka. Dobara try karein.", {
        theme: "colored",
        autoClose: 2500,
      });
    }
  };

  return (
    <Fragment>
      <ToastContainer />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "900px" }}
        >
          <div className="row g-0">
            {/* Left Section */}
            <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <FaLock size={60} />

              <h1 className="fw-bold mb-3 mt-3">
                Forgot Password?
              </h1>

              <p className="fs-5">
                Don't worry! It happens to everyone.
              </p>

              <p className="text-white-50">
                Enter your registered email address to recover access
                to your account.
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

                <h2 className="fw-bold text-dark">
                  Reset Your Password
                </h2>

                <p className="text-secondary">
                  Verify your registered email to continue.
                </p>
              </div>

              {!verifiedEmail ? (
                <form onSubmit={handleEmailSubmit}>
                  <label htmlFor="email" className="form-label fw-semibold">
                    Registered Email
                  </label>

                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light">
                      <FaEnvelope />
                    </span>

                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                  >
                    Verify Email
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordReset}>
                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className="form-label fw-semibold"
                    >
                      New Password
                    </label>

                    <input
                      id="newPassword"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm New Password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                  >
                    Reset Password
                  </button>
                </form>
              )}

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
