import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/login.module.css";
import { ToastContainer, toast } from 'react-toastify';


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    console.log(formData)
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const formErrors = validate(formData)
    setError(formErrors)
    console.log(error)
    
    // Only proceed if there are no validation errors
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {

      const response = await axios.post("http://localhost:8081/api/auth/register", formData);
      console.log(response)

      toast.success("Register successful!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => navigate("/signin", { replace: true })
      });

    } catch (error) {
      if (error.response) {
            switch (error.response.status) {
              case 403:
                toast.error("Email is registerd");
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

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/; // Example: 10-digit phone number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!values.name.trim()) {
      errors.name = "Full Name is Required";
    }

    if (!values.email) {
      errors.email = "Email is Required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid format!"; // Fixed typo
    }

    if (!values.phone) {
      errors.phone = "Phone Number is Required";
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = "Phone must be a 10-digit number";
    }

    if (!values.password) {
      errors.password = "Password is Required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }else if(!passwordRegex.test(values.password)){
     toast.error("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character");
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is Required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  }

  return (
    
    <div className={styles.containerReg}>
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
      <h1 className={styles.heading}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          id="name"
          className={styles.input}
          value={formData.name}
          onChange={handleChange}
        />
        {error.name && <p className={styles.error}>{error.name}</p>}
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
        />
        {error.email && <p className={styles.error}>{error.email}</p>}
        <label>Contact Number</label>
        <input
          type="tel"
          placeholder="Phone"
          id="phone"
          className={styles.input}
          value={formData.phone}
          onChange={handleChange}
        />
        {error.phone && <p className={styles.error}>{error.phone}</p>}
        <label>Password</label>
        <input
          type="password"
          placeholder="Password Ex: 219541@Com"
          id="password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
        />
        {error.password && <p className={styles.error}>{error.password}</p>}
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {error.confirmPassword && <p className={styles.error}>{error.confirmPassword}</p>}
        <button disabled={loading} className={styles.button}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register