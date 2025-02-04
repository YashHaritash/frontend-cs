import React, { useState, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

const ChatBox = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const name = localStorage.getItem("name") || "Anonymous";

  useEffect(() => {
    if (!sessionId) return;

    socket.emit("joinSession", sessionId);

    socket.on("chat", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat");
    };
  }, [sessionId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (message.trim() === "" || !sessionId) return;

    const chatMessage = { name, message, sessionId };
    socket.emit("chat", chatMessage); // Let the server broadcast it

    setMessage(""); // Clear input field
  };

  return (
    <>
      <button
        className="btn btn-primary position-fixed d-flex align-items-center justify-content-center rounded-circle"
        style={{
          bottom: "10px",
          right: "20px",
          zIndex: 1050,
          width: "50px",
          height: "50px",
          padding: 0,
        }}
        onClick={toggleChat}
      >
        <BsChatDots size={24} />
      </button>

      <div
        className="position-fixed bg-dark text-white p-3 shadow-lg"
        style={{
          width: "300px",
          height: "400px",
          bottom: "80px",
          right: isOpen ? "20px" : "-320px",
          transition: "right 0.3s ease-in-out",
          zIndex: 1049,
          borderRadius: "10px",
        }}
      >
        <h5>Chat</h5>
        <div
          className="border p-2 bg-light text-dark"
          style={{ height: "300px", overflowY: "auto" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.name}:</strong> {msg.message}
            </div>
          ))}
        </div>

        <div className="d-flex mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-success ms-2" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
