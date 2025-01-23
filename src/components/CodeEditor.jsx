import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import axios from "axios";

const CodeEditor = () => {
  const { sessionId } = useParams();
  const [code, setCode] = useState("");
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript"); // State for selected language

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        newSocket.emit("joinSession", sessionId);
        newSocket.on("code", (updatedCode) => {
          setCode(updatedCode);
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
    if (socket) {
      socket.emit("code", { sessionId, code: newCode });
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

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Session Id - {sessionId}</h3>
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
        </select>
      </div>

      <AceEditor
        mode={language}
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
