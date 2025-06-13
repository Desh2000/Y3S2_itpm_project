import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/login.module.css";
import { ToastContainer, toast } from 'react-toastify';

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
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post("http://localhost:8081/api/auth/login", formData);
      console.log(response.data)

      const userId = response.data.id; // Make sure 'id' exists in your response
      localStorage.setItem("userId", userId);
      console.log(localStorage.getItem("userId"));

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => {
          window.location.href = "http://localhost:3000/";
        }
      });

    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            toast.error("Invalid email or password");
            break;

          default:
            toast.error("An error occurred. Please try again");
        }
      } else {
        toast.error("Network error. Please check your connection");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
      <div className={styles.linkContainer}>
         Don’t have an account?{" "}	
        <Link to="/register" className={styles.signupLink}>
          Sign Up
        </Link>
      </div>
      {/* {error && <p className={styles.error}>{error}</p>} */}
    </div>
  );
}

export default Login