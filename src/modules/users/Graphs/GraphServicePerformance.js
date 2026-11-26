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

import servicePerformance from "../Userdashboard/Data/DashboardData/ServicePerformanceData";

function GraphServicePerformance() {

  return (
    <div className="container-fluid py-4">

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <h4 className="fw-bold">Service Performance</h4>

          <p className="">
            Service-wise project performance
          </p>

          <div style={{ width: "100%", height: "400px" }}>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={servicePerformance}
                margin={{ top: 20, right: 20, left:10, bottom: 20 }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="service"
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="completed"
                  fill="#087FC4"
                  name="Completed"
                />

                <Bar
                  dataKey="pending"
                  fill="#FFC107"
                  name="Pending"
                />

                <Bar
                  dataKey="inProgress"
                  fill="#38C8F5"
                  name="In Progress"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>
      </div>

    </div>
  );
}

export default GraphServicePerformance;