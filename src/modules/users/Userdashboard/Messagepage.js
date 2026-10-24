import React, { useState } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaPaperPlane,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";


const initialMessages = [
  {
    id: 1,
    name: "Converlink Team",
    subject: "Welcome to Converlink",
    message:
      "Welcome to Converlink Engineering Pvt. Ltd. Thank you for connecting with us.",
    time: "10:30 AM",
    unread: true
  },
  {
    id: 2,
    name: "Service Department",
    subject: "Electrical Services",
    message:
      "Please contact our team for electrical installation and maintenance enquiries.",
    time: "Yesterday",
    unread: true
  },
  {
    id: 3,
    name: "Support Team",
    subject: "Contact Support",
    message:
      "Our support team is available to help with your questions and enquiries.",
    time: "20 Oct",
    unread: false
  }
];

function MessagePage() {
  const [messages, setMessages] = useState(initialMessages);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  const filteredMessages = messages.filter((item) =>
    `${item.name} ${item.subject} ${item.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openMessage = (item) => {
    setSelected(item);
    setMessages((previous) =>
      previous.map((message) =>
        message.id === item.id
          ? { ...message, unread: false }
          : message
      )
    );
  };

  const deleteMessage = (id) => {
    setMessages((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (selected?.id === id) {
      setSelected(null);
    }
  };

  const sendReply = (event) => {
    event.preventDefault();

    if (!reply.trim()) return;

    alert("Demo only: connect a backend to send this message.");
    setReply("");
  };

  return (
    <div className="message-page">
      <div className="container py-5">

        <Link to="/landing/home" className="message-back">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="message-heading">
          <div>
            <h2><FaEnvelope /> Messages</h2>
            <p>Manage your messages and company enquiries.</p>
          </div>

          <span className="message-count">
            {messages.filter((item) => item.unread).length} Unread
          </span>
        </div>

        <div className="message-layout">

          {/* Message List */}
          <div className="message-list-panel">
            <div className="message-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {filteredMessages.map((item) => (
              <div
                key={item.id}
                className={`message-list-item ${
                  selected?.id === item.id ? "selected" : ""
                } ${item.unread ? "unread" : ""}`}
              >
                <button
                  className="message-select"
                  onClick={() => openMessage(item)}
                >
                  <div className="message-avatar">
                    {item.name.charAt(0)}
                  </div>

                  <div className="message-preview">
                    <div className="message-name-row">
                      <strong>{item.name}</strong>
                      {item.unread && <span className="message-dot" />}
                    </div>

                    <small>{item.subject}</small>
                    <p>{item.message}</p>
                    <span className="message-time">{item.time}</span>
                  </div>
                </button>

                <button
                  className="message-delete"
                  onClick={() => deleteMessage(item.id)}
                  aria-label={`Delete message from ${item.name}`}
                  title="Delete message"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <p className="message-empty">No messages found.</p>
            )}
          </div>

          {/* Message Details */}
          <div className="message-detail-panel">
            {selected ? (
              <>
                <div className="message-detail-header">
                  <div className="message-avatar">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h5>{selected.name}</h5>
                    <small>{selected.time}</small>
                  </div>

                  <button
                    className="message-delete ms-auto"
                    onClick={() => deleteMessage(selected.id)}
                    aria-label="Delete selected message"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="message-body">
                  <h4>{selected.subject}</h4>
                  <p>{selected.message}</p>
                </div>

                <form className="message-reply" onSubmit={sendReply}>
                  <label htmlFor="messageReply">Reply</label>
                  <textarea
                    id="messageReply"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Write your message..."
                    rows="4"
                  />

                  <button type="submit">
                    <FaPaperPlane /> Send Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="message-placeholder">
                <FaEnvelopeOpen />
                <h4>Select a Message</h4>
                <p>Choose a message from the list to read it.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MessagePage;