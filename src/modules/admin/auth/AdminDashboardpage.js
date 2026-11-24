
import React, { useEffect, useState } from "react";
import axios from "axios";

import { MdDelete } from "react-icons/md";

import {
  FaEdit,
  FaListOl,
  FaUserShield,
  FaUsers,
  FaEnvelopeOpenText,
  FaProjectDiagram,
  FaBolt,
  FaTools,
  FaBuilding,
  
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";

import { useGlobalSettings } from "../../../Context/SettingsContext";

function AdminDashboardpage() {
  const { theme, language, itemsPerPage } = useGlobalSettings();

  const isDark = theme === "dark";

  // API DATA
  const [admin, setAdmin] = useState([]);
  const [user, setUser] = useState([]);
  const [newEnquiry, setNewEnquiry] = useState([]);
  const [projects, setProjects] = useState([]);

  // ADMIN PROFILE
  const [adminProfile, setAdminProfile] = useState(null);
  const [imageError, setImageError] = useState(false);

  // PAGINATION
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);

  // PROJECT EDIT
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({});

  const limit = Number(itemsPerPage) || 10;

  // TRANSLATIONS
  const translations = {
    English: {
      totalAdmins: "Total Admins",
      totalUsers: "Total Users",
      newEnquiries: "New Enquiries",
      totalProjects: "Total Projects",
      companyOverview: "Company Overview",
      welcome: "Welcome to Admin Dashboard.",
      adminList: "Admin List",
      userList: "User List",
      projectList: "Total Projects List",
      id: "Id",
      username: "Username",
      email: "Email",
      phone: "Phone Number",
      gender: "Gender",
      role: "Role",
      comments: "Comments",
      action: "Action",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      deleteSuccess: "Deleted successfully",
      deleteError: "Unable to delete record",
      noData: "No records found",
      updateSuccess: "Project updated successfully",
      updateError: "Unable to update project",
      editProject: "Edit Project",
      cancel: "Cancel",
      update: "Update Project"
    },

    Hindi: {
      totalAdmins: "कुल एडमिन",
      totalUsers: "कुल यूजर्स",
      newEnquiries: "नई पूछताछ",
      totalProjects: "कुल प्रोजेक्ट",
      companyOverview: "कंपनी की जानकारी",
      welcome: "एडमिन डैशबोर्ड में आपका स्वागत है।",
      adminList: "एडमिन सूची",
      userList: "यूजर सूची",
      projectList: "कुल प्रोजेक्ट सूची",
      id: "आईडी",
      username: "यूजरनेम",
      email: "ईमेल",
      phone: "फोन नंबर",
      gender: "लिंग",
      role: "रोल",
      comments: "टिप्पणी",
      action: "एक्शन",
      previous: "पिछला",
      next: "अगला",
      page: "में से पेज",
      of: "में से",
      deleteSuccess: "सफलतापूर्वक डिलीट हुआ",
      deleteError: "रिकॉर्ड डिलीट नहीं हो सका",
      noData: "कोई रिकॉर्ड नहीं मिला",
      updateSuccess: "प्रोजेक्ट अपडेट हो गया",
      updateError: "प्रोजेक्ट अपडेट नहीं हुआ",
      editProject: "प्रोजेक्ट एडिट करें",
      cancel: "रद्द करें",
      update: "प्रोजेक्ट अपडेट करें"
    }
  };

  const t = translations[language] || translations.English;

  // FETCH ALL DATA
  const getData = async () => {
    try {
      const [
        adminResponse,
        userResponse,
        enquiryResponse,
        projectResponse
      ] = await Promise.all([
        axios.get("http://localhost:8700/admin"),
        axios.get("http://localhost:8700/user"),
        axios.get("http://localhost:8700/NewEnuiry"),
        axios.get("http://localhost:8700/totalproject")
      ]);

      setAdmin(Array.isArray(adminResponse.data) ? adminResponse.data : []);
      setUser(Array.isArray(userResponse.data) ? userResponse.data : []);
      setNewEnquiry(Array.isArray(enquiryResponse.data) ? enquiryResponse.data : []);
      setProjects(Array.isArray(projectResponse.data) ? projectResponse.data : []);

    } catch (error) {
      console.error("Dashboard API Error:", error);
      toast.error("Unable to load dashboard data");
    }
  };

  // FETCH LOGGED-IN ADMIN PROFILE
  const getAdminProfile = async () => {
    try {
      const loginData = JSON.parse(
        localStorage.getItem("adminLoginData") || "null"
      );

      if (!loginData) {
        setAdminProfile(null);
        return;
      }

      let loginEmail = loginData.email || "";

      if (!loginEmail && loginData.id) {
        try {
          const adminResponse = await axios.get(
            `http://localhost:8700/admin/${encodeURIComponent(loginData.id)}`
          );

          loginEmail = adminResponse.data?.email || "";

        } catch (error) {
          console.error("Admin details fetch error:", error);
        }
      }

      const response = await axios.get(
        "http://localhost:8700/adminprofile"
      );

      const profiles = Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];

      let currentProfile = profiles.find((item) => {
        return (
          loginData.id &&
          item.adminId &&
          String(item.adminId) === String(loginData.id)
        );
      });

      if (!currentProfile && loginEmail) {
        currentProfile = profiles.find((item) => {
          return (
            item.email &&
            item.email.toLowerCase() === loginEmail.toLowerCase()
          );
        });
      }

      setAdminProfile(currentProfile || null);
      setImageError(false);

    } catch (error) {
      console.error("Admin Profile API Error:", error);
      setAdminProfile(null);
    }
  };

  // LOAD DATA + LISTEN FOR PROFILE UPDATE
  useEffect(() => {
    getData();
    getAdminProfile();

    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setAdminProfile(event.detail);
        setImageError(false);
      }

      getAdminProfile();
    };

    window.addEventListener(
      "adminProfileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  // DELETE ADMIN
  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:8700/admin/${id}`);

      toast.success(t.deleteSuccess);
      setAdminPage(1);
      getData();

    } catch (error) {
      console.error(error);
      toast.error(t.deleteError);
    }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8700/user/${id}`);

      toast.success(t.deleteSuccess);
      setUserPage(1);
      getData();

    } catch (error) {
      console.error(error);
      toast.error(t.deleteError);
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8700/totalproject/${id}`
      );

      toast.success("Project deleted successfully");

      setProjectPage(1);
      getData();

    } catch (error) {
      console.error(error);
      toast.error("Unable to delete project");
    }
  };

  // OPEN PROJECT EDIT FORM
  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditForm({ ...project });
  };

  // HANDLE EDIT INPUT
  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // UPDATE PROJECT
  const updateProject = async () => {
    try {
      const updatedProject = { ...editForm };

      Object.keys(updatedProject).forEach((key) => {
        if (key === "id") return;

        const originalValue = editingProject[key];
        const currentValue = updatedProject[key];

        if (
          typeof originalValue === "number" &&
          currentValue !== ""
        ) {
          updatedProject[key] = Number(currentValue);

        } else if (typeof originalValue === "boolean") {
          updatedProject[key] = currentValue === "true";

        } else if (
          originalValue !== null &&
          typeof originalValue === "object"
        ) {
          try {
            updatedProject[key] = JSON.parse(currentValue);
          } catch {
            updatedProject[key] = originalValue;
          }
        }
      });

      await axios.put(
        `http://localhost:8700/totalproject/${editingProject.id}`,
        updatedProject
      );

      toast.success(t.updateSuccess);

      setEditingProject(null);
      setEditForm({});

      getData();

    } catch (error) {
      console.error(error);
      toast.error(t.updateError);
    }
  };

  // PAGINATION
  const adminTotalPages = Math.max(
    1,
    Math.ceil(admin.length / limit)
  );

  const userTotalPages = Math.max(
    1,
    Math.ceil(user.length / limit)
  );

  const projectTotalPages = Math.max(
    1,
    Math.ceil(projects.length / limit)
  );

  const adminStart = (adminPage - 1) * limit;
  const userStart = (userPage - 1) * limit;
  const projectStart = (projectPage - 1) * limit;

  const currentAdmins = admin.slice(
    adminStart,
    adminStart + limit
  );

  const currentUsers = user.slice(
    userStart,
    userStart + limit
  );

  const currentProjects = projects.slice(
    projectStart,
    projectStart + limit
  );

  // DYNAMIC PROJECT COLUMNS
  const projectColumns = projects.length > 0
    ? Object.keys(projects[0]).filter(
        (key) => key !== "id"
      )
    : [];

  // PAGINATION BUTTONS
  const renderPagination = (
    currentPage,
    totalPages,
    setPage
  ) => {
    return (
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">

        <span className="small">
          {t.page} {currentPage} {t.of} {totalPages}
        </span>

        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            {t.previous}
          </button>

          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            {t.next}
          </button>

        </div>
      </div>
    );
  };

  // TABLE HEADINGS
  const tableHeadings = [
    t.id,
    t.username,
    t.email,
    t.phone,
    t.gender,
    t.role,
    t.comments,
    t.action
  ];

  // TABLE STYLE
  const tableClass = isDark
    ? "table table-dark table-hover table-bordered align-middle"
    : "table table-primary table-hover table-bordered align-middle";

  // ADMIN INITIALS
  const adminInitials = (adminProfile?.username || "PK")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // PROJECT STATUS COUNTS
  const pendingProjects = projects.filter(
    (project) =>
      String(project.status || "").toLowerCase() === "pending"
  ).length;

  const completedProjects = projects.filter(
    (project) =>
      String(project.status || "").toLowerCase() === "completed"
  ).length;

  return (
    <div className={`container-fluid mt-3 dashboard-page ${isDark ? "dashboard-dark" : "dashboard-light"}`}>

      {/* DASHBOARD CSS */}
      <style>
        {`
          .dashboard-page {
            padding-bottom: 25px;
          }

          .dashboard-heading {
            background: linear-gradient(120deg, #102D4F, #087FC4, #16A6C9);
            border-radius: 20px;
            padding: 25px 28px;
            color: white;
            box-shadow: 0 10px 25px rgba(16,45,79,0.20);
            position: relative;
            overflow: hidden;
          }

          .dashboard-heading::after {
            content: "";
            position: absolute;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            right: -35px;
            top: -70px;
          }

          .dashboard-heading h3 {
            font-weight: 800;
            color: white;
          }

          .dashboard-heading p {
            color: #D9EDFF;
          }

          .dashboard-heading-content {
            position: relative;
            z-index: 1;
          }

          .dashboard-stat-card {
            border: none !important;
            border-radius: 16px !important;
            min-height: 145px;
            overflow: hidden;
            position: relative;
            transition: all 0.3s ease;
          }

          .dashboard-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.2) !important;
          }

          .dashboard-stat-card .card-body {
            padding: 22px;
          }

          .dashboard-stat-card h6 {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .dashboard-stat-card .stat-number {
            font-size: 35px;
            font-weight: 700;
            margin: 12px 0 5px;
          }

          .dashboard-stat-card .stat-icon {
            font-size: 48px;
            opacity: 0.25;
            flex-shrink: 0;
          }

          .stat-admin {
            background: linear-gradient(135deg, #102D4F, #087FC4);
            color: white;
          }

          .stat-users {
            background: linear-gradient(135deg, #087F5B, #20BF85);
            color: white;
          }

          .stat-enquiries {
            background: linear-gradient(135deg, #B42335, #F05A67);
            color: white;
          }

          .stat-projects {
            background: linear-gradient(135deg, #D18A08, #FFC247);
            color: #252525;
          }

          .company-overview-card {
            border-radius: 16px;
            background: linear-gradient(135deg, #101820, #102D4F);
            color: white;
            min-height: 100%;
            border: none;
          }

          .company-service-item {
            display: flex;
            align-items: center;
            gap: 9px;
          }

          .dashboard-side-card {
            border-radius: 15px;
            border: none;
            overflow: hidden;
            transition: 0.3s ease;
          }

          .dashboard-side-card:hover {
            transform: translateY(-4px);
          }

          .dashboard-custom-card {
            border: none;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 18px rgba(0,0,0,0.08);
          }

          .dashboard-custom-card .card-body {
            padding: 22px;
          }

          .dashboard-custom-card h5 {
            font-weight: 700;
            color: ${isDark ? "#FFFFFF" : "#102D4F"};
          }

          .dashboard-dark .dashboard-custom-card {
            background: #202B3A;
            color: white;
          }

          .dashboard-light .dashboard-custom-card {
            background: white;
            color: #102D4F;
          }

          .project-table-wrapper {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .project-table {
            width: 100% !important;
            max-width: 100%;
            table-layout: fixed !important;
            margin-bottom: 0;
            font-size: 12px;
          }

          .project-table th,
          .project-table td {
            padding: 8px 5px;
            white-space: normal !important;
            word-break: break-word;
            overflow-wrap: anywhere;
            vertical-align: middle;
          }

          .project-table th:first-child,
          .project-table td:first-child {
            width: 45px;
          }

          .project-table th:last-child,
          .project-table td:last-child {
            width: 90px;
            text-align: center;
            white-space: nowrap !important;
          }

          .project-table .project-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
          }

          .project-table .project-actions button {
            padding: 4px 6px;
            margin: 0 !important;
          }

          .dashboard-page .table {
            margin-bottom: 0;
          }

          .dashboard-page .table th {
            white-space: nowrap;
          }

          .dashboard-page .table td {
            vertical-align: middle;
          }

          @media (max-width: 768px) {
            .dashboard-heading {
              padding: 20px;
            }

            .dashboard-heading h3 {
              font-size: 22px;
            }

            .dashboard-stat-card {
              min-height: 125px;
            }

            .dashboard-stat-card .card-body {
              padding: 16px;
            }

            .dashboard-stat-card .stat-number {
              font-size: 28px;
            }

            .dashboard-stat-card .stat-icon {
              font-size: 36px;
            }

            .project-table {
              font-size: 10px;
            }

            .project-table th,
            .project-table td {
              padding: 5px 3px;
            }

            .project-table th:first-child,
            .project-table td:first-child {
              width: 35px;
            }

            .project-table th:last-child,
            .project-table td:last-child {
              width: 75px;
            }

            .dashboard-custom-card .card-body {
              padding: 15px;
            }
          }

          @media (max-width: 576px) {
            .dashboard-heading .text-end {
              text-align: left !important;
            }
          }
        `}
      </style>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme={isDark ? "dark" : "light"}
      />

      {/* DASHBOARD HEADER - CORRECT POSITION */}
      <div className="dashboard-heading mb-4">

        <div className="dashboard-heading-content d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <span className="badge bg-light text-primary mb-2 px-3 py-2">
              CONVERLINK ADMIN PANEL
            </span>

            <h3 className="mb-2">
              <FaBuilding className="me-2" />
              Dashboard Overview
            </h3>

            <p className="mb-0">
              Manage your company, users, enquiries and projects from one place.
            </p>
          </div>

          <div className="text-end">
            <span className="badge bg-success px-3 py-2">
              <FaCheckCircle className="me-1" />
              System Active
            </span>

            <div className="mt-2 small text-white">
              Welcome, {adminProfile?.username || "Administrator"}
            </div>
          </div>

        </div>
      </div>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

            <div className={`modal-content ${isDark ? "bg-dark text-white" : ""}`}>

              <div className="modal-header">
                <h5 className="modal-title">
                  {t.editProject}
                </h5>

                <button
                  type="button"
                  className={`btn-close ${isDark ? "btn-close-white" : ""}`}
                  onClick={() => {
                    setEditingProject(null);
                    setEditForm({});
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">

                  {Object.keys(editForm)
                    .filter((key) => key !== "id")
                    .map((key) => (

                      <div className="col-md-6 mb-3" key={key}>

                        <label className="form-label text-capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>

                        {typeof editingProject[key] === "boolean" ? (

                          <select
                            className="form-select"
                            value={String(editForm[key])}
                            onChange={(e) =>
                              handleEditChange(key, e.target.value)
                            }
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>

                        ) : (

                          <input
                            type="text"
                            className="form-control"
                            value={
                              typeof editForm[key] === "object" &&
                              editForm[key] !== null
                                ? JSON.stringify(editForm[key])
                                : String(editForm[key] ?? "")
                            }
                            onChange={(e) =>
                              handleEditChange(key, e.target.value)
                            }
                          />

                        )}

                      </div>

                    ))}

                </div>
              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingProject(null);
                    setEditForm({});
                  }}
                >
                  {t.cancel}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={updateProject}
                >
                  {t.update}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD CARDS */}
      <div className="row g-3">

        <div className="col-md-9">
          <div className="row g-3">

            {/* TOTAL ADMINS */}
            <div className="col-md-4 col-sm-6">
              <div className="card dashboard-stat-card stat-admin shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{t.totalAdmins}</h6>
                      <h2 className="stat-number">{admin.length}</h2>
                      <small>Registered Administrators</small>
                    </div>
                    <FaUserShield className="stat-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL USERS */}
            <div className="col-md-4 col-sm-6">
              <div className="card dashboard-stat-card stat-users shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{t.totalUsers}</h6>
                      <h2 className="stat-number">{user.length}</h2>
                      <small>Registered Users</small>
                    </div>
                    <FaUsers className="stat-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* NEW ENQUIRIES */}
            <div className="col-md-4 col-sm-6">
              <div className="card dashboard-stat-card stat-enquiries shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{t.newEnquiries}</h6>
                      <h2 className="stat-number">{newEnquiry.length}</h2>
                      <small>Customer Enquiries</small>
                    </div>
                    <FaEnvelopeOpenText className="stat-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* COMPANY OVERVIEW */}
            <div className="col-md-8">
              <div className="card company-overview-card shadow mb-3 overflow-hidden">

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

                    <div>
                      <span
                        className="badge mb-3"
                        style={{
                          background: "#087FC4",
                          padding: "7px 12px"
                        }}
                      >
                        COMPANY PROFILE
                      </span>

                      <h3 className="fw-bold mb-1">
                        CONVERLINK
                      </h3>

                      <h6 className="text-info mb-3">
                        ENGINEERING PVT. LTD.
                      </h6>

                      <p className="text-light mb-0">
                        {t.welcome}
                      </p>
                    </div>

                    {/* ADMIN PROFILE */}
                    <div className="text-center">

                      <div
                        className="rounded-circle overflow-hidden mx-auto shadow"
                        style={{
                          width: "90px",
                          height: "90px",
                          border: "3px solid #38C8F5",
                          background: "#087FC4"
                        }}
                      >

                        {adminProfile?.profileImage && !imageError ? (

                          <img
                            key={adminProfile.profileImage}
                            src={adminProfile.profileImage}
                            alt="Admin Profile"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />

                        ) : (

                          <div className="w-100 h-100 d-flex justify-content-center align-items-center fw-bold text-white fs-2">
                            {adminInitials}
                          </div>

                        )}

                      </div>

                      <h6 className="mt-2 mb-1 fw-bold">
                        {adminProfile?.username || "Admin"}
                      </h6>

                      <small className="text-info">
                        Administrator
                      </small>

                    </div>

                  </div>

                  <hr className="border-light opacity-25 my-4" />

                  {/* COMPANY SERVICES */}
                  <div className="row g-3">

                    <div className="col-6 col-md-3">
                      <div className="company-service-item">
                        <FaBolt className="text-info" />
                        <small>Electrical Work</small>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="company-service-item">
                        <FaTools className="text-info" />
                        <small>Maintenance</small>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="company-service-item">
                        <FaBuilding className="text-info" />
                        <small>Installation</small>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="company-service-item">
                        <FaBuilding className="text-info" />
                        <small>Interior Design</small>
                      </div>
                    </div>

                  </div>

                  {/* COMPANY FOOTER */}
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">

                    <small className="text-light">
                      Quality • Trust • Excellence
                    </small>

                    <span className="badge bg-success px-3 py-2">
                      Active Company
                    </span>

                  </div>

                </div>
              </div>
            </div>

            {/* TOTAL PROJECTS */}
            <div className="col-md-4 col-sm-6">
              <div className="card dashboard-stat-card stat-projects shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{t.totalProjects}</h6>
                      <h2 className="stat-number">{projects.length}</h2>
                      <small>Company Projects</small>
                    </div>
                    <FaProjectDiagram className="stat-icon" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE CARDS */}
        <div className="col-md-3">

          {/* PENDING PROJECTS */}
          <div
            className="card dashboard-side-card shadow mb-3"
            style={{
              background: "linear-gradient(135deg, #B45309, #F59E0B)",
              color: "white"
            }}
          >
            <div className="card-body p-4">

              <FaClock size={32} className="mb-3" />

              <h5 className="fw-bold">
                Pending Projects
              </h5>

              <h2 className="fw-bold mb-2">
                {pendingProjects}
              </h2>

              <small>
                Projects waiting for completion
              </small>

              <hr className="border-light opacity-25" />

              <span className="badge bg-light text-dark">
                Pending Work
              </span>

            </div>
          </div>

          {/* COMPLETED PROJECTS */}
          <div
            className="card dashboard-side-card shadow mb-3"
            style={{
              background: "linear-gradient(135deg, #087F5B, #20BF85)",
              color: "white"
            }}
          >
            <div className="card-body p-4">

              <FaCheckCircle size={32} className="mb-3" />

              <h5 className="fw-bold">
                Completed Projects
              </h5>

              <h2 className="fw-bold mb-2">
                {completedProjects}
              </h2>

              <small>
                Successfully completed projects
              </small>

              <hr className="border-light opacity-25" />

              <span className="badge bg-light text-success">
                Work Completed
              </span>

            </div>
          </div>

        </div>

      </div>

      {/* ADMIN TABLE */}
      <div className="row mt-3">

        <div className="col-md-12">

          <div className="card dashboard-custom-card mb-3 shadow">

            <div className="card-body">

              <h5 className="mb-3">
                {t.adminList} <FaListOl />
              </h5>

              <div className="table-responsive">

                <table className={tableClass}>

                  <thead>
                    <tr>
                      {tableHeadings.map((heading, index) => (
                        <th key={index}>{heading}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    {currentAdmins.length > 0 ? (

                      currentAdmins.map((d, index) => (

                        <tr key={d.id}>

                          <th>{adminStart + index + 1}</th>

                          <td>{d.username}</td>
                          <td>{d.email}</td>
                          <td>{d.phone}</td>
                          <td>{d.gender}</td>
                          <td>{d.role}</td>
                          <td>{d.comments}</td>

                          <td>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteAdmin(d.id)}
                              title="Delete"
                            >
                              <MdDelete />
                            </button>

                            <button
                              className="btn btn-sm btn-warning ms-2"
                              title="Edit"
                              onClick={() =>
                                toast.info("Admin edit is not connected yet")
                              }
                            >
                              <FaEdit />
                            </button>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td colSpan="8" className="text-center">
                          {t.noData}
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {renderPagination(
                adminPage,
                adminTotalPages,
                setAdminPage
              )}

            </div>
          </div>

        </div>

      </div>

      {/* USER TABLE */}
      <div className="row">

        <div className="col-md-12">

          <div className="card dashboard-custom-card mb-3 shadow">

            <div className="card-body">

              <h5 className="mb-3">
                {t.userList} <FaListOl />
              </h5>

              <div className="table-responsive">

                <table className={tableClass}>

                  <thead>
                    <tr>
                      {tableHeadings.map((heading, index) => (
                        <th key={index}>{heading}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    {currentUsers.length > 0 ? (

                      currentUsers.map((d, index) => (

                        <tr key={d.id}>

                          <th>{userStart + index + 1}</th>

                          <td>{d.username}</td>
                          <td>{d.email}</td>
                          <td>{d.phone}</td>
                          <td>{d.gender}</td>
                          <td>{d.role}</td>
                          <td>{d.comments}</td>

                          <td>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteUser(d.id)}
                              title="Delete"
                            >
                              <MdDelete />
                            </button>

                            <button
                              className="btn btn-sm btn-warning ms-2"
                              title="Edit"
                              onClick={() =>
                                toast.info("User edit is not connected yet")
                              }
                            >
                              <FaEdit />
                            </button>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td colSpan="8" className="text-center">
                          {t.noData}
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {renderPagination(
                userPage,
                userTotalPages,
                setUserPage
              )}

            </div>

          </div>

        </div>

      </div>

      {/* TOTAL PROJECTS TABLE */}
      <div className="row">

        <div className="col-12">

          <div className="card dashboard-custom-card mb-3 shadow">

            <div className="card-body">

              <h5 className="mb-3">
                {t.projectList} <FaListOl />
              </h5>

              <div className="project-table-wrapper">

                <table className={`${tableClass} project-table`}>

                  <colgroup>
                    <col style={{ width: "45px" }} />

                    {projectColumns.map((key) => (
                      <col
                        key={key}
                        style={{
                          width: `${(100 - 45 - 90) / Math.max(projectColumns.length, 1)}%`
                        }}
                      />
                    ))}

                    <col style={{ width: "90px" }} />
                  </colgroup>

                  <thead>

                    <tr>

                      <th>S.No</th>

                      {projectColumns.map((key) => (
                        <th key={key}>
                          {key.replace(/([A-Z])/g, " $1")}
                        </th>
                      ))}

                      <th>{t.action}</th>

                    </tr>

                  </thead>

                  <tbody>

                    {currentProjects.length > 0 ? (

                      currentProjects.map((project, index) => (

                        <tr key={project.id}>

                          <th>
                            {projectStart + index + 1}
                          </th>

                          {projectColumns.map((key) => (

                            <td key={key}>

                              {typeof project[key] === "object" &&
                              project[key] !== null
                                ? JSON.stringify(project[key])
                                : String(project[key] ?? "")}

                            </td>

                          ))}

                          <td>

                            <div className="project-actions">

                              <button
                                className="btn btn-sm btn-danger"
                                title="Delete Project"
                                onClick={() =>
                                  deleteProject(project.id)
                                }
                              >
                                <MdDelete />
                              </button>

                              <button
                                className="btn btn-sm btn-warning"
                                title="Edit Project"
                                onClick={() =>
                                  handleEditProject(project)
                                }
                              >
                                <FaEdit />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td
                          colSpan={projectColumns.length + 2}
                          className="text-center"
                        >
                          {t.noData}
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {renderPagination(
                projectPage,
                projectTotalPages,
                setProjectPage
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboardpage;
