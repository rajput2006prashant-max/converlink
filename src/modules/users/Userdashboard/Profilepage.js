
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
    role: "user"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Login User Data
  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  const userId = loginData?.id || loginData?.userId;

  // ==============================
  // LOAD USER PROFILE
  // ==============================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        // Get user details from user database
        const userResponse = await axios.get(
          `${USER_API}/${encodeURIComponent(userId)}`
        );

        const user = userResponse.data;

        // Default user details
        let userProfile = {
          username: user.username || user.name || "",
          email: user.email || "",
          phone: user.phone || user.mobile || "",
          gender: user.gender || "",
          address: user.address || "",
          role: user.role || "user"
        };

        let savedImage = user.profileImage || "";

        // Get saved profile
        const profileResponse = await axios.get(PROFILE_API);

        const savedProfile = profileResponse.data.find(
          (item) => String(item.userId) === String(userId)
        );

        if (savedProfile) {
          setProfileId(savedProfile.id);

          userProfile = {
            username: savedProfile.username || userProfile.username,
            email: savedProfile.email || userProfile.email,
            phone: savedProfile.phone || userProfile.phone,
            gender: savedProfile.gender || userProfile.gender,
            address: savedProfile.address || userProfile.address,
            role: savedProfile.role || userProfile.role
          };

          savedImage =
            savedProfile.profileImage || savedImage;
        }

        setProfile(userProfile);
        setProfilePic(savedImage);

      } catch (error) {
        console.error("Profile loading error:", error);
        setMessage("Profile load nahi ho payi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ==============================
  // IMAGE COMPRESS
  // ==============================

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

          canvas.width = Math.round(
            image.width * scale
          );

          canvas.height = Math.round(
            image.height * scale
          );

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

  // ==============================
  // UPLOAD PROFILE IMAGE
  // ==============================

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

      setMessage(
        "Photo selected. Ab Save Profile par click karein."
      );
    } catch (error) {
      console.error(error);
      setMessage("Image upload nahi ho payi.");
    }

    event.target.value = "";
  };

  // ==============================
  // SAVE PROFILE IN BOTH DATABASES
  // ==============================

  const handleSaveProfile = async () => {
    if (!userId) {
      setMessage("Please login first.");
      return;
    }

    if (
      !profile.username.trim() ||
      !profile.email.trim()
    ) {
      setMessage("Name aur email required hain.");
      return;
    }

    const profileData = {
      userId: String(userId),
      username: profile.username.trim(),
      email: profile.email.trim(),
      phone: profile.phone,
      gender: profile.gender,
      address: profile.address,
      role: profile.role,
      profileImage: profilePic
    };

    try {
      setSaving(true);
      setMessage("");

      // STEP 1: Save or update userprofile database

      if (profileId) {
        await axios.patch(
          `${PROFILE_API}/${encodeURIComponent(profileId)}`,
          profileData
        );
      } else {
        const profileResponse = await axios.post(
          PROFILE_API,
          profileData
        );

        setProfileId(profileResponse.data.id);
      }

      // STEP 2: Update main user database

      const userUpdateResponse = await axios.patch(
        `${USER_API}/${encodeURIComponent(userId)}`,
        {
          username: profile.username.trim(),
          email: profile.email.trim(),
          phone: profile.phone,
          gender: profile.gender,
          address: profile.address,
          profileImage: profilePic
        }
      );

      // STEP 3: Update localStorage data

      const updatedLoginData = {
        ...loginData,
        ...userUpdateResponse.data,
        id: userId
      };

      localStorage.setItem(
        "userLoginData",
        JSON.stringify(updatedLoginData)
      );

      setMessage("Profile successfully saved!");

    } catch (error) {
      console.error(
        "Profile save error:",
        error.response?.data || error.message
      );

      setMessage(
        "Profile save nahi hui. Console check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading Profile...</p>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="account-section">

      <div className="account-card">

        <h2>My Account</h2>

        <p className="account-subtitle">
          Manage your profile
        </p>

        {/* PROFILE PICTURE */}

        <div className="profile-picture">

          {profilePic ? (
            <img
              src={profilePic}
              alt="User Profile"
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

        {/* PROFILE DETAILS */}

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

          {/* SAVE BUTTON */}

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

      {/* SOCIAL MEDIA LINKS */}

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
