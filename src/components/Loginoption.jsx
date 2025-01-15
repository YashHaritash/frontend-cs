import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Loginoption() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const token = localStorage.getItem("token");
  return token ? (
    <>
      <Link
        type="button"
        className="btn btn-outline-danger mx-2 border-2"
        onClick={handleSignOut}
      >
        LogOut
      </Link>
    </>
  ) : (
    <>
      <Link
        type="button"
        className="btn btn-outline-warning mx-1 border-2"
        to="/signup"
      >
        SignUp
      </Link>
      <Link
        type="button"
        className="btn btn-outline-info mx-1 border-2"
        to="login"
      >
        Login
      </Link>
    </>
  );
}

export default Loginoption;
