import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8700/messages";

function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Messages fetch
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setMessages(response.data);
      setError("");
    } catch (err) {
      setError("Messages load nahi ho rahe. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Message open aur read mark
  const openMessage = async (message) => {
    setSelectedMessage(message);
    setReply(message.reply || "");

    if (message.status === "Unread") {
      try {
        await axios.patch(`${API_URL}/${message.id}`, {
          status: "Read"
        });
        fetchMessages();
      } catch (err) {
        alert("Message status update nahi hua.");
      }
    }
  };

  // Reply save
  const handleReply = async (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      alert("Please reply message likho.");
      return;
    }

    try {
      await axios.patch(`${API_URL}/${selectedMessage.id}`, {
        reply: reply.trim(),
        replyDate: new Date().toISOString(),
        status: "Replied"
      });

      alert("Reply successfully save ho gaya!");

      setSelectedMessage(null);
      setReply("");
      fetchMessages();
    } catch (err) {
      alert("Reply save nahi hua.");
    }
  };

  // Unread mark
  const markUnread = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}`, {
        status: "Unread"
      });
      fetchMessages();
    } catch (err) {
      alert("Status update nahi hua.");
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is message ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      fetchMessages();
    } catch (err) {
      alert("Message delete nahi hua.");
    }
  };

  // Search
  const filteredMessages = messages.filter((item) =>
    [
      item.senderName,
      item.email,
      item.subject,
      item.message
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(
    (item) => item.status === "Unread"
  ).length;

  const repliedCount = messages.filter(
    (item) => item.status === "Replied"
  ).length;

  const statusBadge = (status) => {
    if (status === "Replied") return "success";
    if (status === "Unread") return "warning";
    return "primary";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Manage Messages
          </h3>
          <p className="text-muted mb-0">
            Manage customer messages and replies
          </p>
        </div>

        <button
          className="btn text-white"
          style={{ backgroundColor: "#087FC4" }}
          onClick={fetchMessages}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Messages</p>
              <h3 className="fw-bold" style={{ color: "#102D4F" }}>
                {messages.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Unread Messages</p>
              <h3 className="fw-bold text-warning">
                {unreadCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Replied Messages</p>
              <h3 className="fw-bold text-success">
                {repliedCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h5 className="fw-bold mb-0" style={{ color: "#102D4F" }}>
              Inbox
            </h5>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "300px" }}
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {loading ? (
            <p className="text-center py-4">Loading messages...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((item, index) => (
                      <tr
                        key={item.id}
                        className={item.status === "Unread" ? "fw-semibold" : ""}
                      >
                        <td>{index + 1}</td>

                        <td>
                          <div>{item.senderName}</div>
                          <small className="text-muted">
                            {item.email}
                          </small>
                        </td>

                        <td>{item.subject}</td>

                        <td style={{ maxWidth: "220px" }}>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: "200px" }}>
                            {item.message}
                          </span>
                        </td>

                        <td>{formatDate(item.date)}</td>

                        <td>
                          <span className={`badge text-bg-${statusBadge(item.status)}`}>
                            {item.status || "Read"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openMessage(item)}
                            >
                              View
                            </button>

                            <button
                              className="btn btn-sm btn-outline-warning"
                              title="Mark unread"
                              onClick={() => markUnread(item.id)}
                            >
                              Unread
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteMessage(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No messages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Details and Reply Modal */}
      {selectedMessage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 2000
          }}
        >
          <div
            className="card border-0 shadow-lg w-100"
            style={{ maxWidth: "650px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div
              className="card-header text-white d-flex justify-content-between align-items-center py-3"
              style={{ backgroundColor: "#102D4F" }}
            >
              <h5 className="mb-0">Message Details</h5>

              <button
                className="btn-close btn-close-white"
                onClick={() => setSelectedMessage(null)}
              ></button>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Sender Name</small>
                <h6>{selectedMessage.senderName}</h6>
              </div>

              <div className="mb-3">
                <small className="text-muted">Email</small>
                <h6>{selectedMessage.email}</h6>
              </div>

              <div className="mb-3">
                <small className="text-muted">Subject</small>
                <h6>{selectedMessage.subject}</h6>
              </div>

              <div className="mb-3">
                <small className="text-muted">Received Date</small>
                <h6>{formatDate(selectedMessage.date)}</h6>
              </div>

              <div className="p-3 rounded bg-light mb-4">
                <small className="text-muted">Customer Message</small>
                <p className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.reply && (
                <div className="alert alert-success">
                  <strong>Previous Reply:</strong>
                  <p className="mb-1 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedMessage.reply}
                  </p>
                  <small>
                    {formatDate(selectedMessage.replyDate)}
                  </small>
                </div>
              )}

              <form onSubmit={handleReply}>
                <label className="form-label fw-semibold">
                  Write Reply
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your reply here..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  required
                ></textarea>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#087FC4" }}
                  >
                    Save Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMessages;