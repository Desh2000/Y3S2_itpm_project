import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [submitStatus,setSubmitStatus] = useState(false);

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
      console.log("1")
      return;
    }

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

  const validate = (values) => {
    const errors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if(!values.fullname.trim()){
      errors.fullname = "Full Name is Required";
    }

    if(!values.email){
      errors.email = "Email is Required";
    } else if(!emailRegex.test(values.email)){
      errors.email = "This is not a valiid format!"
    }

    if(!values.password){
      errors.password = "Password is Required";
    }

    if(!values.confirmPassword){
      errors.confirmPassword = "Confirm Password is Required";
    }

    if(!values.phone){
      errors.phone = "Phone Number is Required";
    }
    
    return errors;
  }

  return (
    <div className="container">
      <h1 className="heading">Create Account</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          id="fullname"
          className="input"
          value={formData.fullname}
          onChange={handleChange}
        />
        {error.fullname && <p className="error">{error.fullname}</p>}
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="input"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Phone</label>
        <input
          type="tel"
          placeholder="Phone"
          id="phone"
          className="input"
          value={formData.phone}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="input"
          value={formData.password}
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          className="input"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button disabled={loading} className="button">
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register