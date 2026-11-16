import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import dashboardData from "../Userdashboard/Data/DashboardData/MonthlyProjectData";

function Graphmonthly() {
  return (
    <div className="container-fluid py-4">

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <h4 className="fw-bold">
            Monthly Projects
          </h4>

          <p className="text-muted">
            Converlink monthly project performance
          </p>

          <div style={{ width: "100%", height: "400px" }}>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={dashboardData.monthlyProjects}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="projects"
                  fill="#087FC4"
                  name="Total Projects"
                />

                <Bar
                  dataKey="completed"
                  fill="#198754"
                  name="Completed Projects"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Graphmonthly;