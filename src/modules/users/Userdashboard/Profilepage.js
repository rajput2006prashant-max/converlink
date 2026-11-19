import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaCamera
} from "react-icons/fa";

const USER_API = "http://localhost:8700/user";
const PROFILE_API = "http://localhost:8700/userprofile";

function MyProfile() {
  const [profilePic, setProfilePic] = useState("");
  const [profileId, setProfileId] = useState(null);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    role: "User"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Login user data
  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  // Load user and saved profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!loginData || !loginData.id) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        // Get user details
        const userResponse = await axios.get(
          `${USER_API}/${loginData.id}`
        );

        const user = userResponse.data;

        // Default details from user login
        setProfile({
          username: user.username || user.name || loginData.username || "",
          email: user.email || loginData.email || "",
          phone: user.phone || user.mobile || loginData.phone || "",
          gender: "",
          address: "",
          role: user.role || loginData.role || "User"
        });

        // Get saved profile
        const profileResponse = await axios.get(PROFILE_API);

        const savedProfile = profileResponse.data.find(
          (item) => String(item.userId) === String(loginData.id)
        );

        if (savedProfile) {
          setProfileId(savedProfile.id);

          setProfile({
            username: savedProfile.username || user.username || "",
            email: savedProfile.email || user.email || "",
            phone: savedProfile.phone || user.phone || "",
            gender: savedProfile.gender || "",
            address: savedProfile.address || "",
            role: savedProfile.role || "User"
          });

          setProfilePic(savedProfile.profileImage || "");
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        setMessage("Profile load nahi ho payi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Compress image before saving
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");

          const maxWidth = 400;
          const scale = Math.min(
            1,
            maxWidth / image.width
          );

          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext("2d");

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressedImage = canvas.toDataURL(
            "image/jpeg",
            0.5
          );

          resolve(compressedImage);
        };

        image.onerror = reject;
        image.src = event.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload profile image
  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    try {
      const compressedImage = await compressImage(file);

      setProfilePic(compressedImage);
      setMessage("Photo selected. Click Save Profile.");
    } catch (error) {
      console.error(error);
      setMessage("Image upload nahi ho payi.");
    }
  };

  // Save profile data in JSON Server
  const handleSaveProfile = async () => {
    if (!loginData || !loginData.id) {
      setMessage("Please login first.");
      return;
    }

    if (!profile.username.trim() || !profile.email.trim()) {
      setMessage("Name aur email required hain.");
      return;
    }

    const profileData = {
      userId: String(loginData.id),
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      address: profile.address,
      role: profile.role,
      profileImage: profilePic
    };

    try {
      setSaving(true);
      setMessage("");

      if (profileId) {
        // Update existing profile
        await axios.patch(
          `${PROFILE_API}/${profileId}`,
          profileData
        );
      } else {
        // Create new profile
        const response = await axios.post(
          PROFILE_API,
          profileData
        );

        setProfileId(response.data.id);
      }

      setMessage("Profile successfully saved!");

    } catch (error) {
      console.error("Profile save error:", error);

      setMessage(
        "Profile save nahi hui. Image size kam karke dobara try karein."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="account-section">

      <div className="account-card">

        <h2>My Account</h2>
        <p className="account-subtitle">
          Manage your profile
        </p>

        {/* Profile Picture */}
        <div className="profile-picture">

          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
            />
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

        <h3>{profile.username || "User Name"}</h3>

        <p className="profile-email">
          {profile.email || "Email Address"}
        </p>

        <button
          type="button"
          className="change-photo-btn"
          onClick={() =>
            document.getElementById("profile-upload").click()
          }
        >
          Change Profile Picture
        </button>

        {/* Profile Details */}
        <div className="container mt-4 text-start">

          <div className="mb-3">
            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              name="username"
              className="form-control"
              value={profile.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              className="form-control"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Gender
            </label>

            <select
              name="gender"
              className="form-select"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Address
            </label>

            <textarea
              name="address"
              className="form-control"
              rows="3"
              value={profile.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p className="text-center mt-3">
              {message}
            </p>
          )}

        </div>
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
            href={`mailto:${profile.email}`}
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