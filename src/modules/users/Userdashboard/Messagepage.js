
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaComments,
  FaPaperclip,
  FaTrash,
  FaFilePdf,
  FaFileAlt,
  FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";

const API = "http://localhost:8700/messages";
const STATUS_API = "http://localhost:8700/chatstatus";

function MessagePage() {
  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  const userId = loginData?.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const updateTyping = async (isTyping) => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `${STATUS_API}?userId=${encodeURIComponent(userId)}`
      );

      const data = {
        userId: String(userId),
        userTyping: isTyping,
        updatedAt: new Date().toISOString()
      };

      if (response.data.length > 0) {
        await axios.patch(
          `${STATUS_API}/${response.data[0].id}`,
          data
        );
      } else {
        await axios.post(STATUS_API, data);
      }
    } catch (err) {
      console.log("Typing status update failed.");
    }
  };

  const fetchMessages = async () => {
    if (!userId) {
      setError("Login details nahi mile. Dobara login karo.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API}?userId=${encodeURIComponent(userId)}`
      );

      const sorted = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setMessages(sorted);

      const unread = sorted.filter(
        (item) =>
          item.sender === "admin" &&
          item.status !== "seen"
      );

      await Promise.all(
        unread.map((item) =>
          axios.patch(`${API}/${item.id}`, {
            status: "seen"
          })
        )
      );

      const statusResponse = await axios.get(
        `${STATUS_API}?userId=${encodeURIComponent(userId)}`
      );

      if (statusResponse.data.length > 0) {
        const status = statusResponse.data[0];

        const isRecent =
          Date.now() - new Date(status.updatedAt).getTime() < 10000;

        setAdminTyping(Boolean(status.adminTyping && isRecent));
      } else {
        setAdminTyping(false);
      }

      setError("");
    } catch (err) {
      setError("Messages load nahi ho rahe. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    if (!message.trim()) {
      updateTyping(false);
      return;
    }

    updateTyping(true);

    const timer = setTimeout(() => {
      updateTyping(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, userId]);

  // File selection - maximum 100 MB
  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Sirf JPG, PNG, WEBP, GIF, PDF, DOC aur DOCX files allowed hain.");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Maximum file size 100 MB hai.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result
      });
    };

    reader.onerror = () => {
      alert("File read nahi hui.");
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && !attachment) {
      alert("Message ya attachment add karo.");
      return;
    }

    try {
      setSending(true);

      await axios.post(API, {
        userId: String(userId),
        sender: "user",
        senderName: loginData?.username || "User",
        email: loginData?.email || "",
        message: message.trim(),
        attachment: attachment,
        date: new Date().toISOString(),
        status: "sent"
      });

      setMessage("");
      setAttachment(null);

      await updateTyping(false);
      await fetchMessages();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Message send nahi hua. JSON Server ki request limit check karo."
      );
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (item) => {
    if (item.sender !== "user") return;

    if (!window.confirm("Kya aap ye message delete karna chahte hain?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${item.id}`);
      await fetchMessages();
    } catch (err) {
      alert("Message delete nahi hua.");
    }
  };

  const addEmoji = (emoji) => {
    setMessage((previous) => previous + emoji);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatSize = (size) => {
    if (!size) return "";

    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Image and document attachment display
  const renderAttachment = (file) => {
    if (!file) return null;

    // Old and new records support
    const fileData = file.data || file.url;

    if (!fileData) return null;

    if (file.type?.startsWith("image/")) {
      return (
        <div className="mt-2">
          <a
            href={fileData}
            target="_blank"
            rel="noopener noreferrer"
            title="Open image"
          >
            <img
              src={fileData}
              alt={file.name || "Chat attachment"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              style={{
                maxWidth: "220px",
                maxHeight: "180px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "10px",
                cursor: "pointer",
                background: "#ffffff"
              }}
            />
          </a>

          <small className="d-block mt-1">
            {file.name}
          </small>
        </div>
      );
    }

    return (
      <a
        href={fileData}
        target="_blank"
        rel="noopener noreferrer"
        download={file.name}
        className="d-flex align-items-center gap-2 mt-2 text-reset"
      >
        {file.type === "application/pdf" ? (
          <FaFilePdf />
        ) : (
          <FaFileAlt />
        )}

        <span>{file.name || "Download attachment"}</span>
      </a>
    );
  };

  const filteredMessages = messages.filter((item) => {
    const matchesSearch = [
      item.message,
      item.attachment?.name
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDate = filterDate
      ? new Date(item.date).toLocaleDateString("en-CA") === filterDate
      : true;

    return matchesSearch && matchesDate;
  });

  if (!userId) {
    return (
      <div className="container py-5 text-center">
        <h5>Please login first</h5>

        <Link to="/UserLoginPage" className="btn btn-primary mt-3">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4">

      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/landing/home" className="btn btn-light border">
          <FaArrowLeft />
        </Link>

        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Messages
          </h3>

          <p className="text-muted mb-0">
            Chat with Converlink Admin
          </p>
        </div>
      </div>

      <div
        className="card border-0 shadow-sm mx-auto"
        style={{ maxWidth: "950px" }}
      >
        <div
          className="card-header text-white d-flex align-items-center gap-3 py-3"
          style={{ backgroundColor: "#102D4F" }}
        >
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: "#087FC4"
            }}
          >
            <FaComments size={20} />
          </div>

          <div>
            <h6 className="mb-0">Converlink Admin</h6>
            <small>Customer Support</small>
          </div>
        </div>

        <div className="p-3 border-bottom">
          <div className="row g-2">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Search chat messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className="card-body bg-light"
          style={{ height: "430px", overflowY: "auto" }}
        >
          {loading ? (
            <p className="text-center mt-5">Loading messages...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <FaComments size={40} />
              <p className="mt-3">No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((item) => (
              <div
                key={item.id}
                className={`d-flex mb-3 ${
                  item.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className="p-3 shadow-sm"
                  style={{
                    maxWidth: "78%",
                    minWidth: "130px",
                    borderRadius: "14px",
                    backgroundColor:
                      item.sender === "user" ? "#087FC4" : "#ffffff",
                    color: item.sender === "user" ? "#ffffff" : "#212529"
                  }}
                >
                  <small className="fw-bold d-block mb-1">
                    {item.sender === "user" ? "You" : "Converlink Admin"}
                  </small>

                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {item.message}
                  </div>

                  {renderAttachment(item.attachment)}

                  <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
                    <small style={{ fontSize: "11px", opacity: 0.8 }}>
                      {formatDate(item.date)}
                    </small>

                    {item.sender === "user" && (
                      <small title={item.status}>
                        {item.status === "seen"
                          ? "✓✓ Seen"
                          : item.status === "delivered"
                          ? "✓✓ Delivered"
                          : "✓ Sent"}
                      </small>
                    )}

                    {item.sender === "user" && (
                      <button
                        type="button"
                        className="btn btn-sm p-0 text-white"
                        title="Delete message"
                        onClick={() => deleteMessage(item)}
                      >
                        <FaTrash size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {adminTyping && (
            <div className="text-muted small">
              Converlink Admin is typing...
            </div>
          )}
        </div>

        <div className="card-body border-top">

          <div className="d-flex gap-2 mb-2 flex-wrap">
            {["😀", "😂", "❤️", "👍", "🙏", "😊","😀", "😂", "😍", "🥰", "😊",
  "😉", "😎", "🤔", "😭", "😡",
  "👍", "👏",  "💙",
  "🔥", "🎉", "👋", "🤝", "💯"
].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="btn btn-light border"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          {attachment && (
            <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
              <span className="text-truncate">
                <FaPaperclip className="me-2" />
                {attachment.name}
                {" "}
                ({formatSize(attachment.size)})
              </span>

              <button
                type="button"
                className="btn btn-sm text-danger"
                onClick={() => setAttachment(null)}
              >
                <FaTimes />
              </button>
            </div>
          )}

          <form onSubmit={sendMessage}>
            <div className="d-flex gap-2 align-items-end">

              <label
                className="btn btn-light border mb-0 py-3"
                title="Attach file"
              >
                <FaPaperclip />

                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx"
                  onChange={handleFile}
                />
              </label>

              <textarea
                className="form-control"
                rows="2"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                type="submit"
                className="btn text-white py-3 px-4"
                style={{ backgroundColor: "#087FC4" }}
                disabled={sending}
              >
                {sending ? "..." : <FaPaperPlane />}
              </button>

            </div>
          </form>

          <small className="text-muted">
            Maximum file selection size: 100 MB
          </small>

        </div>
      </div>
    </div>
  );
}

export default MessagePage;
