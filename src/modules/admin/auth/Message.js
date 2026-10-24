
import React, { useState } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaUserCircle,
  FaEnvelope,
  FaCheckDouble,
  FaPhone,
  FaEllipsisV
} from "react-icons/fa";

const initialContacts = [
  {
    id: 1,
    name: "Rahul Sharma",
    subject: "Electrical Installation",
    lastMessage: "Please share the quotation.",
    time: "10:45 AM",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Priya Verma",
    subject: "Interior Designing",
    lastMessage: "Thank you for the update.",
    time: "09:30 AM",
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: "Amit Kumar",
    subject: "Maintenance Service",
    lastMessage: "When can the work start?",
    time: "Yesterday",
    unread: 1,
    online: false
  },
  {
    id: 4,
    name: "Neha Singh",
    subject: "Project Enquiry",
    lastMessage: "I have sent the details.",
    time: "Yesterday",
    unread: 0,
    online: false
  }
];

const initialMessages = {
  1: [
    {
      id: 1,
      text: "Hello, I need electrical installation services for my office.",
      sender: "customer",
      time: "10:30 AM"
    },
    {
      id: 2,
      text: "Hello Rahul! Thank you for contacting Converlink Engineering.",
      sender: "admin",
      time: "10:35 AM"
    },
    {
      id: 3,
      text: "Please share the quotation.",
      sender: "customer",
      time: "10:45 AM"
    }
  ],
  2: [
    {
      id: 1,
      text: "I want interior designing services for my office.",
      sender: "customer",
      time: "09:15 AM"
    },
    {
      id: 2,
      text: "Thank you for the update.",
      sender: "customer",
      time: "09:30 AM"
    }
  ],
  3: [
    {
      id: 1,
      text: "When can the maintenance work start?",
      sender: "customer",
      time: "Yesterday"
    }
  ],
  4: [
    {
      id: 1,
      text: "I have sent the details.",
      sender: "customer",
      time: "Yesterday"
    }
  ]
};

function Message() {
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedId
  );

  const currentMessages = messages[selectedId] || [];

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.subject}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openConversation = (id) => {
    setSelectedId(id);
    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === id ? { ...contact, unread: 0 } : contact
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const text = messageText.trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: "admin",
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setMessages((previous) => ({
      ...previous,
      [selectedId]: [...(previous[selectedId] || []), newMessage]
    }));

    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === selectedId
          ? { ...contact, lastMessage: text, time: newMessage.time }
          : contact
      )
    );

    setMessageText("");
  };

  return (
    <div className="admin-message-page">
      <div className="message-page-heading">
        <div>
          <h2>Messages</h2>
          <p>Manage conversations with your customers.</p>
        </div>

        <div className="message-count">
          <FaEnvelope />
          {contacts.reduce((total, contact) => total + contact.unread, 0)} Unread
        </div>
      </div>

      <div className="message-workspace">
        {/* Left contacts panel */}
        <aside className="message-contacts">
          <div className="contacts-header">
            <h3>Customer Messages</h3>
            <span>{contacts.length}</span>
          </div>

          <div className="contacts-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.length ? (
              filteredContacts.map((contact) => (
                <button
                  type="button"
                  key={contact.id}
                  className={`contact-item ${
                    selectedId === contact.id ? "selected" : ""
                  }`}
                  onClick={() => openConversation(contact.id)}
                >
                  <div className="contact-avatar">
                    <FaUserCircle />
                    {contact.online && <span className="online-dot" />}
                  </div>

                  <div className="contact-info">
                    <div className="contact-name-row">
                      <strong>{contact.name}</strong>
                      <small>{contact.time}</small>
                    </div>

                    <span className="contact-subject">{contact.subject}</span>
                    <p>{contact.lastMessage}</p>
                  </div>

                  {contact.unread > 0 && (
                    <span className="unread-count">{contact.unread}</span>
                  )}
                </button>
              ))
            ) : (
              <p className="no-contacts">No customers found.</p>
            )}
          </div>
        </aside>

        {/* Right chat panel */}
        <section className="message-chat">
          {selectedContact ? (
            <>
              <div className="chat-header">
                <div className="chat-contact-avatar">
                  <FaUserCircle />
                </div>

                <div className="chat-contact-info">
                  <h3>{selectedContact.name}</h3>
                  <p>
                    {selectedContact.online ? "Online" : "Customer"} ·{" "}
                    {selectedContact.subject}
                  </p>
                </div>

                <div className="chat-header-actions">
                  <button type="button" title="Phone">
                    <FaPhone />
                  </button>
                  <button type="button" title="More options">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                <div className="chat-date-label">Conversation</div>

                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message-row ${
                      message.sender === "admin" ? "sent" : "received"
                    }`}
                  >
                    <div className="chat-bubble">
                      <p>{message.text}</p>
                      <span>
                        {message.time}
                        {message.sender === "admin" && (
                          <FaCheckDouble className="message-tick" />
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-composer" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  aria-label="Type your message"
                />

                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!messageText.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <FaEnvelope />
              <h3>Select a conversation</h3>
              <p>Choose a customer from the list to view messages.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Message;
