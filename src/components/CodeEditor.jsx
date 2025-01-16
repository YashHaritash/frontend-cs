import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import io from "socket.io-client";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const CodeEditor = ({ sessionId }) => {
  const [code, setCode] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Join the session room
    newSocket.emit("joinSession", sessionId);

    // Listen for code updates from the server
    newSocket.on("code", (updatedCode) => {
      setCode(updatedCode);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Emit the new code to the server
    if (socket) {
      socket.emit("code", { sessionId, code: newCode });
    }
  };

  return (
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
  );
};

export default CodeEditor;
