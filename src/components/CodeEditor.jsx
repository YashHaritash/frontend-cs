import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom"; // Make sure you're using useParams to extract sessionId
import io from "socket.io-client";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const CodeEditor = () => {
  const { sessionId } = useParams(); // Capture sessionId from the URL
  const [code, setCode] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Join the session room
    newSocket.emit("joinSession", sessionId);

    // Listen for code updates from the server
    newSocket.on("code", (updatedCode) => {
      setCode(updatedCode);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket) {
      socket.emit("code", { sessionId, code: newCode });
    }
  };

  return (
    <>
      <h3>Session Id - {sessionId} </h3>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={code}
        onChange={handleCodeChange}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useWorker: false }}
        width="100%"
        height="500px"
      />
    </>
  );
};

export default CodeEditor;
