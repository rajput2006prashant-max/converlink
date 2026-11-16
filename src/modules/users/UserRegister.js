
// import React, { Fragment } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function AdminRegister() {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const password = watch("adminPassword");

//   const myform = (data) => {
//     const admins = JSON.parse(
//       localStorage.getItem("admins") || "[]"
//     );

//     const email = data.adminEmail.trim().toLowerCase();
//     const adminId = data.adminId.trim();

//     const alreadyExists = admins.some(
//       (admin) =>
//         admin.adminEmail === email ||
//         admin.adminId === adminId
//     );

//     if (alreadyExists) {
//       toast.error("Email or Admin ID already registered!");
//       return;
//     }

//     const newAdmin = {
//       adminName: data.adminName.trim(),
//       adminEmail: email,
//       adminId,
//       adminPassword: data.adminPassword,
//     };

//     admins.push(newAdmin);

//     localStorage.setItem("admins", JSON.stringify(admins));

//     toast.success("Admin registration successful!", {
//       autoClose: 1500,
//       onClose: () => navigate("/admin-login"),
//     });
//   };

//   return (
//     <Fragment>
//       <ToastContainer position="top-right" />

//       <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
//         <div
//           className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
//           style={{ maxWidth: "1000px" }}
//         >
//           <div className="row g-0">
//             {/* Left Section */}
//             <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
//               <h1 className="fw-bold mb-3">
//                 Admin Registration
//               </h1>

//               <p className="fs-5">
//                 Welcome to Converlink Engineering.
//               </p>

//               <p className="text-white-50">
//                 Register your administrator account to manage company
//                 services, enquiries, and website information.
//               </p>

//               <div className="mt-4">
//                 <span className="badge bg-white text-dark rounded-pill p-3">
//                   Secure Admin Access
//                 </span>
//               </div>

//               <div className="mt-5">
//                 <p className="fw-semibold">Admin Responsibilities</p>

//                 <ul className="list-unstyled text-white-50">
//                   <li className="mb-2">✓ Manage enquiries</li>
//                   <li className="mb-2">✓ Manage company services</li>
//                   <li>✓ Update website information</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Right Section */}
//             <div className="col-md-7 p-4 p-lg-5">
//               <h2 className="fw-bold text-dark mb-2">
//                 Create Admin Account
//               </h2>

//               <p className="text-secondary mb-4">
//                 Enter your details to register.
//               </p>

//               <form onSubmit={handleSubmit(myform)}>
//                 {/* Full Name */}
//                 <div className="mb-3">
//                   <label htmlFor="adminName" className="form-label fw-semibold">
//                     Full Name
//                   </label>

//                   <input
//                     id="adminName"
//                     type="text"
//                     className="form-control form-control-lg rounded-3"
//                     placeholder="Enter admin name"
//                     autoComplete="name"
//                     {...register("adminName", {
//                       required: "Full name is required",
//                     })}
//                   />

//                   {errors.adminName && (
//                     <p className="text-danger small mt-1">
//                       {errors.adminName.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="mb-3">
//                   <label htmlFor="adminEmail" className="form-label fw-semibold">
//                     Official Email
//                   </label>

//                   <input
//                     id="adminEmail"
//                     type="email"
//                     className="form-control form-control-lg rounded-3"
//                     placeholder="Enter official email"
//                     autoComplete="email"
//                     {...register("adminEmail", {
//                       required: "Email is required",
//                     })}
//                   />

//                   {errors.adminEmail && (
//                     <p className="text-danger small mt-1">
//                       {errors.adminEmail.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Admin ID */}
//                 <div className="mb-3">
//                   <label htmlFor="adminId" className="form-label fw-semibold">
//                     Admin ID
//                   </label>

//                   <input
//                     id="adminId"
//                     type="text"
//                     className="form-control form-control-lg rounded-3"
//                     placeholder="Enter admin ID"
//                     {...register("adminId", {
//                       required: "Admin ID is required",
//                     })}
//                   />

//                   {errors.adminId && (
//                     <p className="text-danger small mt-1">
//                       {errors.adminId.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="mb-3">
//                   <label
//                     htmlFor="adminPassword"
//                     className="form-label fw-semibold"
//                   >
//                     Password
//                   </label>

//                   <input
//                     id="adminPassword"
//                     type="password"
//                     className="form-control form-control-lg rounded-3"
//                     placeholder="Create password"
//                     autoComplete="new-password"
//                     {...register("adminPassword", {
//                       required: "Password is required",
//                       minLength: {
//                         value: 6,
//                         message: "Password must be at least 6 characters",
//                       },
//                     })}
//                   />

//                   {errors.adminPassword && (
//                     <p className="text-danger small mt-1">
//                       {errors.adminPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="mb-4">
//                   <label
//                     htmlFor="confirmPassword"
//                     className="form-label fw-semibold"
//                   >
//                     Confirm Password
//                   </label>

