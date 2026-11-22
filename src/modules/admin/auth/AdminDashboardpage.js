
import React, { useEffect, useState } from "react";
import axios from "axios";

import { MdDelete } from "react-icons/md";
import { FaEdit, FaListOl } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import { useGlobalSettings } from "../../../Context/SettingsContext";

function AdminDashboardpage() {

  const { theme, language, itemsPerPage } = useGlobalSettings();

  const isDark = theme === "dark";

  // API DATA
  const [admin, setAdmin] = useState([]);
  const [user, setUser] = useState([]);
  const [newEnquiry, setNewEnquiry] = useState([]);

  // PAGINATION
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  // ITEMS PER PAGE
  const limit = Number(itemsPerPage) || 10;

  // TRANSLATIONS
  const translations = {
    English: {
      totalAdmins: "Total Admins",
      totalUsers: "Total Users",
      newEnquiries: "New Enquiries",
      companyOverview: "Company Overview",
      welcome: "Welcome to Admin Dashboard.",
      primary: "Primary Card",
      secondary: "Secondary Card",
      cardContent: "Card content.",
      adminList: "Admin List",
      userList: "User List",
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
      noData: "No records found"
    },

    Hindi: {
      totalAdmins: "कुल एडमिन",
      totalUsers: "कुल यूजर्स",
      newEnquiries: "नई पूछताछ",
      companyOverview: "कंपनी की जानकारी",
      welcome: "एडमिन डैशबोर्ड में आपका स्वागत है।",
      primary: "प्राइमरी कार्ड",
      secondary: "सेकेंडरी कार्ड",
      cardContent: "कार्ड की जानकारी।",
      adminList: "एडमिन सूची",
      userList: "यूजर सूची",
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
      page: "पेज",
      of: "में से",
      deleteSuccess: "सफलतापूर्वक डिलीट हुआ",
      deleteError: "रिकॉर्ड डिलीट नहीं हो सका",
      noData: "कोई रिकॉर्ड नहीं मिला"
    }
  };

  const t = translations[language] || translations.English;

  // FETCH ALL DATA
  const getData = async () => {
    try {
      const [adminResponse, userResponse, enquiryResponse] =
        await Promise.all([
          axios.get("http://localhost:8700/admin"),
          axios.get("http://localhost:8700/user"),
          axios.get("http://localhost:8700/NewEnuiry")
        ]);

      setAdmin(adminResponse.data);
      setUser(userResponse.data);
      setNewEnquiry(enquiryResponse.data);

    } catch (error) {
      console.error("Dashboard API Error:", error);
      toast.error("Unable to load dashboard data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // DELETE ADMIN
  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:8700/admin/${id}`);

      toast.success(t.deleteSuccess, {
        autoClose: 2000,
        position: "top-center",
        theme: isDark ? "dark" : "light"
      });

      setAdminPage(1);
      getData();

    } catch (error) {
      toast.error(t.deleteError);
    }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8700/user/${id}`);

      toast.success(t.deleteSuccess, {
        autoClose: 2000,
        position: "top-center",
        theme: isDark ? "dark" : "light"
      });

      setUserPage(1);
      getData();

    } catch (error) {
      toast.error(t.deleteError);
    }
  };

  // PAGINATION DATA
  const adminTotalPages = Math.max(1, Math.ceil(admin.length / limit));
  const userTotalPages = Math.max(1, Math.ceil(user.length / limit));

  const adminStart = (adminPage - 1) * limit;
  const userStart = (userPage - 1) * limit;

  const currentAdmins = admin.slice(adminStart, adminStart + limit);
  const currentUsers = user.slice(userStart, userStart + limit);

  // PAGINATION BUTTONS
  const renderPagination = (currentPage, totalPages, setPage) => {

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

  // TABLE HEADER
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

  // REUSABLE TABLE CLASS
  const tableClass = isDark
    ? "table table-dark table-hover table-bordered align-middle"
    : "table table-primary table-hover table-bordered align-middle";

  return (

    <div className={`container-fluid mt-3 dashboard-page ${isDark ? "dashboard-dark" : "dashboard-light"}`}>

      <ToastContainer />

      {/* DASHBOARD CARDS */}
      <div className="row">

        <div className="col-md-9">

          <div className="row">

            {/* TOTAL ADMINS */}
            <div className="col-md-4">
              <div className="card dashboard-stat-card bg-primary text-white mb-3 shadow">
                <div className="card-body">
                  <h5>{t.totalAdmins}</h5>
                  <p className="h1 mb-0">{admin.length}</p>
                </div>
              </div>
            </div>

            {/* TOTAL USERS */}
            <div className="col-md-4">
              <div className="card dashboard-stat-card bg-success text-white mb-3 shadow">
                <div className="card-body">
                  <h5>{t.totalUsers}</h5>
                  <p className="h1 mb-0">{user.length}</p>
                </div>
              </div>
            </div>

            {/* NEW ENQUIRIES */}
            <div className="col-md-4">
              <div className="card dashboard-stat-card bg-danger text-white mb-3 shadow">
                <div className="card-body">
                  <h5>{t.newEnquiries}</h5>
                  <p className="h1 mb-0">{newEnquiry.length}</p>
                </div>
              </div>
            </div>

            {/* COMPANY OVERVIEW */}
            <div className="col-md-8">
              <div className="card dashboard-custom-card mb-3 shadow">
                <div className="card-body">
                  <h5>{t.companyOverview}</h5>
                  <p className="mb-0">{t.welcome}</p>
                </div>
              </div>
            </div>

            {/* ENQUIRY CARD */}
            <div className="col-md-4">
              <div className="card dashboard-stat-card bg-warning text-dark mb-3 shadow">
                <div className="card-body">
                  <h5>{t.newEnquiries}</h5>
                  <p className="h1 mb-0">{newEnquiry.length}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE CARDS */}
        <div className="col-md-3">

          <div className="card dashboard-custom-card mb-3 shadow">
            <div className="card-body">
              <h5>{t.primary}</h5>
              <p>{t.cardContent}</p>
            </div>
          </div>

          <div className="card dashboard-custom-card mb-3 shadow">
            <div className="card-body">
              <h5>{t.secondary}</h5>
              <p>{t.cardContent}</p>
            </div>
          </div>

        </div>

      </div>

      {/* ADMIN TABLE */}
      <div className="row">

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
                              onClick={() => toast.info("Edit feature is not connected yet")}
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

              {renderPagination(adminPage, adminTotalPages, setAdminPage)}

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
                              onClick={() => toast.info("Edit feature is not connected yet")}
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

              {renderPagination(userPage, userTotalPages, setUserPage)}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboardpage;
