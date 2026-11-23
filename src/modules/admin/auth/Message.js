
import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import {
  FaPaperPlane,
  FaComments,
  FaPaperclip,
  FaTrash,
  FaFilePdf,
  FaFileAlt,
  FaTimes,
  FaSearch,
  FaArrowLeft,
  FaSync,
  FaEnvelope,
  FaEllipsisV,
  FaEye,
  FaBan,
  FaUserCheck,
  FaUser
} from "react-icons/fa";

const API = "http://localhost:8700/messages";
const USER_API = "http://localhost:8700/user";
const PROFILE_API = "http://localhost:8700/userprofile";
const STATUS_API = "http://localhost:8700/chatstatus";
const ADMIN_PROFILE_API = "http://localhost:8700/adminprofile";

// =====================================
// GET ADMIN LOGIN DATA SAFELY
// =====================================

const getAdminLoginData = () => {
  try {
    return JSON.parse(
      localStorage.getItem("adminLoginData") || "null"
    );
  } catch {
    return null;
  }
};

// =====================================
// USER AVATAR COMPONENT
// =====================================

function UserAvatar({ user, size = 43 }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [
    user?.profilePhoto,
    user?.senderPhoto,
    user?.profileImage,
    user?.photo,
    user?.image
  ]);

  const photo =
    user?.profilePhoto ||
    user?.senderPhoto ||
    user?.profileImage ||
    user?.photo ||
    user?.image ||
    "";

  const username =
    user?.username ||
    user?.senderName ||
    "User";

  return (
    <div
      className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        minWidth: size,
        backgroundColor: "#087FC4",
        color: "#fff",
        fontWeight: "bold",
        fontSize: size * 0.42
      }}
    >
      {photo && !imageError ? (
        <img
          src={photo}
          alt={username}
          onError={() => setImageError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        username.charAt(0).toUpperCase()
      )}
    </div>
  );
}

// =====================================
// ADMIN MESSAGE COMPONENT
// =====================================

