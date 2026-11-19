
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const BASE_URL = "http://localhost:8700";

// Chart colors
const COLORS = [
  "#087FC4",
  "#38C8F5",
  "#198754",
  "#dc3545"
];

// Date filtering function
const filterByDate = (data, fromDate, toDate, dateField) => {
  return data.filter((item) => {
    const date = item[dateField];

    if (!date) {
      return !fromDate && !toDate;
    }

    const itemDate = String(date).slice(0, 10);

    if (fromDate && itemDate < fromDate) return false;
    if (toDate && itemDate > toDate) return false;

    return true;
  });
};

// Currency format
const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

function Reports() {

  // States
  const [enquiries, setEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch all report data
  const fetchReports = useCallback(async () => {

    try {
      setLoading(true);
      setError("");

      const [
        enquiryRes,
        projectRes,
        orderRes,
        quotationRes,
        invoiceRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/NewEnuiry`),
        axios.get(`${BASE_URL}/totalproject`),
        axios.get(`${BASE_URL}/orders`),
        axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/invoices`)
      ]);

      setEnquiries(enquiryRes.data);
      setProjects(projectRes.data);
      setOrders(orderRes.data);
      setQuotations(quotationRes.data);
      setInvoices(invoiceRes.data);

    } catch (err) {

      console.error("Reports Error:", err);

      setError(
        "Reports data load nahi hua. JSON Server aur collections check karo."
      );

    } finally {
      setLoading(false);
    }

  }, []);

  // useEffect
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Date filtering
  const filteredEnquiries = useMemo(
    () =>
      filterByDate(
        enquiries,
        fromDate,
        toDate,
        "date"
      ),
    [enquiries, fromDate, toDate]
  );

  const filteredProjects = useMemo(
    () =>
      filterByDate(
        projects,
        fromDate,
        toDate,
        "date"
      ),
    [projects, fromDate, toDate]
  );

  const filteredOrders = useMemo(
    () =>
      filterByDate(
        orders,
        fromDate,
        toDate,
        "orderDate"
      ),
    [orders, fromDate, toDate]
  );

  const filteredQuotations = useMemo(
    () =>
      filterByDate(
        quotations,
        fromDate,
        toDate,
        "validUntil"
      ),
    [quotations, fromDate, toDate]
  );

  const filteredInvoices = useMemo(
    () =>
      filterByDate(
        invoices,
        fromDate,
        toDate,
        "invoiceDate"
      ),
    [invoices, fromDate, toDate]
  );

  // Revenue calculation
  const totalRevenue = filteredInvoices
    .filter((item) => item.status === "Paid")
    .reduce(
      (sum, item) =>
        sum + Number(item.totalAmount || 0),
      0
    );

  // Pending payments
  const pendingPayments = filteredInvoices
    .filter((item) =>
      ["Sent", "Overdue"].includes(item.status)
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.totalAmount || 0),
      0
    );

  // Project status chart
  const projectStatusData = useMemo(() => {

    const statuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled"
    ];

    return statuses.map((status) => ({
      name: status,

      value: filteredProjects.filter(
        (item) =>
          (item.status || "Pending").toLowerCase() ===
          status.toLowerCase()
      ).length
    }));

  }, [filteredProjects]);

  // Enquiry status chart
  const enquiryStatusData = useMemo(() => {

    const statuses = [
      "New",
      "Approved"
    ];

    return statuses.map((status) => ({
      name: status,

      value: filteredEnquiries.filter(
        (item) =>
          (item.status || "New").toLowerCase() ===
          status.toLowerCase()
      ).length
    }));

  }, [filteredEnquiries]);

  // Monthly revenue
  const monthlyRevenue = useMemo(() => {

    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {

      const amount = filteredInvoices
        .filter((invoice) => {

          if (
            invoice.status !== "Paid" ||
            !invoice.invoiceDate
          ) {
            return false;
          }

          const date = new Date(invoice.invoiceDate);

          return (
            date.getMonth() === index &&
            date.getFullYear() === currentYear
          );

        })
        .reduce(
          (sum, invoice) =>
            sum + Number(invoice.totalAmount || 0),
          0
        );

      return {
        month,
        revenue: amount
      };

    });

  }, [filteredInvoices]);

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Loading screen
  if (loading) {
    return (
      <div className="container-fluid p-4 text-center">

        <div className="spinner-border text-primary"></div>

        <p className="mt-2 text-secondary">
          Loading reports...
        </p>

      </div>
    );
  }

  return (

    <div className="container-fluid p-3 p-md-4">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 report-header">

        <div>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#102D4F" }}
          >
            Business Reports
          </h3>

          <p className="text-secondary mb-0">
            Complete company performance and analytics
          </p>
        </div>

        <div className="d-flex gap-2">

          <button
            className="btn btn-outline-primary"
            onClick={fetchReports}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>

          <button
            className="btn text-white"
            style={{ backgroundColor: "#087FC4" }}
            onClick={handlePrint}
          >
            <i className="bi bi-printer me-1"></i>
            Print Report
          </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Date Filter */}
      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3 align-items-end">

            <div className="col-md-4">

              <label className="form-label fw-semibold">
                From Date
              </label>

              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <label className="form-label fw-semibold">
                To Date
              </label>

              <input
                type="date"
                className="form-control"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear Date Filter
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        {[
          {
            title: "Total Enquiries",
            value: filteredEnquiries.length,
            icon: "bi-chat-left-text",
            color: "#087FC4"
          },
          {
            title: "Total Projects",
            value: filteredProjects.length,
            icon: "bi-building",
            color: "#198754"
          },
          {
            title: "Total Orders",
            value: filteredOrders.length,
            icon: "bi-cart-check",
            color: "#6f42c1"
          },
          {
            title: "Total Quotations",
            value: filteredQuotations.length,
            icon: "bi-file-earmark-text",
            color: "#fd7e14"
          },
          {
            title: "Total Invoices",
            value: filteredInvoices.length,
            icon: "bi-receipt",
            color: "#0dcaf0"
          },
          {
            title: "Paid Revenue",
            value: formatAmount(totalRevenue),
            icon: "bi-currency-rupee",
            color: "#198754"
          }

        ].map((card, index) => (

          <div
            className="col-sm-6 col-xl-4"
            key={index}
          >

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-secondary mb-2">
                    {card.title}
                  </p>

                  <h4 className="fw-bold mb-0">
                    {card.value}
                  </h4>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: `${card.color}18`,
                    color: card.color,
                    fontSize: "22px"
                  }}
                >
                  <i className={`bi ${card.icon}`}></i>
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Payment Summary */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <p className="text-secondary mb-2">
                Total Paid Revenue
              </p>

              <h3 className="fw-bold text-success">
                {formatAmount(totalRevenue)}
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <p className="text-secondary mb-2">
                Pending Payment Value
              </p>

              <h3 className="fw-bold text-warning">
                {formatAmount(pendingPayments)}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">

        {/* Project Status */}
        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Project Status
              </h5>

              {filteredProjects.length > 0 ? (

                <div style={{ width: "100%", height: 300 }}>

                  <ResponsiveContainer>

                    <PieChart>

                      <Pie
                        data={projectStatusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >

                        {projectStatusData.map(
                          (entry, index) => (

                            <Cell
                              key={entry.name}
                              fill={COLORS[index % COLORS.length]}
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip />
                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <p className="text-center text-secondary py-5">
                  No project data available
                </p>

              )}

            </div>

          </div>

        </div>

        {/* Enquiry Status */}
        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Enquiry Status
              </h5>

              {filteredEnquiries.length > 0 ? (

                <div style={{ width: "100%", height: 300 }}>

                  <ResponsiveContainer>

                    <PieChart>

                      <Pie
                        data={enquiryStatusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >

                        {enquiryStatusData.map(
                          (entry, index) => (

                            <Cell
                              key={entry.name}
                              fill={COLORS[index % COLORS.length]}
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip />
                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <p className="text-center text-secondary py-5">
                  No enquiry data available
                </p>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* Monthly Revenue */}
      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Monthly Revenue - {new Date().getFullYear()}
          </h5>

          <div style={{ width: "100%", height: 350 }}>

            <ResponsiveContainer>

              <BarChart data={monthlyRevenue}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatAmount(value)
                  }
                />

                <Bar
                  dataKey="revenue"
                  fill="#087FC4"
                  name="Paid Revenue"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Invoice Payment Report */}
      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <h5 className="fw-bold mb-3">
            Invoice Payment Report
          </h5>

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">

                <tr>
                  <th>S.No.</th>
                  <th>Invoice No.</th>
                  <th>Client</th>
                  <th>Invoice Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredInvoices.length > 0 ? (

                  filteredInvoices.map((invoice, index) => (

                    <tr key={invoice.id || index}>

                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {invoice.invoiceNo || "-"}
                      </td>

                      <td>
                        {invoice.clientName || "-"}
                      </td>

                      <td>
                        {invoice.invoiceDate || "-"}
                      </td>

                      <td>
                        {formatAmount(invoice.totalAmount)}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            invoice.status === "Paid"
                              ? "bg-success"
                              : invoice.status === "Overdue"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {invoice.status || "Draft"}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center text-secondary py-4"
                    >
                      No invoice records found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* Print CSS */}
      <style>{`

        @media print {

          body {
            background: white !important;
          }

          .report-header button {
            display: none !important;
          }

          .report-header {
            margin-bottom: 20px !important;
          }

          .card {
            box-shadow: none !important;
            break-inside: avoid;
          }

          .container-fluid {
            padding: 0 !important;
          }

          button {
            display: none !important;
          }

        }

      `}</style>

    </div>

  );

}

export default Reports;
