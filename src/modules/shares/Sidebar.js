// import React from "react";
// import { Link } from "react-router-dom";

// function Sidebar() {
//   return (
//     <div
//       className="d-flex flex-column p-3 text-white vh-100"
//    style={{
//     width: "260px",
//     backgroundColor: "#102D4F",
//     position: "fixed",
//     top: 84,
//     left: 0,
//     height: "100vh",
//     color: "white",
//     overflowY: "auto",
//     zIndex: 1000
//   }}
//     >
//       <h4 className="mb-4 border-bottom pb-3">
//         <i className="bi bi-building text-info me-2"></i>
//         CONVERLINK
//       </h4>

//       <p className="text-info fw-bold small">MAIN MENU</p>

//       <nav className="nav nav-pills flex-column gap-2">

//         <Link to="home" className="nav-link text-white">
//           <i className="bi bi-house me-2"></i> Home
//         </Link>

//           <Link to="about" className="nav-link text-white">
//           <i className="bi bi-tools me-2"></i> About
//         </Link>

//         <Link to="services" className="nav-link text-white">
//           <i className="bi bi-tools me-2"></i> Services
//         </Link>

//         <Link to="project" className="nav-link text-white">
//           <i className="bi bi-building me-2"></i> Projects
//         </Link>

//         <Link to="enquiries" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i> Enquiries
//         </Link>

//  <Link to="contact" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i> Contact
//         </Link>

// <Link to="/landing" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i> Dashboard
//         </Link>

//              <Link to="profile" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i> My Profile
//         </Link>

//         <Link to="setting" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i> Setitings
//         </Link>

//   <Link to="/" className="nav-link text-white">
//           <i className="bi bi-envelope me-2"></i>Logout
//         </Link>

//       </nav>

//       <div className="mt-auto border-top pt-3">
//         <Link to="/login" className="nav-link text-danger">
//           <i className="bi bi-box-arrow-right me-2"></i>
//           Logout
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;





import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="flex-shrink-0 p-3 text-white"
      style={{
        width: "262px",
        height: "110vh",
        position: "fixed",
        top: "82px",
        left: "",
        
        backgroundColor: "#102D4F",
        overflowY: "auto",
        zIndex: "1000"
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="d-flex align-items-center pb-3 mb-3 text-white text-decoration-none border-bottom border-secondary"
      >
        <span className="fs-5 fw-bold">CONVERLINK</span>
      </Link>

      <ul className="list-unstyled ps-0">

        {/* Home */}
        <li className="mb-2">
          <button
            className="btn btn-toggle text-white w-100 text-start"
            data-bs-toggle="collapse"
            data-bs-target="#home-collapse"
            aria-expanded="true"
          >
            Home
          </button>

          <div className="collapse show" id="home-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
              <li><Link to="/" className="sidebar-link">Overview</Link></li>
              <li><Link to="about" className="sidebar-link">About </Link></li>
              <li><Link to="contact" className="sidebar-link">Contact Us</Link></li>
            </ul>
          </div>
        </li>

        {/* Dashboard */}
        <li className="mb-2">
          <button
            className="btn btn-toggle text-white w-100 text-start collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#dashboard-collapse"
            aria-expanded="false"
          >
            Dashboard
          </button>

          <div className="collapse" id="dashboard-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
              <li><Link to="/landing" className="sidebar-link">Overview</Link></li>
              <li><Link to="services" className="sidebar-link">Explore Services</Link></li>
              <li><Link to="project" className="sidebar-link">My Projects</Link></li>
              <li><Link to="*" className="sidebar-link">Recent Activity</Link></li>
            </ul>
          </div>
        </li>

        {/* Orders */}
        <li className="mb-2">
          <button
            className="btn btn-toggle text-white w-100 text-start collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#orders-collapse"
            aria-expanded="false"
          >
            Orders
          </button>

          <div className="collapse" id="orders-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
              <li><Link to="*" className="sidebar-link">New Enquiry</Link></li>
              <li><Link to="*" className="sidebar-link">Pending Orders</Link></li>
              <li><Link to="*" className="sidebar-link">In Progress</Link></li>
              <li><Link to="*" className="sidebar-link">Completed Orders</Link></li>
                  <li><Link to="*" className="sidebar-link">Cancelled Orders</Link></li>
            </ul>
          </div>
        </li>

        {/* Account */}
        <li className="mb-2">
          <button
            className="btn btn-toggle text-white w-100 text-start collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded="false"
          >
            Account
          </button>

          <div className="collapse" id="account-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
              <li><Link to="profile" className="sidebar-link">My Profile</Link></li>
              <li><Link to="message" className="sidebar-link">My Messages</Link></li>
              <li><Link to="notification" className="sidebar-link">Notifications</Link></li>
              <li><Link to="setting" className="sidebar-link">Settings</Link></li>
              <li><Link to="/" className="sidebar-link">Logout</Link></li>
            </ul>
          </div>
        </li>

      </ul>
    </div>
  );
}

