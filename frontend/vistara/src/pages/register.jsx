import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before submitting

    try {

      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      console.log(response.status)

      if (response.status === 403) {
        setError("invalid credentials");
        return;
      }
      
      navigate("/signin");

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Create Account</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          id="name"
          className="input"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="input"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="input"
          onChange={handleChange}
        />
        <button disabled={loading} className="button">
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      {/* <div className="link-container">
        <p>Don’t have an account?</p>
        <Link to="/signup" className="signup-link">
          Sign Up
        </Link>
      </div> */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register