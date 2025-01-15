import React, { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const CodeEditor = () => {
  const [code, setCode] = useState("");

  return (
    <AceEditor
      mode="javascript"
      theme="monokai"
      value={code}
      onChange={(newCode) => setCode(newCode)}
      name="code-editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{ useWorker: false }}
    />
  );
};

export default CodeEditor;
