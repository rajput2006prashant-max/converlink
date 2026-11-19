
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaComments,
  FaSearch,
  FaSync,
  FaPaperclip,
  FaTrash,
  FaFilePdf,
  FaFileAlt
} from "react-icons/fa";

const API = "http://localhost:8700/messages";
const USER_API = "http://localhost:8700/user";
const STATUS_API = "http://localhost:8700/chatstatus";

function ManageMessages() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [search, setSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [userTyping, setUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [userResponse, messageResponse] = await Promise.all([
        axios.get(USER_API),
        axios.get(API)
      ]);

      setUsers(userResponse.data);

      const sorted = messageResponse.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setMessages(sorted);

      const undelivered = sorted.filter(
        (item) =>
          item.sender === "user" &&
          (!item.status || item.status === "sent")
      );

      await Promise.all(
        undelivered.map((item) =>
          axios.patch(`${API}/${item.id}`, {
            status: "delivered"
          })
        )
      );

      if (selectedUser) {
        const statusResponse = await axios.get(
          `${STATUS_API}?userId=${encodeURIComponent(selectedUser.id)}`
        );

        if (statusResponse.data.length > 0) {
          const status = statusResponse.data[0];

          const isRecent =
            Date.now() - new Date(status.updatedAt).getTime() < 10000;

          setUserTyping(Boolean(status.userTyping && isRecent));
        } else {
          setUserTyping(false);
        }
      }

      setError("");
    } catch (err) {
      setError("Users ya messages load nahi hue. JSON Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [selectedUser?.id]);

  const updateTyping = async (isTyping) => {
    if (!selectedUser) return;

    try {
      const response = await axios.get(
        `${STATUS_API}?userId=${encodeURIComponent(selectedUser.id)}`
      );

      const data = {
        userId: String(selectedUser.id),
        adminTyping: isTyping,
        updatedAt: new Date().toISOString()
      };

      if (response.data.length > 0) {
        await axios.patch(
          `${STATUS_API}/${response.data[0].id}`,
          data
        );
      } else {
        await axios.post(STATUS_API, {
          userId: String(selectedUser.id),
          userTyping: false,
          adminTyping: isTyping,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.log("Typing status update failed.");
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    if (!reply.trim()) {
      updateTyping(false);
      return;
    }

    updateTyping(true);

    const timer = setTimeout(() => {
      updateTyping(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [reply, selectedUser?.id]);

  const openChat = async (user) => {
    setSelectedUser(user);
    setReply("");
    setAttachment(null);
    setChatSearch("");
    setFilterDate("");

    try {
      const response = await axios.get(
        `${API}?userId=${encodeURIComponent(user.id)}`
      );

      const unread = response.data.filter(
        (item) =>
          item.sender === "user" &&
          item.status !== "seen"
      );

      await Promise.all(
        unread.map((item) =>
          axios.patch(`${API}/${item.id}`, {
            status: "seen"
          })
        )
      );

      fetchData();
    } catch (err) {
      alert("Chat open nahi hui.");
    }
  };

  // 100 MB file upload frontend limit
  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Sirf JPG, PNG, WEBP, PDF aur DOC files allowed hain.");
      e.target.value = "";
      return;
    }

    // Maximum 100 MB
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

  const handleReply = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!reply.trim() && !attachment) {
      alert("Reply ya attachment add karo.");
      return;
    }

    try {
      setSending(true);

      await axios.post(API, {
        userId: String(selectedUser.id),
        sender: "admin",
        senderName: "Converlink Admin",
        message: reply.trim(),
        attachment: attachment,
        date: new Date().toISOString(),
        status: "sent"
      });

      setReply("");
      setAttachment(null);

      await updateTyping(false);
      await fetchData();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Reply send nahi hua. JSON Server check karo."
      );
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (item) => {
    if (!window.confirm("Kya aap ye message delete karna chahte hain?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${item.id}`);
      fetchData();
    } catch (err) {
      alert("Message delete nahi hua.");
    }
  };

  const addEmoji = (emoji) => {
    setReply((previous) => previous + emoji);
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

  const renderAttachment = (file) => {
    if (!file?.data) return null;

    if (file.type?.startsWith("image/")) {
      return (
        <a href={file.data} target="_blank" rel="noreferrer">
          <img
            src={file.data}
            alt={file.name}
            style={{
              maxWidth: "190px",
              maxHeight: "150px",
              display: "block",
              borderRadius: "8px",
              marginTop: "8px"
            }}
          />
        </a>
      );
    }

    return (
      <a
        href={file.data}
        download={file.name}
        className="d-flex align-items-center gap-2 mt-2 text-reset"
      >
        {file.type === "application/pdf" ? <FaFilePdf /> : <FaFileAlt />}
        {file.name}
      </a>
    );
  };

  const filteredUsers = users.filter((user) => {
    const hasMessages = messages.some(
      (item) => String(item.userId) === String(user.id)
    );

    return (
      hasMessages &&
      [user.username, user.email, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const chatMessages = messages.filter((item) => {
    if (!selectedUser) return false;

    const sameUser =
      String(item.userId) === String(selectedUser.id);

    const matchesSearch = [
      item.message,
      item.attachment?.name
    ]
      .join(" ")
      .toLowerCase()
      .includes(chatSearch.toLowerCase());

    const matchesDate = filterDate
      ? new Date(item.date).toLocaleDateString("en-CA") === filterDate
      : true;

    return sameUser && matchesSearch && matchesDate;
  });

  const unreadCount = messages.filter(
    (item) =>
      item.sender === "user" &&
      item.status !== "seen"
  ).length;

  return (
    <div className="container-fluid p-3 p-md-4">

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#102D4F" }}>
            Manage Messages
          </h3>
          <p className="text-muted mb-0">
            Customer Support Chat
          </p>
        </div>

        <button
          className="btn text-white"
          style={{ backgroundColor: "#087FC4" }}
          onClick={fetchData}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-2">Total Messages</p>
              <h3 className="fw-bold" style={{ color: "#102D4F" }}>
                {messages.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-2">Unread User Messages</p>
              <h3 className="fw-bold text-warning">{unreadCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="row g-0">

          <div className="col-md-4 border-end" style={{ minHeight: "600px" }}>
            <div className="p-3 border-bottom">
              <h5 className="fw-bold" style={{ color: "#102D4F" }}>
                Inbox
              </h5>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  className="form-control"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ maxHeight: "550px", overflowY: "auto" }}>
              {loading ? (
                <p className="text-center p-4">Loading...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-muted p-4">
                  No conversations found.
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const userMessages = messages.filter(
                    (item) => String(item.userId) === String(user.id)
                  );

                  const lastMessage =
                    userMessages[userMessages.length - 1];

                  const unread = userMessages.filter(
                    (item) =>
                      item.sender === "user" &&
                      item.status !== "seen"
                  ).length;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => openChat(user)}
                      className="w-100 text-start border-0 border-bottom p-3"
                      style={{
                        backgroundColor:
                          selectedUser?.id === user.id
                            ? "#eaf5fc"
                            : "#ffffff"
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong style={{ color: "#102D4F" }}>
                          {user.username}
                        </strong>

                        {unread > 0 && (
                          <span className="badge bg-danger rounded-pill">
                            {unread}
                          </span>
                        )}
                      </div>

                      <small className="text-muted d-block">
                        {user.email}
                      </small>

                      <small className="text-secondary d-block text-truncate mt-2">
                        {lastMessage?.sender === "admin" ? "You: " : ""}
                        {lastMessage?.message || lastMessage?.attachment?.name}
                      </small>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="col-md-8">
            {selectedUser ? (
              <>
                <div
                  className="p-3 text-white d-flex align-items-center gap-3"
                  style={{ backgroundColor: "#102D4F" }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "#087FC4"
                    }}
                  >
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h6 className="mb-0">{selectedUser.username}</h6>
                    <small>{selectedUser.email}</small>
                  </div>
                </div>

                <div className="p-3 border-bottom">
                  <div className="row g-2">
                    <div className="col-md-8">
                      <input
                        className="form-control"
                        placeholder="Search chat..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
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
                  className="p-3 bg-light"
                  style={{ height: "430px", overflowY: "auto" }}
                >
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                      <FaComments size={40} />
                      <p className="mt-3">No messages found.</p>
                    </div>
                  ) : (
                    chatMessages.map((item) => (
                      <div
                        key={item.id}
                        className={`d-flex mb-3 ${
                          item.sender === "admin"
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
                              item.sender === "admin"
                                ? "#087FC4"
                                : "#ffffff",
                            color:
                              item.sender === "admin"
                                ? "#ffffff"
                                : "#212529"
                          }}
                        >
                          <small className="fw-bold d-block mb-1">
                            {item.sender === "admin"
                              ? "You (Admin)"
                              : selectedUser.username}
                          </small>

                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {item.message}
                          </div>

                          {renderAttachment(item.attachment)}

                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <small style={{ opacity: 0.8, fontSize: "11px" }}>
                              {formatDate(item.date)}
                            </small>

                            {item.sender === "admin" && (
                              <small>
                                {item.status === "seen"
                                  ? "✓✓ Seen"
                                  : item.status === "delivered"
                                  ? "✓✓ Delivered"
                                  : "✓ Sent"}
                              </small>
                            )}

                            <button
                              type="button"
                              className={`btn btn-sm p-0 ${
                                item.sender === "admin"
                                  ? "text-white"
                                  : "text-danger"
                              }`}
                              title="Delete message"
                              onClick={() => deleteMessage(item)}
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {userTyping && (
                    <div className="text-muted small">
                      {selectedUser.username} is typing...
                    </div>
                  )}
                </div>

                <div className="p-3 border-top">
                  <div className="d-flex gap-2 mb-2 flex-wrap">
                    {["😀", "😂", "❤️", "👍", "🙏", "😊","😀", "😂", "😍", "🥰", "😊",
  "😉", "😎", "🤔", "😭", "😡",
   "👏", "🙏",  "💙",
  "🔥", "🎉",  "🤝", "💯"
,].map((emoji) => (
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
                        {attachment.name}
                        {" "}
                        ({formatSize(attachment.size)})
                      </span>

                      <button
                        type="button"
                        className="btn-close ms-2"
                        onClick={() => setAttachment(null)}
                      />
                    </div>
                  )}

                  <form onSubmit={handleReply}>
                    <div className="d-flex gap-2 align-items-end">
                      <label className="btn btn-light border mb-0 py-3">
                        <FaPaperclip />
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                          onChange={handleFile}
                        />
                      </label>

                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Write your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />

                      <button
                        type="submit"
                        className="btn text-white py-3 px-4"
                        style={{ backgroundColor: "#087FC4" }}
                        disabled={sending}
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>

                  <small className="text-muted">
                    Maximum file size: 100 MB
                  </small>
                </div>
              </>
            ) : (
              <div
                className="d-flex flex-column justify-content-center align-items-center text-muted"
                style={{ minHeight: "600px" }}
              >
                <FaComments size={55} />
                <h5 className="mt-3">Select a Conversation</h5>
                <p>Choose a user from the inbox.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageMessages;
