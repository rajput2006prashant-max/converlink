import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import projectStatusData from "../Userdashboard/Data/DashboardData/ProjectStatusData.js";
function GraphProjectStatus() {

  const COLORS = [
    "#FFC107",
    "#38C8F5",
    "#198754",
    "#DC3545"
  ];

  return (
    <div className="container-fluid py-4">

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <h4 className="fw-bold">Project Status</h4>

          <p className="">
            Overview of all project statuses
          </p>

          <div style={{ width: "100%", height: "350px" }}>

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={projectStatusData}
                  dataKey="projects"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {projectStatusData.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default GraphProjectStatus;