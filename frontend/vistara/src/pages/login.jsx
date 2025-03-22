import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/login.module.css";

function Login() {
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

      const response = await axios.post("http://localhost:8080/api/auth/login", formData);
      console.log(response.status)

      if (response.status === 403) {
        setError("invalid credentials");
        return;
      }
      
      navigate("/");

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className={styles.input}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className={styles.input}
          onChange={handleChange}
        />
        <button disabled={loading} className={styles.button}>
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      {/* <div className="link-container">
        <p>Don’t have an account?</p>
        <Link to="/signup" className="signup-link">
          Sign Up
        </Link>
      </div> */}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Login