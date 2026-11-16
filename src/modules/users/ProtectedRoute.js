// import React, { createContext, useContext, useEffect, useState } from "react";

// const ProjectContext = createContext();

// const initialData = {
//   enquiries: [
//     {
//       id: 1,
//       clientName: "Rahul Sharma",
//       service: "Electrical Work",
//       date: "13 Nov 2026",
//       location: "Delhi",
//       budget: "₹25,000"
//     },
//     {
//       id: 2,
//       clientName: "Amit Verma",
//       service: "Interior Designing",
//       date: "12 Nov 2026",
//       location: "Noida",
//       budget: "₹50,000"
//     },
//     {
//       id: 3,
//       clientName: "Priya Singh",
//       service: "Maintenance",
//       date: "11 Nov 2026",
//       location: "Moradabad",
//       budget: "₹15,000"
//     },
//     {
//       id: 4,
//       clientName: "Vikas Kumar",
//       service: "Installation",
//       date: "10 Nov 2026",
//       location: "Ghaziabad",
//       budget: "₹12,000"
//     }
//   ],

//   projects: [
//     {
//       id: 101,
//       clientName: "Suresh Kumar",
//       name: "Office Electrical Work",
//       service: "Electrical Work",
//       date: "05 Nov 2026",
//       status: "Completed",
//       amount: "₹25,000"
//     },
//     {
//       id: 102,
//       clientName: "ABC Company",
//       name: "Office Maintenance",
//       service: "Maintenance",
//       date: "02 Nov 2026",
//       status: "In Progress",
//       amount: "₹15,000"
//     }
//   ]
// };

// export function ProjectProvider({ children }) {

//   const [data, setData] = useState(() => {
//     try {
//       const savedData = localStorage.getItem("converlinkProjectData");
//       return savedData ? JSON.parse(savedData) : initialData;
//     } catch {
//       return initialData;
//     }
//   });
//   const cancelProject = (id) => {
//   setData((previousData) => ({
//     ...previousData,
//     projects: previousData.projects.map((project) =>
//       project.id === id
//         ? { ...project, status: "Cancelled" }
//         : project
//     )
//   }));
// };

//   // Data ko browser mein save karna
//   useEffect(() => {
//     localStorage.setItem("converlinkProjectData", JSON.stringify(data));
//   }, [data]);

//   // Enquiry approve karke Project mein add karna
//   const approveEnquiry = (id) => {

//     setData((previousData) => {

//       const enquiry = previousData.enquiries.find(
//         (item) => item.id === id
//       );

//       if (!enquiry) return previousData;

//       const newProject = {
//         id: Date.now(),
//         clientName: enquiry.clientName,
//         name: `${enquiry.clientName} - ${enquiry.service}`,
//         service: enquiry.service,
//         date: enquiry.date,
//         status: "Pending",
//         amount: enquiry.budget
//       };

//       return {
//         enquiries: previousData.enquiries.filter(
//           (item) => item.id !== id
//         ),
//         projects: [...previousData.projects, newProject]
//       };
//     });
//   };

//   return (
//     <ProjectContext.Provider
//       value={{
//         enquiries: data.enquiries,
//         projects: data.projects,
//         approveEnquiry,
//           cancelProject
//       }}
//     >
//       {children}
//     </ProjectContext.Provider>
//   );
// }

// export function useProjects() {
//   return useContext(ProjectContext);
// }


import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
        return <Navigate to="/UserLoginPage" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
