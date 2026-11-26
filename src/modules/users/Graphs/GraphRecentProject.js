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

import recentProjectData from "../Userdashboard/Data/DashboardData/RecentProjectData";

function GraphRecentProject() {

  return (
    <div className="container-fluid py-4">

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <h4 className="fw-bold">Recent Projects</h4>

          <p className="">
            Latest project progress overview
          </p>

          <div style={{ width: "100%", height: "400px" }}>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={recentProjectData}
                margin={{ top: 20, right: 20, left: 10, bottom: 50 }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="projectName"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={90}
                />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="progress"
                  fill="#087FC4"
                  name="Project Progress (%)"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>
      </div>

    </div>
  );
}

export default GraphRecentProject;