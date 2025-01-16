import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SessionManagement = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  // Define onCreateSession function
  const onCreateSession = () => {
    // Logic for creating a new session
    console.log("Creating new session...");
    // You can add the logic to create a new session and navigate to the editor page
    navigate(`/editor/${sessionId}`);
  };

  const handleJoinSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/session/join",
        { sessionId },
        {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        }
      );
      console.log("Joined session:", response.data);
      navigate(`/editor/${sessionId}`);
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#121212" }}
    >
      <div
        className="card p-4"
        style={{ width: "400px", backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
      >
        <h2 className="text-center mb-4">Session Management</h2>
        <div className="mb-3">
          <button
            className="btn w-100 mb-2"
            style={{ backgroundColor: "#bb86fc" }}
            onClick={onCreateSession} // Ensure onCreateSession is passed or defined
          >
            Create New Session
          </button>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            style={{
              backgroundColor: "gray",
              color: "#e0e0e0",
              borderColor: "#e0e0e0",
            }}
          />
        </div>
        <button
          className="btn w-100"
          style={{ backgroundColor: "#bb86fc" }}
          onClick={handleJoinSession}
        >
          Join Session
        </button>
      </div>
    </div>
  );
};

export default SessionManagement;
