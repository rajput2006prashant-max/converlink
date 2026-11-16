import React from "react";
import { Link } from "react-router-dom";
import Graphmonthly from "../../../modules/users/Graphs/Graphmonthly";
import GraphServicePerformance from "../../../modules/users/Graphs/GraphServicePerformance";
import GraphProjectStatus from "../../../modules/users/Graphs/GraphProjectStatus";
import GraphRecentProject from "../../../modules/users/Graphs/GraphRecentProject";
import recentProjectData from "./Data/DashboardData/RecentProjectData";

function UserDashboardPage() {



  const totalProjects = recentProjectData.length;

const pendingProjects = recentProjectData.filter(
  (project) => project.status === "Pending"
).length;

const inProgressProjects = recentProjectData.filter(
  (project) => project.status === "In Progress"
).length;

const completedProjects = recentProjectData.filter(
  (project) => project.status === "Completed"
).length;
  return (
    <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">

      {/* Dashboard Heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">User Dashboard</h3>
          <p className="text-muted mb-0">
            Welcome back! Here is your project overview.
          </p>
        </div>

        <button className="btn btn-primary mt-3 mt-md-0">
         <Link to="newenquiry" className="sidebar-link">
                  New Enquiry
                </Link>
        </button>
      </div>

      {/* Summary Boxes */}
     <div className="row g-4 mb-4">

  <div className="col-md-6 col-lg-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h6 className="text-muted">Total Projects</h6>
        <h2 className="fw-bold">{totalProjects}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-6 col-lg-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h6 className="text-muted">Pending Projects</h6>
        <h2 className="fw-bold">{pendingProjects}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-6 col-lg-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h6 className="text-muted">In Progress</h6>
        <h2 className="fw-bold">{inProgressProjects}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-6 col-lg-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h6 className="text-muted">Completed</h6>
        <h2 className="fw-bold">{completedProjects}</h2>
      </div>
    </div>
  </div>

</div>

      {/* Graph Layout */}
      <div className="row g-4 mb-4">

        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
             <Graphmonthly/>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
            <GraphProjectStatus/>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="row g-4">

        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
               <div className="table-responsive">
             
                   <GraphRecentProject/>
               
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
             <GraphServicePerformance/>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default UserDashboardPage;