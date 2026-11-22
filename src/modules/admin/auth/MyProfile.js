
import React, { useEffect, useState } from "react";
import axios from "axios";

const ADMIN_API = "http://localhost:8700/admin";
const PROFILE_API = "http://localhost:8700/adminprofile";

function MyProfile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    role: "admin"
  });

  const [adminId, setAdminId] = useState("");
  const [profileRecordId, setProfileRecordId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photo, setPhoto] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================
  // FETCH ADMIN PROFILE
  // =====================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const loginData = JSON.parse(
        localStorage.getItem("adminLoginData") || "null"
      );

      if (!loginData?.id) {
        setError("Admin login information nahi mili. Please login again.");
        return;
      }

      const currentAdminId = String(loginData.id);

      // Fetch admin account
      const adminResponse = await axios.get(
        `${ADMIN_API}/${encodeURIComponent(currentAdminId)}`
      );

      const admin = adminResponse.data;

      setAdminId(currentAdminId);

      // Fetch all admin profiles
      const profileResponse = await axios.get(PROFILE_API);

      // Find profile using adminId OR profile record id
      const savedProfile = profileResponse.data.find(
        (item) =>
          String(item.adminId) === currentAdminId ||
          String(item.id) === currentAdminId
      );

      if (savedProfile) {
        // Automatically correct old mismatched adminId
        if (String(savedProfile.adminId) !== currentAdminId) {
          await axios.patch(
            `${PROFILE_API}/${savedProfile.id}`,
            {
              adminId: currentAdminId
            }
          );
        }

        setProfileRecordId(savedProfile.id);

        setProfile({
          username:
            savedProfile.username ||
            admin.username ||
            admin.name ||
            "",
          email: savedProfile.email || admin.email || "",
          phone:
            savedProfile.phone ||
            admin.phone ||
            admin.mobile ||
            "",
          gender: savedProfile.gender || admin.gender || "",
          address: savedProfile.address || "",
          role: savedProfile.role || admin.role || "admin"
        });

        setPhoto(savedProfile.profileImage || "");
      } else {
        setProfileRecordId("");

        setProfile({
          username: admin.username || admin.name || "",
          email: admin.email || "",
          phone: admin.phone || admin.mobile || "",
          gender: admin.gender || "",
          address: admin.address || "",
          role: admin.role || "admin"
        });

        setPhoto("");
      }
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
      setError(
        "Profile load nahi hui. JSON Server aur admin data check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================
  // PROFILE PHOTO UPLOAD AND COMPRESS
  // =====================================

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please valid image select karo.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Photo maximum 10 MB ki select karo.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 400;

        let width = image.width;
        let height = image.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          setError("Image compress nahi ho payi.");
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        const compressedPhoto = canvas.toDataURL(
          "image/jpeg",
          0.55
        );

        if (compressedPhoto.length > 85000) {
          setError("Photo abhi bhi badi hai. Chhoti image select karo.");
          e.target.value = "";
          return;
        }

        setPhoto(compressedPhoto);
        setError("");
        setSuccess("");
      };

      image.onerror = () => {
        setError("Image process nahi ho payi.");
      };

      image.src = event.target.result;
    };

    reader.onerror = () => {
      setError("Image read nahi ho payi.");
    };

    reader.readAsDataURL(file);
  };

  // =====================================
  // REMOVE PHOTO
  // =====================================

  const removePhoto = () => {
    setPhoto("");
    setError("");
    setSuccess("");
  };

  // =====================================
  // SAVE PROFILE
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!adminId) {
      setError("Admin ID nahi mili. Please login again.");
      return;
    }

    if (!profile.username.trim() || !profile.email.trim()) {
      setError("Name aur email required hain.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const profileData = {
        adminId: String(adminId),
        username: profile.username.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        gender: profile.gender,
        address: profile.address.trim(),
        role: profile.role || "admin",
        profileImage: photo
      };

      let recordId = profileRecordId;

      // If record ID is not known, search existing profile
      if (!recordId) {
        const response = await axios.get(PROFILE_API);

        const existingProfile = response.data.find(
          (item) =>
            String(item.adminId) === String(adminId) ||
            String(item.id) === String(adminId)
        );

        if (existingProfile) {
          recordId = existingProfile.id;
        }
      }

      if (recordId) {
        const updateResponse = await axios.patch(
          `${PROFILE_API}/${recordId}`,
          profileData
        );

        setProfileRecordId(updateResponse.data.id);
      } else {
        const saveResponse = await axios.post(
          PROFILE_API,
          profileData
        );

        setProfileRecordId(saveResponse.data.id);
      }

      setEditMode(false);
      setSuccess("Profile successfully save ho gayi!");
    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      console.error("SERVER RESPONSE:", err.response?.data);

      setError(
        err.response
          ? `Server Error ${err.response.status}: ${JSON.stringify(
              err.response.data
            )}`
          : "JSON Server connect nahi ho raha. Port 8700 check karo."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancel = async () => {
    setEditMode(false);
    setError("");
    setSuccess("");

    await fetchProfile();
  };

  // =====================================
  // CHANGE PASSWORD
  // =====================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!adminId) {
      setError("Admin ID nahi mili. Please login again.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password minimum 8 characters ka hona chahiye.");
      return;
    }

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setError("New password aur Confirm Password match nahi kar rahe.");
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await axios.get(
        `${ADMIN_API}/${encodeURIComponent(adminId)}`
      );

      const admin = response.data;

      if (!admin.pass) {
        setError("Is admin account ke liye password field available nahi hai.");
        return;
      }

      if (admin.pass !== passwordData.currentPassword) {
        setError("Current password incorrect hai.");
        return;
      }

      await axios.patch(
        `${ADMIN_API}/${encodeURIComponent(adminId)}`,
        {
          pass: passwordData.newPassword
        }
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setShowPassword(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setSuccess("Password successfully update ho gaya!");
    } catch (err) {
      console.error("PASSWORD ERROR:", err);
      setError("Password update nahi hua.");
    } finally {
      setPasswordSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="container-fluid text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading Profile...</p>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* HEADING */}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            My Profile
          </h3>

          <p className="text-secondary mb-0">
            Manage your account information and security
          </p>
        </div>

        {!editMode && adminId && (
          <button
            className="btn text-white px-4"
            style={{ backgroundColor: "#087FC4" }}
            onClick={() => {
              setError("");
              setSuccess("");
              setEditMode(true);
            }}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit Profile
          </button>
        )}
      </div>

      {/* ALERTS */}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}

          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          {success}

          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {adminId && (
        <div className="row g-4">

          {/* LEFT PROFILE CARD */}

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">

              <div
                className="text-center text-white p-4 rounded-top"
                style={{ backgroundColor: "#102D4F" }}
              >
                <div className="mb-3">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Admin Profile"
                      className="rounded-circle border border-4 border-white"
                      style={{
                        width: "125px",
                        height: "125px",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center border border-4 border-white"
                      style={{
                        width: "125px",
                        height: "125px",
                        backgroundColor: "#087FC4",
                        fontSize: "50px"
                      }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                </div>

                <h4 className="fw-bold mb-1">
                  {profile.username || "Admin"}
                </h4>

                <p className="mb-2">{profile.email}</p>

                <span className="badge bg-info text-dark px-3 py-2">
                  {profile.role}
                </span>
              </div>

              <div className="card-body p-4">

                {editMode && (
                  <div className="mb-4 text-center">

                    <label className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-camera me-2"></i>
                      Change Photo

                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhoto}
                      />
                    </label>

                    {photo && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={removePhoto}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                      </button>
                    )}

                    <small className="d-block text-secondary mt-2">
                      JPG, PNG | Photo automatically compressed
                    </small>
                  </div>
                )}

                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                  <div>
                    <small className="text-secondary">Mobile Number</small>
                    <p className="mb-0 fw-semibold">
                      {profile.phone || "Not added"}
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-gender-ambiguous text-primary me-3 fs-5"></i>
                  <div>
                    <small className="text-secondary">Gender</small>
                    <p className="mb-0 fw-semibold">
                      {profile.gender || "Not added"}
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <i className="bi bi-geo-alt text-primary me-3 fs-5"></i>
                  <div>
                    <small className="text-secondary">Address</small>
                    <p className="mb-0 fw-semibold">
                      {profile.address || "Not added"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-8">

            {/* PERSONAL INFORMATION */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-header bg-white p-3">
                <h5 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Personal Information
                </h5>
              </div>

              <div className="card-body p-4">

                <form onSubmit={handleSave}>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        placeholder="Enter full name"
                        value={profile.username}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter mobile number"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Gender
                      </label>

                      <select
                        name="gender"
                        className="form-select"
                        value={profile.gender}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Address
                      </label>

                      <textarea
                        name="address"
                        rows="3"
                        className="form-control"
                        placeholder="Enter your address"
                        value={profile.address}
                        onChange={handleChange}
                        disabled={!editMode}
                      ></textarea>
                    </div>

                  </div>

                  {editMode && (
                    <div className="d-flex gap-2 mt-4 flex-wrap">

                      <button
                        type="submit"
                        className="btn text-white px-4"
                        style={{ backgroundColor: "#087FC4" }}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                    </div>
                  )}
                </form>

              </div>
            </div>

            {/* ACCOUNT SECURITY */}

            <div className="card border-0 shadow-sm">

              <div className="card-header bg-white p-3">
                <h5 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
                  <i className="bi bi-shield-lock me-2"></i>
                  Account Security
                </h5>
              </div>

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h6 className="fw-bold mb-1">Change Password</h6>
                    <p className="text-secondary small mb-0">
                      Keep your admin account secure
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setShowPassword(!showPassword);
                    }}
                  >
                    <i className="bi bi-lock me-2"></i>
                    {showPassword ? "Close" : "Change Password"}
                  </button>
                </div>

                {showPassword && (
                  <form
                    onSubmit={handlePasswordChange}
                    className="mt-4"
                  >

                    {/* CURRENT PASSWORD */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Current Password
                      </label>

                      <div className="input-group">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value
                            })
                          }
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* NEW PASSWORD */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        New Password
                      </label>

                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Minimum 8 characters"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value
                            })
                          }
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowNewPassword(!showNewPassword)
                          }
                        >
                          <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Confirm New Password
                      </label>

                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value
                            })
                          }
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={passwordSaving}
                    >
                      {passwordSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Update Password
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyProfile;
