import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    try {
      const payload = {
        email,
        password,
      };
      const response = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const lightTheme = {
    backgroundColor: "#f8f9fa",
    color: "#000",
  };

  const darkTheme = {
    backgroundColor: "#121212",
    color: "#e0e0e0",
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "calc(100vh - 56px)", // Assuming navbar height is 60px
        ...theme,
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "300px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
          color: theme.color,
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {/* <button
          onClick={toggleDarkMode}
          className="btn btn-secondary mb-3"
        >
          Toggle {isDarkMode ? "Light" : "Dark"} Mode
        </button> */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: isDarkMode ? "gray" : "#fff",
                color: theme.color,
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: isDarkMode ? "gray" : "#fff",
                color: theme.color,
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: isDarkMode ? "#bb86fc" : "#007bff",
              borderColor: isDarkMode ? "#bb86fc" : "#007bff",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
