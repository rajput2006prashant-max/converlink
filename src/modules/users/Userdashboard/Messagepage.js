
import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";

import axios from "axios";

import {
  FaPaperPlane,
  FaUserCircle,
  FaUserShield,
  FaSyncAlt,
  FaPaperclip,
  FaSmile,
  FaTimes,
  FaFileAlt,
  FaTrash
} from "react-icons/fa";

const API = "http://localhost:8700/messages";
const USER_API = "http://localhost:8700/user";
const PROFILE_API = "http://localhost:8700/userprofile";
const ADMIN_PROFILE_API = "http://localhost:8700/adminprofile";

const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍",
  "🥰", "😘", "😎", "🤔", "😢", "😭",
  "😡", "👍", "👎", "👏", "🙏", "❤️",
  "🔥", "🎉", "✅", "👌", "💯", "🤝"
];

// AVATAR COMPONENT
function Avatar({ photo, isAdmin = false, size = 40 }) {
  return photo ? (
    <img
      src={photo}
      alt={isAdmin ? "Admin Profile" : "User Profile"}
      className="rounded-circle flex-shrink-0"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        border: "2px solid #ddd"
      }}
    />
  ) : isAdmin ? (
    <FaUserShield
      size={size}
      color="#087FC4"
      className="flex-shrink-0"
    />
  ) : (
    <FaUserCircle
      size={size}
      color="#087FC4"
      className="flex-shrink-0"
    />
  );
}

