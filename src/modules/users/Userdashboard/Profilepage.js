import React, { useState } from "react";
import {
  FaUser,
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaCamera
} from "react-icons/fa";


function MyProfile() {
  const [profilePic, setProfilePic] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="account-section">
      <div className="account-card">
        <h2>My Account</h2>
        <p className="account-subtitle">Manage your profile</p>

        {/* Profile Picture */}
        <div className="profile-picture">
          {profilePic ? (
            <img src={profilePic} alt="Profile" />
          ) : (
            <FaUser className="default-user-icon" />
          )}

          <label
            htmlFor="profile-upload"
            className="camera-icon"
            title="Upload profile picture"
          >
            <FaCamera />
          </label>

          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <h3>Prashant kumar</h3>
        <p className="profile-email">rajput2006parshant@gmail.com</p>

        <button
          type="button"
          className="change-photo-btn"
          onClick={() =>
            document.getElementById("profile-upload").click()
          }
        >
          Change Profile Picture
        </button>
      </div>

      {/* Social Media Links */}
      <div className="profile-social-section">
        <h3>Connect With Me</h3>

        <div className="profile-socials">
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.instagram.com/thakur_prashant_chauhan_01/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.linkedin.com/in/prashant-kumar-9a3984320"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:rajput2006prashant@gmail.com"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;