
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaEdit,
  FaCamera,
  FaSave,
  FaTimes,
  FaShieldAlt
} from "react-icons/fa";


function MyProfile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@converlink.com",
    phone: "",
    designation: "System Administrator",
    company: "Converlink Engineering Pvt. Ltd.",
    location: "Noida, Uttar Pradesh",
    bio: "Managing company services, projects and customer enquiries."
  });

  const [photo, setPhoto] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="my-profile-page">
      {/* Header */}
      <div className="profile-page-heading">
        <div>
          <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
          <h2>My Profile</h2>
          <p>View and manage your personal information.</p>
        </div>

        {!editing && (
          <button
            className="profile-edit-btn"
            onClick={() => setEditing(true)}
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-layout">
        {/* Left Profile Card */}
        <aside className="profile-summary-card">
          <div className="profile-cover"></div>

          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>

            {editing && (
              <label className="profile-camera-btn" title="Upload photo">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  hidden
                />
              </label>
            )}
          </div>

          <h3>{profile.name || "Your Name"}</h3>
          <p className="profile-designation">{profile.designation}</p>

          <span className="profile-admin-badge">
            <FaShieldAlt /> Administrator
          </span>

          <div className="profile-summary-divider"></div>

          <div className="profile-summary-info">
            <span><FaEnvelope /> {profile.email}</span>
            <span><FaBuilding /> Converlink Engineering</span>
            <span><FaMapMarkerAlt /> {profile.location}</span>
          </div>

          <div className="profile-account-status">
            <span className="profile-online-dot"></span>
            Account Active
          </div>
        </aside>

        {/* Right Details */}
        <section className="profile-details-card">
          <div className="profile-details-heading">
            <div>
              <h4>Personal Information</h4>
              <p>Update your account details below.</p>
            </div>
            <FaUser className="profile-heading-icon" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="profile-field">
                <label>Full Name</label>
                <div className="profile-input-wrap">
                  <FaUser />
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <div className="profile-input-wrap">
                  <FaEnvelope />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <div className="profile-input-wrap">
                  <FaPhone />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Designation</label>
                <div className="profile-input-wrap">
                  <FaBriefcase />
                  <input
                    name="designation"
                    value={profile.designation}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Company Name</label>
                <div className="profile-input-wrap">
                  <FaBuilding />
                  <input
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Location</label>
                <div className="profile-input-wrap">
                  <FaMapMarkerAlt />
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="profile-field profile-full-width">
                <label>About Me</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="4"
                  placeholder="Write something about yourself"
                />
              </div>
            </div>

            {editing && (
              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  <FaTimes /> Cancel
                </button>

                <button type="submit" className="profile-save-btn">
                  <FaSave /> Save Changes
                </button>
              </div>
            )}
          </form>

          <div className="profile-security-note">
            <FaShieldAlt />
            <div>
              <strong>Your account, your information</strong>
              <p>Keep your contact information up to date.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyProfile;
