import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import axios from "axios";
import m from "ace-builds/src-noconflict/mode-javascript";
import ChatBox from "./ChatBox";

const CodeEditor = () => {
  const [mySet, setMySet] = useState(new Set());
  const { sessionId } = useParams();
  const [code, setCode] = useState("");
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript"); // State for selected language

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLeaveSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(userId);
      console.log(session._id);

      await fetch(`http://localhost:3000/session/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ sessionId: session._id, userId }),
      });
      toast.success("Left session successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error leaving session");
      console.error("Error leaving session:", error);
    }
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        newSocket.emit("joinSession", sessionId);
        newSocket.on("code", (updatedCode) => {
          setCode(updatedCode);
        });
        // Store the last typing timestamp for each user
        const typingTimestamps = new Map();

        newSocket.on("name", (name) => {
          console.log("Name:", name);

          // Add the name to the set if it's not already there
          setMySet((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(name);
            return newSet;
          });

          // Update the typing timestamp whenever the user types
          typingTimestamps.set(name, Date.now());

          // Periodically check for users who haven't typed in the last 5 seconds
          const intervalId = setInterval(() => {
            const currentTime = Date.now();

            typingTimestamps.forEach((timestamp, userName) => {
              // If the user hasn't typed in the last 5 seconds, remove them from the set
              if (currentTime - timestamp > 5000) {
                setMySet((prevSet) => {
                  const newSet = new Set(prevSet);
                  newSet.delete(userName);
                  return newSet;
                });
                typingTimestamps.delete(userName); // Remove user from timestamp tracking
              }
            });
          }, 5000);

          // Clear the interval when the socket disconnects or stops using typing signals
          newSocket.on("disconnect", () => {
            clearInterval(intervalId);
          });
        });
        const response = await axios.get(
          `http://localhost:3000/session/details/${sessionId}`,
          {
            headers: { Authorization: token },
            withCredentials: true,
          }
        );
        const sessionDetails = response.data;
        setSession(sessionDetails);

        const codeResponse = await axios.get(
          `http://localhost:3000/code/getCode/${sessionDetails._id}`,
          {
            headers: { Authorization: token },
            withCredentials: true,
          }
        );
        setCode(codeResponse.data.code);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [sessionId, token]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const name = localStorage.getItem("name");
    if (socket) {
      socket.emit("code", { sessionId, code: newCode, name });
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value); // Update selected language
    setOutput(""); // Clear output when language changes
  };

  const handleRunCode = async () => {
    if (language === "c_cpp") {
      try {
        const response = await axios.post("http://localhost:3000/run-cpp", {
          code,
        });
        setOutput(response.data.output || "No output");
      } catch (error) {
        setOutput(error.response?.data?.error || "Error running code");
      }
    } else if (language === "javascript") {
      // Existing JavaScript execution logic
      const logMessages = [];
      const originalConsoleLog = console.log;

      console.log = (message) => {
        logMessages.push(`Log: ${message}`);
        originalConsoleLog(message);
      };

      try {
        const result = new Function(code)();
        if (result !== undefined) {
          logMessages.push(`Result: ${result}`);
        }
      } catch (error) {
        logMessages.push(`Error caught: ${error.message}`);
      } finally {
        setOutput(logMessages.join("\n"));
        console.log = originalConsoleLog;
      }
    } else if (language === "python") {
      try {
        const response = await axios.post("http://localhost:3000/run-python", {
          code,
        });
        setOutput(response.data.output || "No output");
      } catch (error) {
        setOutput(error.response?.data?.error || "Error running code");
      }
    } else if (language === "c") {
      try {
        const response = await axios.post("http://localhost:3000/run-c", {
          code,
        });
        setOutput(response.data.output || "No output");
      } catch (error) {
        setOutput(error.response?.data?.error || "Error running code");
      }
    } else if (language === "java") {
      try {
        const response = await axios.post("http://localhost:3000/run-java", {
          code,
        });
        setOutput(response.data.output || "No output");
      } catch (error) {
        setOutput(error.response?.data?.error || "Error running code");
      }
    } else {
      setOutput("Run functionality for this language is not implemented yet.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3000/code/update/${session._id}`,
        { code },
        {
          headers: { Authorization: token },
          withCredentials: true,
        }
      );
      toast.success("Code saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error("Error saving code. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying code:", err);
        toast.error("Failed to copy code. Please try again.");
      });
  };

  const numberOfUsers = mySet.size;

  return (
    <div style={styles.container}>
      {/* <h3 style={styles.header}></h3> */}
      <ChatBox sessionId={sessionId} />
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleLeaveSession}
          style={{ position: "absolute", top: 70, right: 20 }}
        >
          X
        </button>
        <button
          type="button"
          className="btn btn-primary my-1 px-4"
          onClick={() => {
            navigator.clipboard
              .writeText(sessionId)
              .then(() => {
                toast.success("Session Id copied to clipboard!");
              })
              .catch((err) => {
                console.error("Error copying session id:", err);
                toast.error("Failed to copy session id. Please try again.");
              });
          }}
        >
          Session Id - {sessionId}
        </button>
      </div>
      <div className="mb-3">
        <label htmlFor="language" className="form-label">
          Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="form-select"
        >
          <option value="javascript">JavaScript</option>
          <option value="c_cpp">C++</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="java">Java</option>
        </select>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <div className="d-flex align-items-center">
          {Array.from(mySet).map((name) => (
            <span key={name + " "} className="badge bg-secondary me-2">
              {name}
            </span>
          ))}

          {/* Ensure the space is always there to prevent layout shift */}
          <span className="ms-2">
            {numberOfUsers === 0 ? (
              <span>&nbsp;</span> // Render a non-breaking space if no users are typing
            ) : numberOfUsers === 1 ? (
              "is typing"
            ) : (
              "are typing"
            )}
          </span>
        </div>
      </div>
      <AceEditor
        mode={language == "c" ? "c_cpp" : language}
        theme="monokai"
        value={code}
        onChange={handleCodeChange}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useWorker: false }}
        width="100%"
        height="500px"
        style={styles.editor}
      />

      <div style={styles.buttonContainer}>
        <button onClick={handleRunCode} style={styles.runButton}>
          Run Code
        </button>
        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
        <button onClick={handleCopy} style={styles.copyButton} className="mx-2">
          Copy Code
        </button>
      </div>
      <div style={styles.outputContainer}>
        <h4 style={styles.outputHeader}>Output:</h4>
        <pre style={styles.output}>{output}</pre>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    margin: "0",
    padding: "20px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.5em",
  },
  editor: {
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  runButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "#fff",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  copyButton: {
    padding: "10px 20px",
    backgroundColor: "#FFC107",
    color: "#fff",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  outputContainer: {
    marginTop: "30px",
    backgroundColor: "#2a2a2a",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  outputHeader: {
    color: "#e5e5e5",
    marginBottom: "10px",
  },
  output: {
    backgroundColor: "#1e1e1e",
    color: "#e5e5e5",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "Courier New, monospace",
  },
};

export default CodeEditor;
