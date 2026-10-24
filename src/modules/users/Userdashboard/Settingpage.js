import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBuilding
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


function Settings() {
  return (
    <div className="settings-page">
      <div className="container py-5">

        {/* Page Heading */}
        <div className="settings-heading mb-4">
          <h2>Account Settings</h2>
          <p>Manage your account and preferences</p>
        </div>

        <div className="row g-4">

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="settings-sidebar">
              <div className="company-heading">
                <FaBuilding />
                <span>CONVERLINK</span>
              </div>

              <p className="text-muted mb-4">
                ENGINEERING PVT. LTD.
              </p>

              <Link to="/landing/profile" className="settings-menu">
                <FaUser />
                <span>My Profile</span>
                <FaChevronRight className="ms-auto" />
              </Link>

              <Link to="/landing/setting" className="settings-menu active">
                <FaShieldAlt />
                <span>Settings</span>
                <FaChevronRight className="ms-auto" />
              </Link>

              <Link to="/user-login" className="settings-menu logout-menu">
                <FaSignOutAlt />
                <span>Logout</span>
                <FaChevronRight className="ms-auto" />
              </Link>
            </div>
          </div>

          {/* Settings Content */}
          <div className="col-lg-8">
            <div className="settings-content">

              <h4 className="mb-1">General Settings</h4>
              <p className="text-muted mb-4">
                Update your account preferences.
              </p>

              {/* Profile */}
              <div className="settings-item">
                <div className="settings-icon blue">
                  <FaUser />
                </div>

                <div className="settings-info">
                  <h6>Profile Settings</h6>
                  <p>Manage your name, email and contact details.</p>
                </div>

                <Link to="/my-profile" className="settings-action">
                  Edit <FaChevronRight />
                </Link>
              </div>

              {/* Password */}
              <div className="settings-item">
                <div className="settings-icon purple">
                  <FaLock />
                </div>

                <div className="settings-info">
                  <h6>Change Password</h6>
                  <p>Keep your account secure with a strong password.</p>
                </div>

                <Link to="/forgot-password" className="settings-action">
                  Change <FaChevronRight />
                </Link>
              </div>

              {/* Notifications */}
              <div className="settings-item">
                <div className="settings-icon orange">
                  <FaBell />
                </div>

                <div className="settings-info">
                  <h6>Email Notifications</h6>
                  <p>Receive important company updates by email.</p>
                </div>

                <span className="badge bg-success">Enabled</span>
              </div>

              {/* Security */}
              <div className="settings-item">
                <div className="settings-icon green">
                  <FaShieldAlt />
                </div>

                <div className="settings-info">
                  <h6>Privacy & Security</h6>
                  <p>Protect your account and personal information.</p>
                </div>

                <span className="badge bg-primary">Secure</span>
              </div>

              <div className="settings-footer">
                <FaShieldAlt />
                Your account security is important to us.
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;