function UserMessage() {
  const loginData = JSON.parse(
    localStorage.getItem("userLoginData") || "null"
  );

  const userId = String(
    loginData?.id || loginData?.userId || ""
  );

  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const [userPhoto, setUserPhoto] = useState("");
  const [adminPhoto, setAdminPhoto] = useState("");

  const [username, setUsername] = useState(
    loginData?.username || "User"
  );

  const [userEmail, setUserEmail] = useState(
    loginData?.email || ""
  );

  const [attachment, setAttachment] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  // BLOCK USER STATE
  const [isBlocked, setIsBlocked] = useState(
    Boolean(loginData?.blocked)
  );

  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  // FETCH USER AND ADMIN PROFILE
  const fetchProfilePhotos = useCallback(async () => {
    if (!userId) return;

    try {
      const [userRes, profileRes, adminRes] =
        await Promise.allSettled([
          axios.get(USER_API),
          axios.get(PROFILE_API),
          axios.get(ADMIN_PROFILE_API)
        ]);

      const users =
        userRes.status === "fulfilled"
          ? userRes.value.data
          : [];

      const profiles =
        profileRes.status === "fulfilled"
          ? profileRes.value.data
          : [];

      const admins =
        adminRes.status === "fulfilled"
          ? adminRes.value.data
          : [];

      const currentUser = users.find(
        (item) => String(item.id) === userId
      );

      const userProfile = profiles.find(
        (item) => String(item.userId) === userId
      );

      // CHECK USER BLOCK STATUS
      setIsBlocked(
        Boolean(currentUser?.blocked)
      );

      const adminLogin = JSON.parse(
        localStorage.getItem("adminLoginData") || "null"
      );

      const adminProfile =
        admins.find(
          (item) =>
            String(item.adminId) === String(adminLogin?.id) ||
            String(item.userId) === String(adminLogin?.id)
        ) || admins[0];

      setUsername(
        userProfile?.username ||
        currentUser?.username ||
        loginData?.username ||
        "User"
      );

      setUserEmail(
        userProfile?.email ||
        currentUser?.email ||
        loginData?.email ||
        ""
      );

      setUserPhoto(
        userProfile?.profileImage ||
        currentUser?.profileImage ||
        loginData?.profileImage ||
        ""
      );

      setAdminPhoto(
        adminProfile?.profileImage ||
        adminProfile?.photo ||
        adminProfile?.image ||
        adminLogin?.profileImage ||
        ""
      );

    } catch (error) {
      console.error("Profile Error:", error);
    }
  }, [
    userId,
    loginData?.email,
    loginData?.profileImage,
    loginData?.username
  ]);

  // FETCH MESSAGES
  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await axios.get(API);

      const userMessages = response.data
        .filter(
          (item) => String(item.userId) === userId
        )
        .sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

      setMessages((previous) => {
        const oldData = JSON.stringify(
          previous.map((item) => ({
            id: item.id,
            message: item.message,
            status: item.status,
            attachment: item.attachment,
            date: item.date
          }))
        );

        const newData = JSON.stringify(
          userMessages.map((item) => ({
            id: item.id,
            message: item.message,
            status: item.status,
            attachment: item.attachment,
            date: item.date
          }))
        );

        return oldData === newData
          ? previous
          : userMessages;
      });

    } catch (error) {
      console.error("Fetch Messages Error:", error);
    }
  }, [userId]);

  // LOAD AND AUTO REFRESH
  useEffect(() => {
    fetchMessages();
    fetchProfilePhotos();

    const messageInterval = setInterval(
      fetchMessages,
      3000
    );

    const profileInterval = setInterval(
      fetchProfilePhotos,
      5000
    );

    return () => {
      clearInterval(messageInterval);
      clearInterval(profileInterval);
    };
  }, [fetchMessages, fetchProfilePhotos]);

  // SCROLL TO LATEST MESSAGE
  const lastMessageId =
    messages.length > 0
      ? messages[messages.length - 1].id
      : null;

  useEffect(() => {
    const chat = chatBodyRef.current;

    if (chat && lastMessageId) {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [lastMessageId]);

  // SELECT EMOJI
  const selectEmoji = (emoji) => {
    if (isBlocked) return;

    setReply((previous) => previous + emoji);
    setShowEmoji(false);
  };

  // ATTACHMENT
  const handleAttachment = (e) => {
    if (isBlocked) {
      alert("Admin ne aapko block kiya hai. Aap message nahi bhej sakte.");
      e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size 2MB se kam honi chahiye.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: reader.result
      });
    };

    reader.onerror = () => {
      alert("File read nahi ho payi.");
    };

    reader.readAsDataURL(file);
  };

  // REMOVE ATTACHMENT
  const removeAttachment = () => {
    setAttachment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      alert("Admin ne aapko block kiya hai. Aap message nahi bhej sakte.");
      return;
    }

    if (!reply.trim() && !attachment) return;

    if (!userId) {
      alert("User ID nahi mili. Please dobara login karein.");
      return;
    }

    const newMessage = {
      userId,
      sender: "user",
      senderName: username,
      senderEmail: userEmail,
      senderPhoto: userPhoto,
      message: reply.trim(),
      attachment,
      date: new Date().toISOString(),
      status: "sent"
    };

    try {
      setLoading(true);

      const response = await axios.post(API, newMessage);

      setMessages((previous) =>
        [...previous, response.data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );

      setReply("");
      setAttachment(null);
      setShowEmoji(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Send Message Error:", error);
      alert("Message send nahi hua. JSON Server check karein.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE OWN MESSAGE
  const deleteMessage = async (messageId) => {
    const confirmDelete = window.confirm(
      "Kya aap is message ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      const message = messages.find(
        (item) => String(item.id) === String(messageId)
      );

      if (
        !message ||
        message.sender !== "user" ||
        String(message.userId) !== userId
      ) {
        alert("Aap sirf apne messages delete kar sakte hain.");
        return;
      }

      await axios.delete(
        `${API}/${encodeURIComponent(messageId)}`
      );

      setMessages((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(messageId)
        )
      );

    } catch (error) {
      console.error("Delete Message Error:", error);
      alert("Message delete nahi hua.");
    }
  };

  // REFRESH
  const refreshMessages = () => {
    fetchMessages();
    fetchProfilePhotos();
  };

  // ATTACHMENT DISPLAY
  const renderAttachment = (file) => {
    if (!file) return null;

    if (typeof file === "object" && file.data) {
      if (file.type?.startsWith("image/")) {
        return (
          <a
            href={file.data}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={file.data}
              alt={file.name}
              style={{
                maxWidth: "220px",
                maxHeight: "180px",
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
          </a>
        );
      }

      return (
        <a
          href={file.data}
          download={file.name}
          className="d-block text-decoration-none mt-2"
          style={{
            color: "inherit",
            overflowWrap: "anywhere"
          }}
        >
          <FaFileAlt className="me-2" />
          {file.name}
        </a>
      );
    }

    if (typeof file === "string") {
      return (
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="d-block mt-2"
        >
          View Attachment
        </a>
      );
    }

    return null;
  };

  return (
    <div className="container-fluid py-3">

      <div className="card border-0 shadow-sm">

        {/* HEADER */}
        <div
          className="card-header text-white d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#102D4F" }}
        >
          <div className="d-flex align-items-center gap-3">
            <Avatar
              photo={adminPhoto}
              isAdmin
              size={48}
            />

            <div>
              <h5 className="mb-0">Admin Support</h5>
              <small>Chat with Admin</small>
            </div>
          </div>

          <button
            className="btn btn-light btn-sm"
            onClick={refreshMessages}
            title="Refresh Messages"
            type="button"
          >
            <FaSyncAlt />
          </button>
        </div>

        {/* USER DETAILS */}
        <div
          className="p-3 border-bottom d-flex align-items-center gap-3"
          style={{ background: "#102D4F" }}
        >
          <Avatar photo={userPhoto} size={48} />

          <div>
            <h6 className="mb-0 text-white">{username}</h6>
            <small className="text-white">{userEmail}</small>
          </div>
        </div>

        {/* BLOCKED USER WARNING */}
        {isBlocked && (
          <div className="alert alert-danger rounded-0 mb-0 text-center">
            <strong>Account Blocked!</strong>
            <br />
            Admin ne aapko block kiya hai. Aap abhi message ya attachment send nahi kar sakte.
          </div>
        )}

        {/* CHAT AREA */}
        <div
          ref={chatBodyRef}
          className="card-body"
          style={{
            height: "450px",
            overflowY: "auto",
            backgroundColor: "#f4f6f9"
          }}
        >
          {!userId ? (
            <div className="alert alert-warning">
              User ID nahi mili. Please dobara login karein.
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <FaUserShield size={45} className="mb-3" />
              <h6>No Messages Yet</h6>
              <p>Admin ko apna pehla message bhejein.</p>
            </div>
          ) : (
            messages.map((item) => {
              const isUser = item.sender === "user";

              const photo = isUser
                ? item.senderPhoto || userPhoto
                : item.senderPhoto || adminPhoto;

              return (
                <div
                  key={item.id}
                  className={`d-flex align-items-end gap-2 mb-3 ${
                    isUser
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  {!isUser && (
                    <Avatar
                      photo={photo}
                      isAdmin
                      size={35}
                    />
                  )}

                  <div
                    style={{
                      maxWidth: "75%",
                      minWidth: "120px",
                      padding: "11px 14px",
                      borderRadius: "12px",
                      backgroundColor: isUser
                        ? "#087FC4"
                        : "#ffffff",
                      color: isUser ? "#ffffff" : "#222",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                      overflowWrap: "anywhere"
                    }}
                  >
                    <div className="small fw-bold mb-1">
                      {isUser
                        ? "You"
                        : item.senderName || "Admin"}
                    </div>

                    {item.message && (
                      <div>{item.message}</div>
                    )}

                    {renderAttachment(item.attachment)}

                    {/* DELETE OWN MESSAGE */}
                    {isUser && (
                      <div className="text-end mt-2">
                        <button
                          type="button"
                          className="btn btn-sm p-0 border-0 text-white"
                          title="Delete Message"
                          onClick={() => deleteMessage(item.id)}
                          style={{
                            background: "transparent",
                            fontSize: "12px"
                          }}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </button>
                      </div>
                    )}

                    <div
                      className="text-end mt-2"
                      style={{
                        fontSize: "10px",
                        opacity: 0.8
                      }}
                    >
                      {item.date
                        ? new Date(item.date).toLocaleString()
                        : ""}

                      {isUser && (
                        <span className="ms-2">
                          {item.status === "seen" ||
                          item.status === "read"
                            ? "✓✓ Seen"
                            : item.status === "delivered"
                            ? "✓✓"
                            : "✓"}
                        </span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <Avatar photo={photo} size={35} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ATTACHMENT PREVIEW */}
        {attachment && (
          <div className="px-3 pt-2 bg-white">
            <div className="border rounded p-2 d-flex align-items-center justify-content-between">
              <div className="text-truncate">
                <FaFileAlt className="me-2" />
                {attachment.name}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={removeAttachment}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* EMOJI PICKER */}
        {showEmoji && !isBlocked && (
          <div className="px-3 pt-2 bg-white border-top">
            <div className="d-flex flex-wrap gap-2">
              {EMOJIS.map((emoji, index) => (
                <button
                  type="button"
                  key={index}
                  className="btn btn-light border"
                  style={{ fontSize: "21px" }}
                  onClick={() => selectEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT AREA */}
        <div className="card-footer bg-white p-3">
          <form onSubmit={sendMessage}>
            <div className="input-group">

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowEmoji(!showEmoji)}
                title="Emoji"
                disabled={isBlocked}
              >
                <FaSmile />
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fileInputRef.current?.click()}
                title="Attach File"
                disabled={isBlocked}
              >
                <FaPaperclip />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleAttachment}
                disabled={isBlocked}
              />

              <input
                type="text"
                className="form-control"
                placeholder={
                  isBlocked
                    ? "You are blocked by Admin"
                    : "Type your message..."
                }
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                disabled={loading || !userId || isBlocked}
              />

              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: "#087FC4" }}
                disabled={
                  loading ||
                  isBlocked ||
                  (!reply.trim() && !attachment) ||
                  !userId
                }
              >
                <FaPaperPlane className="me-1" />
                {loading ? "Sending..." : "Send"}
              </button>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default UserMessage;
  