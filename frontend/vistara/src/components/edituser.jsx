import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Added missing CSS import

function EditUser({ userId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/user/7`);
        console.log(response.data);
        const { displayUsername = "", email = "", phone = "" } = response.data; // Default to empty string
        setFormData({ displayUsername, email, phone, password: "" });
      } catch (err) {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value || "", // Ensure value is a string
    });
    setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  };

  const validate = (data) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (data.displayUsername && !data.displayUsername.trim()) { 
      errors.displayUsername = "Name cannot be empty";
    }

    if (data.email && !emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }

    if (data.phone && !phoneRegex.test(data.phone)) {
      errors.phone = "Phone must be a 10-digit number";
    }

    if (data.password) {
      if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (!passwordRegex.test(data.password)) {
        errors.password =
          "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const updates = {};
    Object.keys(formData).forEach((key) => {
      const value = String(formData[key] || ""); // Convert to string, default to empty
      if (value.trim() !== "") {
        updates[key] = value;
      }
    });

    if (Object.keys(updates).length === 0) {
      toast.error("Please enter at least one field to update");
      setLoading(false);
      return;
    }

    const validationErrors = validate(updates);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/auth/update/7`,
        updates
      );
      toast.success("User updated successfully!");
      setFormData({
        name: response.data.displayUsername || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        password: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data || "Failed to update user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Full Name</label>
        <input
          type="text"
          id="name" // Changed from 'name' to match formData
          placeholder="Enter new name (optional)"
          className={styles.input}
          value={formData.displayUsername}
          onChange={handleChange}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>} {/* Updated key */}

        <label>Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter new email (optional)"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label>Phone</label>
        <input
          type="tel"
          id="phone"
          placeholder="Enter new phone (optional)"
          className={styles.input}
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <label>Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter new password (optional)"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default EditUser;