function ManageMessages() {
  const adminLoginData = getAdminLoginData();

  const adminId = adminLoginData?.id
    ? String(adminLoginData.id)
    : "";

  // =====================================
  // STATES
  // =====================================

  const [users, setUsers] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [search, setSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [userTyping, setUserTyping] = useState(false);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // NEW STATES
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userActionLoading, setUserActionLoading] = useState(false);

  // =====================================
  // ADMIN DETAILS
  // =====================================

  const adminName =
    adminProfile?.username ||
    adminLoginData?.username ||
    adminLoginData?.name ||
    "Converlink Admin";

  const adminEmail =
    adminProfile?.email ||
    adminLoginData?.email ||
    "";

  const adminPhoto =
    adminProfile?.profileImage ||
    adminProfile?.photo ||
    adminProfile?.image ||
    "";

  // =====================================
  // ADMIN AVATAR
  // =====================================

  const renderAdminAvatar = (size = 45) => {
    return (
      <div
        className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: "#087FC4",
          color: "#fff",
          fontSize: size * 0.42,
          fontWeight: "bold"
        }}
      >
        {adminPhoto ? (
          <img
            src={adminPhoto}
            alt={adminName}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.textContent =
                adminName.charAt(0).toUpperCase();
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          adminName.charAt(0).toUpperCase()
        )}
      </div>
    );
  };

  // =====================================
  // GET USER PROFILE
  // =====================================

  const getUserProfile = (user) => {
    if (!user) return null;

    return userProfiles.find(
      (item) =>
        String(item.userId) === String(user.id)
    ) || null;
  };

  // =====================================
  // GET USER PROFILE PHOTO
  // =====================================

  const getUserPhoto = (user) => {
    if (!user) return "";

    const profile = getUserProfile(user);

    return (
      profile?.profileImage ||
      profile?.photo ||
      profile?.image ||
      user.profileImage ||
      user.photo ||
      user.image ||
      ""
    );
  };

  // =====================================
  // GET USER DETAILS WITH PHOTO
  // =====================================

  const getUserWithPhoto = (user) => {
    if (!user) return null;

    return {
      ...user,
      profilePhoto: getUserPhoto(user)
    };
  };

  // =====================================
  // FETCH ADMIN PROFILE
  // =====================================

  const fetchAdminProfile = useCallback(async () => {
    if (!adminId) return;

    try {
      const response = await axios.get(
        ADMIN_PROFILE_API
      );

      const savedProfile = response.data.find(
        (item) =>
          String(item.adminId) === adminId ||
          String(item.id) === adminId
      );

      setAdminProfile(savedProfile || null);

    } catch (err) {
      console.error("ADMIN PROFILE ERROR:", err);
      setAdminProfile(null);
    }
  }, [adminId]);

  useEffect(() => {
    fetchAdminProfile();

    const interval = setInterval(
      fetchAdminProfile,
      10000
    );

    return () => clearInterval(interval);
  }, [fetchAdminProfile]);

  // =====================================
  // UPDATE TYPING STATUS
  // =====================================

  const updateTyping = useCallback(
    async (isTyping) => {
      if (!selectedUser?.id) return;

      try {
        const response = await axios.get(
          `${STATUS_API}?userId=${encodeURIComponent(
            selectedUser.id
          )}`
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
          await axios.post(STATUS_API, data);
        }

      } catch (err) {
        console.error(
          "Typing status update failed:",
          err
        );
      }
    },
    [selectedUser]
  );

  // =====================================
  // FETCH USERS, PROFILES AND MESSAGES
  // =====================================

  const fetchData = useCallback(async () => {
    try {
      const [
        userResponse,
        messageResponse,
        profileResponse,
        statusResponse
      ] = await Promise.all([
        axios.get(USER_API),
        axios.get(API),
        axios.get(PROFILE_API),
        selectedUser
          ? axios.get(
              `${STATUS_API}?userId=${encodeURIComponent(
                selectedUser.id
              )}`
            )
          : Promise.resolve({ data: [] })
      ]);

      setUsers(userResponse.data || []);
      setUserProfiles(profileResponse.data || []);

      let allMessages = messageResponse.data || [];

      const selectedUserId = selectedUser
        ? String(selectedUser.id)
        : null;

      // UPDATE USER MESSAGES TO DELIVERED / SEEN

      const statusUpdates = allMessages.filter(
        (item) => {
          if (item.sender !== "user") return false;

          if (item.status === "seen") return false;

          if (
            selectedUserId &&
            String(item.userId) === selectedUserId
          ) {
            return true;
          }

          return item.status === "sent";
        }
      );

      await Promise.all(
        statusUpdates.map((item) => {
          const isSelected =
            selectedUserId &&
            String(item.userId) === selectedUserId;

          return axios.patch(
            `${API}/${item.id}`,
            {
              status: isSelected
                ? "seen"
                : "delivered"
            }
          );
        })
      );

      if (statusUpdates.length > 0) {
        const updatedIds = statusUpdates.map(
          (item) => String(item.id)
        );

        allMessages = allMessages.map((item) => {
          if (
            !updatedIds.includes(String(item.id))
          ) {
            return item;
          }

          const isSelected =
            selectedUserId &&
            String(item.userId) === selectedUserId;

          return {
            ...item,
            status: isSelected
              ? "seen"
              : "delivered"
          };
        });
      }

      allMessages.sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      );

      setMessages(allMessages);

      // USER TYPING STATUS

      if (statusResponse.data.length > 0) {
        const status = statusResponse.data[0];

        const isRecent =
          Date.now() -
            new Date(status.updatedAt).getTime() <
          10000;

        setUserTyping(
          Boolean(status.userTyping && isRecent)
        );
      } else {
        setUserTyping(false);
      }

      setError("");

    } catch (err) {
      console.error("FETCH DATA ERROR:", err);

      setError(
        "Data load nahi hua. JSON Server check karo."
      );

    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // =====================================
  // AUTO REFRESH
  // =====================================

  useEffect(() => {
    fetchData();

    const interval = setInterval(
      fetchData,
      3000
    );

    return () => clearInterval(interval);
  }, [fetchData]);

  // =====================================
  // OPEN USER CHAT
  // =====================================

  const openChat = async (user) => {
    setSelectedUser(user);

    setShowUserMenu(false);
    setShowUserDetails(false);

    setMessageSearch("");
    setFilterDate("");
    setReply("");
    setAttachment(null);
    setUserTyping(false);

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

      setMessages((previous) =>
        previous.map((item) => {
          if (
            String(item.userId) === String(user.id) &&
            item.sender === "user"
          ) {
            return {
              ...item,
              status: "seen"
            };
          }

          return item;
        })
      );

    } catch (err) {
      console.error("Chat open error:", err);
    }
  };

  // =====================================
  // CLOSE CHAT
  // =====================================

  const closeChat = () => {
    updateTyping(false);

    setSelectedUser(null);
    setReply("");
    setAttachment(null);
    setUserTyping(false);
    setShowUserMenu(false);
    setShowUserDetails(false);
  };

  // =====================================
  // BLOCK / UNBLOCK USER
  // =====================================

  const toggleBlockUser = async () => {
    if (!selectedUser || userActionLoading) return;

    const currentlyBlocked = Boolean(selectedUser.blocked);

    const confirmAction = window.confirm(
      currentlyBlocked
        ? "Kya aap is user ko unblock karna chahte hain?"
        : "Kya aap is user ko block karna chahte hain?"
    );

    if (!confirmAction) return;

    try {
      setUserActionLoading(true);

      const updatedData = {
        blocked: !currentlyBlocked
      };

      const response = await axios.patch(
        `${USER_API}/${encodeURIComponent(selectedUser.id)}`,
        updatedData
      );

      const updatedUser = {
        ...selectedUser,
        ...response.data
      };

      setUsers((previous) =>
        previous.map((user) =>
          String(user.id) === String(selectedUser.id)
            ? updatedUser
            : user
        )
      );

      setSelectedUser(updatedUser);
      setShowUserMenu(false);

      alert(
        currentlyBlocked
          ? "User successfully unblocked."
          : "User successfully blocked."
      );

    } catch (err) {
      console.error("BLOCK USER ERROR:", err);
      alert("User block/unblock nahi hua.");
    } finally {
      setUserActionLoading(false);
    }
  };

  // =====================================
  // DELETE USER AND RELATED DATA
  // =====================================

  const deleteUser = async () => {
    if (!selectedUser || userActionLoading) return;

    const confirmDelete = window.confirm(
      `Kya aap ${selectedUser.username || "is user"} ko permanently delete karna chahte hain?\n\nIs user ke messages aur profile data bhi delete ho jayenge.`
    );

    if (!confirmDelete) return;

    try {
      setUserActionLoading(true);

      const userId = String(selectedUser.id);

      // FETCH RELATED DATA

      const [
        messageResponse,
        profileResponse,
        statusResponse
      ] = await Promise.all([
        axios.get(API),
        axios.get(PROFILE_API),
        axios.get(STATUS_API)
      ]);

      // FIND USER MESSAGES

      const relatedMessages = (
        messageResponse.data || []
      ).filter(
        (item) => String(item.userId) === userId
      );

      // FIND USER PROFILES

      const relatedProfiles = (
        profileResponse.data || []
      ).filter(
        (item) => String(item.userId) === userId
      );

      // FIND USER CHAT STATUS

      const relatedStatuses = (
        statusResponse.data || []
      ).filter(
        (item) => String(item.userId) === userId
      );

      // DELETE RELATED MESSAGES

      await Promise.all(
        relatedMessages.map((item) =>
          axios.delete(
            `${API}/${encodeURIComponent(item.id)}`
          )
        )
      );

      // DELETE USER PROFILES

      await Promise.all(
        relatedProfiles.map((item) =>
          axios.delete(
            `${PROFILE_API}/${encodeURIComponent(item.id)}`
          )
        )
      );

      // DELETE CHAT STATUS

      await Promise.all(
        relatedStatuses.map((item) =>
          axios.delete(
            `${STATUS_API}/${encodeURIComponent(item.id)}`
          )
        )
      );

      // DELETE USER

      await axios.delete(
        `${USER_API}/${encodeURIComponent(userId)}`
      );

      // UPDATE FRONTEND STATES

      setUsers((previous) =>
        previous.filter(
          (user) => String(user.id) !== userId
        )
      );

      setUserProfiles((previous) =>
        previous.filter(
          (profile) => String(profile.userId) !== userId
        )
      );

      setMessages((previous) =>
        previous.filter(
          (message) => String(message.userId) !== userId
        )
      );

      setSelectedUser(null);
      setReply("");
      setAttachment(null);
      setUserTyping(false);
      setShowUserMenu(false);
      setShowUserDetails(false);

      alert("User aur uska related data successfully delete ho gaya.");

    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      alert(
        "User delete nahi hua. JSON Server aur API data check karo."
      );

    } finally {
      setUserActionLoading(false);
    }
  };

  // =====================================
  // FILE SELECTION - MAX 100 MB
  // =====================================

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
      alert(
        "Sirf JPG, PNG, WEBP, GIF, PDF, DOC aur DOCX files allowed hain."
      );

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

  // =====================================
  // SEND ADMIN MESSAGE
  // =====================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Pehle user select karo.");
      return;
    }

    if (selectedUser.blocked) {
      alert("Ye user blocked hai. Unblock karne ke baad hi reply bhejein.");
      return;
    }

    if (!reply.trim() && !attachment) {
      alert("Message ya attachment add karo.");
      return;
    }

    try {
      setSending(true);

      const newMessage = {
        userId: String(selectedUser.id),

        sender: "admin",

        adminId: String(adminId),

        senderName: adminName,

        senderEmail: adminEmail,

        senderPhoto: adminPhoto,

        message: reply.trim(),

        attachment: attachment,

        date: new Date().toISOString(),

        status: "sent"
      };

      const response = await axios.post(
        API,
        newMessage
      );

      setMessages((previous) =>
        [...previous, response.data].sort(
          (a, b) =>
            new Date(a.date) - new Date(b.date)
        )
      );

      setReply("");
      setAttachment(null);

      await updateTyping(false);

    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);

      alert(
        err.response?.data?.message ||
        "Message send nahi hua. JSON Server check karo."
      );

    } finally {
      setSending(false);
    }
  };

  // =====================================
  // DELETE ADMIN MESSAGE
  // =====================================

  const deleteMessage = async (item) => {
    if (item.sender !== "admin") return;

    if (
      !window.confirm(
        "Kya aap ye message delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API}/${encodeURIComponent(item.id)}`
      );

      setMessages((previous) =>
        previous.filter(
          (message) =>
            String(message.id) !== String(item.id)
        )
      );

    } catch (err) {
      console.error("DELETE MESSAGE ERROR:", err);
      alert("Message delete nahi hua.");
    }
  };

  // =====================================
  // EMOJI
  // =====================================

  const addEmoji = (emoji) => {
    setReply((previous) => previous + emoji);
  };

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // =====================================
  // FILE SIZE
  // =====================================

  const formatSize = (size) => {
    if (!size) return "";

    return (
      size / (1024 * 1024)
    ).toFixed(2) + " MB";
  };

  // =====================================
  // ATTACHMENT DISPLAY
  // =====================================

  const renderAttachment = (file) => {
    if (!file) return null;

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

        <span>
          {file.name || "Download attachment"}
        </span>
      </a>
    );
  };

  // =====================================
  // SELECTED USER MESSAGES
  // =====================================

  const selectedMessages = messages.filter(
    (item) =>
      selectedUser &&
      String(item.userId) === String(selectedUser.id)
  );

  // =====================================
  // MESSAGE SEARCH AND DATE FILTER
  // =====================================

  const filteredMessages = selectedMessages.filter(
    (item) => {
      const matchesSearch = [
        item.message,
        item.attachment?.name,
        item.senderName
      ]
        .join(" ")
        .toLowerCase()
        .includes(messageSearch.toLowerCase());

      const matchesDate = filterDate
        ? new Date(item.date).toLocaleDateString(
            "en-CA"
          ) === filterDate
        : true;

      return matchesSearch && matchesDate;
    }
  );

  // =====================================
  // FILTER USERS
  // =====================================

  const filteredUsers = users.filter((user) => {
    return [
      user.username,
      user.email,
      user.phone
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // =====================================
  // UNREAD COUNT
  // =====================================

  const getUnreadCount = (userId) => {
    return messages.filter(
      (item) =>
        String(item.userId) === String(userId) &&
        item.sender === "user" &&
        item.status !== "seen"
    ).length;
  };

  // =====================================
  // LAST MESSAGE
  // =====================================

  const getLastMessage = (userId) => {
    const userMessages = messages.filter(
      (item) =>
        String(item.userId) === String(userId)
    );

    return userMessages[userMessages.length - 1];
  };

  // =====================================
  // ADMIN LOGIN CHECK
  // =====================================

  if (!adminId) {
    return (
      <div className="container py-5 text-center">
        <h5>Admin login details nahi mile.</h5>

        <p className="text-muted">
          Please admin account se dobara login karo.
        </p>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* PAGE HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#102D4F" }}
          >
            Manage Messages
          </h3>

          <p
            className="text-white mb-0"
            style={{
              backgroundColor: "#087FC4",
              padding: "10px",
              borderRadius: "5px"
            }}
          >
            Manage customer conversations
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            fetchData();
            fetchAdminProfile();
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{ minHeight: "650px" }}
      >
        <div className="row g-0">

          {/* USER SIDEBAR */}

          <div
            className={`col-md-4 col-lg-3 border-end ${
              selectedUser ? "d-none d-md-block" : ""
            }`}
          >
            <div
              className="p-3 text-white"
              style={{ backgroundColor: "#102D4F" }}
            >
              <div className="d-flex align-items-center gap-2">
                {renderAdminAvatar(45)}

                <div className="overflow-hidden">
                  <h6 className="mb-1 text-truncate">
                    {adminName}
                  </h6>

                  <small className="text-white-50">
                    Admin Account
                  </small>
                </div>
              </div>

              {adminEmail && (
                <small className="d-block mt-2 text-white-50 text-truncate">
                  <FaEnvelope className="me-1" />
                  {adminEmail}
                </small>
              )}
            </div>

            {/* USER SEARCH */}

            <div className="p-3 border-bottom">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* USER LIST */}

            <div
              style={{
                height: "550px",
                overflowY: "auto"
              }}
            >
              {loading ? (
                <p className="text-center text-muted mt-4">
                  Loading users...
                </p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-muted mt-4">
                  No users found.
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const lastMessage = getLastMessage(user.id);

                  const unreadCount =
                    getUnreadCount(user.id);

                  const active =
                    selectedUser &&
                    String(selectedUser.id) ===
                      String(user.id);

                  const userWithPhoto =
                    getUserWithPhoto(user);

                  return (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => openChat(user)}
                      className="w-100 text-start border-0 border-bottom p-3"
                      style={{
                        backgroundColor: active
                          ? "#eaf5ff"
                          : "#ffffff"
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">

                        <UserAvatar
                          user={userWithPhoto}
                          size={43}
                        />

                        <div className="flex-grow-1 overflow-hidden">

                          <div className="d-flex justify-content-between gap-2">
                            <strong className="text-truncate">
                              {user.username || "User"}
                            </strong>

                            {unreadCount > 0 && (
                              <span className="badge bg-success">
                                {unreadCount}
                              </span>
                            )}
                          </div>

                          <small className="text-muted d-block text-truncate">
                            {lastMessage
                              ? lastMessage.message ||
                                lastMessage.attachment?.name ||
                                "Attachment"
                              : user.email || "No messages yet"}
                          </small>

                          {lastMessage && (
                            <small className="text-muted">
                              {formatDate(lastMessage.date)}
                            </small>
                          )}

                          {user.blocked && (
                            <span className="badge bg-danger mt-1">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CHAT SECTION */}

          <div
            className={`col-md-8 col-lg-9 ${
              !selectedUser ? "d-none d-md-block" : ""
            }`}
          >
            {!selectedUser ? (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted p-4">
                <FaComments size={65} />

                <h5 className="mt-3">
                  Select a conversation
                </h5>

                <p>
                  Select a user to start chatting.
                </p>
              </div>
            ) : (
              <>
                {/* CHAT HEADER */}

                <div
                  className="d-flex align-items-center gap-3 p-3 text-white"
                  style={{ backgroundColor: "#102D4F" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-light d-md-none"
                    onClick={closeChat}
                  >
                    <FaArrowLeft />
                  </button>

                  <UserAvatar
                    user={getUserWithPhoto(selectedUser)}
                    size={43}
                  />

                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="mb-1 text-truncate">
                      {selectedUser.username || "User"}
                    </h6>

                    <small className="text-white-50">
                      {selectedUser.email ||
                        selectedUser.phone ||
                        "Customer"}
                    </small>
                  </div>

                  {/* USER STATUS AND THREE DOTS */}

                  <div className="d-flex align-items-center gap-2 flex-shrink-0">

                    {selectedUser.blocked ? (
                      <span className="badge bg-danger">
                        Blocked
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        Customer
                      </span>
                    )}

                    <div
                      className="position-relative"
                      onBlur={(e) => {
                        if (
                          !e.currentTarget.contains(
                            e.relatedTarget
                          )
                        ) {
                          setShowUserMenu(false);
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        title="User Options"
                        onClick={() =>
                          setShowUserMenu((previous) => !previous)
                        }
                      >
                        <FaEllipsisV />
                      </button>

                      {showUserMenu && (
                        <div
                          className="position-absolute end-0 mt-2 bg-white shadow rounded py-2"
                          style={{
                            width: "205px",
                            zIndex: 1050
                          }}
                        >
                          <button
                            type="button"
                            className="dropdown-item px-3 py-2 text-dark"
                            onClick={() => {
                              setShowUserDetails(true);
                              setShowUserMenu(false);
                            }}
                          >
                            <FaEye className="me-2 text-primary" />
                            View User Details
                          </button>

                          <hr className="my-2" />

                          <button
                            type="button"
                            className="dropdown-item px-3 py-2 text-dark"
                            disabled={userActionLoading}
                            onClick={toggleBlockUser}
                          >
                            {selectedUser.blocked ? (
                              <>
                                <FaUserCheck className="me-2 text-success" />
                                Unblock User
                              </>
                            ) : (
                              <>
                                <FaBan className="me-2 text-warning" />
                                Block User
                              </>
                            )}
                          </button>

                          <hr className="my-2" />

                          <button
                            type="button"
                            className="dropdown-item px-3 py-2 text-danger"
                            disabled={userActionLoading}
                            onClick={deleteUser}
                          >
                            <FaTrash className="me-2" />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEARCH */}

                <div className="p-3 border-bottom">
                  <div className="row g-2">
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search messages..."
                        value={messageSearch}
                        onChange={(e) =>
                          setMessageSearch(e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="date"
                        className="form-control"
                        value={filterDate}
                        onChange={(e) =>
                          setFilterDate(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CHAT MESSAGES */}

                <div
                  className="p-3 bg-light"
                  style={{
                    height: "390px",
                    overflowY: "auto"
                  }}
                >
                  {filteredMessages.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                      <FaComments size={40} />

                      <p className="mt-3">
                        No messages found.
                      </p>
                    </div>
                  ) : (
                    filteredMessages.map((item) => {
                      const isAdmin =
                        item.sender === "admin";

                      const messageAdminName =
                        item.senderName &&
                        item.senderName !== "Converlink Admin"
                          ? item.senderName
                          : adminName;

                      const messageAdminPhoto =
                        item.senderPhoto || adminPhoto;

                      const messageUser =
                        users.find(
                          (user) =>
                            String(user.id) ===
                            String(item.userId)
                        ) || selectedUser;

                      const userPhoto =
                        item.senderPhoto ||
                        getUserPhoto(messageUser);

                      return (
                        <div
                          key={item.id}
                          className={`d-flex mb-3 ${
                            isAdmin
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >

                          {!isAdmin && (
                            <UserAvatar
                              user={{
                                ...messageUser,
                                profilePhoto: userPhoto,
                                senderName:
                                  item.senderName ||
                                  messageUser?.username
                              }}
                              size={32}
                            />
                          )}

                          <div
                            className="p-3 shadow-sm"
                            style={{
                              maxWidth: "78%",
                              minWidth: "130px",
                              borderRadius: "14px",
                              backgroundColor: isAdmin
                                ? "#087FC4"
                                : "#ffffff",
                              color: isAdmin
                                ? "#ffffff"
                                : "#212529"
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-2">

                              {isAdmin && (
                                <div
                                  className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0"
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    backgroundColor: "#ffffff",
                                    color: "#087FC4",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                  }}
                                >
                                  {messageAdminPhoto ? (
                                    <img
                                      src={messageAdminPhoto}
                                      alt={messageAdminName}
                                      onError={(e) => {
                                        e.currentTarget.style.display =
                                          "none";
                                        e.currentTarget.parentElement.textContent =
                                          messageAdminName
                                            .charAt(0)
                                            .toUpperCase();
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                      }}
                                    />
                                  ) : (
                                    messageAdminName
                                      .charAt(0)
                                      .toUpperCase()
                                  )}
                                </div>
                              )}

                              <small className="fw-bold">
                                {isAdmin
                                  ? messageAdminName
                                  : item.senderName ||
                                    selectedUser.username ||
                                    "User"}
                              </small>
                            </div>

                            <div
                              style={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere"
                              }}
                            >
                              {item.message}
                            </div>

                            {renderAttachment(item.attachment)}

                            <div className="d-flex justify-content-end align-items-center gap-2 mt-2">

                              <small
                                style={{
                                  fontSize: "11px",
                                  opacity: 0.8
                                }}
                              >
                                {formatDate(item.date)}
                              </small>

                              {isAdmin && (
                                <small title={item.status}>
                                  {item.status === "seen"
                                    ? "✓✓ Seen"
                                    : item.status === "delivered"
                                    ? "✓✓ Delivered"
                                    : "✓ Sent"}
                                </small>
                              )}

                              {isAdmin && (
                                <button
                                  type="button"
                                  className="btn btn-sm p-0 text-white"
                                  title="Delete message"
                                  onClick={() =>
                                    deleteMessage(item)
                                  }
                                >
                                  <FaTrash size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {userTyping && (
                    <div className="small text-muted">
                      {selectedUser.username || "User"} is typing...
                    </div>
                  )}
                </div>

                {/* MESSAGE INPUT */}

                <div className="p-3 border-top">

                  {/* EMOJIS */}

                  <div className="d-flex gap-2 mb-2 flex-wrap">
                    {[
                      "😀", "😂", "❤️", "👍", "🙏",
                      "😊", "😍", "🥰", "😉", "😎",
                      "🤔", "😭", "😡", "👏", "💙",
                      "🔥", "🎉", "👋", "🤝", "💯"
                    ].map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        type="button"
                        className="btn btn-light border btn-sm"
                        onClick={() => addEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* ATTACHMENT PREVIEW */}

                  {attachment && (
                    <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
                      <span className="text-truncate">
                        <FaPaperclip className="me-2" />

                        {attachment.name}

                        {" "}({formatSize(attachment.size)})
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

                  {/* SEND FORM */}

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
                        placeholder={
                          selectedUser.blocked
                            ? "This user is blocked"
                            : "Write your reply..."
                        }
                        value={reply}
                        disabled={selectedUser.blocked}
                        onChange={(e) => {
                          setReply(e.target.value);

                          updateTyping(
                            Boolean(e.target.value.trim())
                          );
                        }}
                      />

                      <button
                        type="submit"
                        className="btn text-white py-3 px-4"
                        style={{
                          backgroundColor: "#087FC4"
                        }}
                        disabled={sending || selectedUser.blocked}
                      >
                        {sending ? "..." : <FaPaperPlane />}
                      </button>
                    </div>
                  </form>

                  <small className="text-muted">
                    Maximum file selection size: 100 MB
                  </small>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          USER DETAILS MODAL
      ===================================== */}

      {showUserDetails && selectedUser && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 2000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUserDetails(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">

              {/* MODAL HEADER */}

              <div
                className="modal-header text-white"
                style={{ backgroundColor: "#102D4F" }}
              >
                <h5 className="modal-title">
                  <FaUser className="me-2" />
                  User Details
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowUserDetails(false)}
                />
              </div>

              {/* MODAL BODY */}

              <div className="modal-body">

                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center">
                    <UserAvatar
                      user={getUserWithPhoto(selectedUser)}
                      size={95}
                    />
                  </div>

                  <h5 className="mt-3 mb-1">
                    {selectedUser.username || "N/A"}
                  </h5>

                  <span
                    className={`badge ${
                      selectedUser.blocked
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {selectedUser.blocked
                      ? "Blocked"
                      : "Active"}
                  </span>
                </div>

                <div className="row g-3">

                  {[
                    {
                      label: "User ID",
                      value: selectedUser.id
                    },
                    {
                      label: "Full Name",
                      value: selectedUser.username
                    },
                    {
                      label: "Email",
                      value: selectedUser.email
                    },
                    {
                      label: "Phone",
                      value: selectedUser.phone
                    },
                    {
                      label: "Gender",
                      value: selectedUser.gender
                    },
                    {
                      label: "Address",
                      value:
                        getUserProfile(selectedUser)?.address ||
                        selectedUser.address
                    },
                    {
                      label: "Role",
                      value: selectedUser.role
                    },
                    {
                      label: "Comments",
                      value: selectedUser.comments
                    }
                  ].map((detail) => (
                    <div
                      className="col-md-6"
                      key={detail.label}
                    >
                      <div className="border rounded p-3 h-100">
                        <small className="text-muted d-block mb-1">
                          {detail.label}
                        </small>

                        <strong className="text-break">
                          {detail.value || "Not Available"}
                        </strong>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserDetails(false)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowUserDetails(false);
                    setShowUserMenu(true);
                  }}
                >
                  User Options
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMessages;