//                   <input
//                     id="confirmPassword"
//                     type="password"
//                     className="form-control form-control-lg rounded-3"
//                     placeholder="Confirm password"
//                     autoComplete="new-password"
//                     {...register("confirmPassword", {
//                       required: "Please confirm your password",
//                       validate: (value) =>
//                         value === password || "Passwords do not match",
//                     })}
//                   />

//                   {errors.confirmPassword && (
//                     <p className="text-danger small mt-1">
//                       {errors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
//                 >
//                   Register Admin
//                 </button>
//               </form>

//               <p className="text-center text-secondary mt-4 mb-0">
//                 Already registered?{" "}
//                 <Link
//                   to="/admin-login"
//                   className="text-primary fw-semibold text-decoration-none"
//                 >
//                   Admin Login
//                 </Link>
//               </p>

//               <div className="text-center mt-3">
//                 <Link
//                   to="/"
//                   className="text-secondary text-decoration-none small"
//                 >
//                   ← Back to Home
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// }

// export default AdminRegister;

import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserRegistor() {

  const xyz = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const myform = async (p) => {

    try {

      // Check duplicate email
      const response = await axios.get(
        "http://localhost:8700/user"
      );

      const alreadyExists = response.data.some(
        (item) =>
          item.email.toLowerCase() === p.email.trim().toLowerCase()
      );

      if (alreadyExists) {
        toast.error("Email already registered!");
        return;
      }

      // Save registration data
      await axios.post("http://localhost:8700/user", {
        username: p.username.trim(),
        email: p.email.trim().toLowerCase(),
        pass: p.pass,
        phone: p.phone,
        gender: p.gender,
        role: p.role,
        comments: p.comments,
      });

      toast.success("Registration Successful!", {
        theme: "dark",
        autoClose: 1000,
        position: "top-right",
      });

      setTimeout(() => {
        xyz("/user-login");
      }, 1200);

    } catch (error) {

      console.log(error);

      toast.error("Registration failed! Check JSON Server.");

    }

  };

  return (

    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">

      <ToastContainer />

      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "1000px", width: "100%" }}
      >

        <div className="row g-0">

          {/* Left Section */}
          <div className="col-md-4 bg-primary text-white p-4 p-lg-5 d-flex flex-column justify-content-center">

            <h1 className="fw-bold mb-3">
            User Registration
            </h1>

            <p className="mb-4">
              Create your account and become part of our community.
            </p>

            <div className="bg-white bg-opacity-10 rounded-3 p-3">

              <h5 className="fw-semibold">
                Create Account
              </h5>

              <p className="small mb-0">
                Fill in your details to get started with us.
              </p>

            </div>

          </div>

          {/* Registration Form */}
          <div className="col-md-8 p-4 p-lg-5">

            <h2 className="fw-bold mb-2">
              Registration
            </h2>

            <p className="text-secondary mb-4">
              Please fill in the information below.
            </p>

            <form onSubmit={handleSubmit(myform)}>

              <div className="row">

                {/* Username */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />

                  {errors.username && (
                    <p className="text-danger small">
                      {errors.username.message}
                    </p>
                  )}

                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                  {errors.email && (
                    <p className="text-danger small">
                      {errors.email.message}
                    </p>
                  )}

                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    {...register("pass", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    })}
                  />

                  {errors.pass && (
                    <p className="text-danger small">
                      {errors.pass.message}
                    </p>
                  )}

                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter phone number"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                  />

                  {errors.phone && (
                    <p className="text-danger small">
                      {errors.phone.message}
                    </p>
                  )}

                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Gender
                  </label>

                  <select
                    className="form-select"
                    defaultValue=""
                    {...register("gender", {
                      required: "Please select gender",
                    })}
                  >

                    <option value="" disabled>
                      Select gender
                    </option>

                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>

                  </select>

                  {errors.gender && (
                    <p className="text-danger small">
                      {errors.gender.message}
                    </p>
                  )}

                </div>

                {/* Role */}
                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Role
                  </label>

                  <select
                    className="form-select"
                    defaultValue=""
                    {...register("role", {
                      required: "Please select role",
                    })}
                  >

                    <option value="" disabled>
                      Select role
                    </option>

                    <option value="user">User</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
               

                  </select>

                  {errors.role && (
                    <p className="text-danger small">
                      {errors.role.message}
                    </p>
                  )}

                </div>

                {/* Comments */}
                <div className="col-12 mb-4">

                  <label className="form-label fw-semibold">
                    Comments
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your comments here..."
                    {...register("comments")}
                  />

                </div>

                {/* Submit Button */}
                <div className="col-12">

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Create Account
                  </button>

                </div>

              </div>

            </form>

            <p className="text-center text-secondary mt-4 mb-0">

              Already have an account?{" "}

              <Link
                to="/admin-login"
                className="text-primary fw-semibold text-decoration-none"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default UserRegistor;







