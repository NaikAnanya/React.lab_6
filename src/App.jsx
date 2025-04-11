import React, { useState, useEffect, useCallback } from "react";
import DOMPurify from "dompurify";
import "./App.css";

const UniqueForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const sanitizeInput = (value) => DOMPurify.sanitize(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value.trim())
    }));
  };

  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (
      !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must include uppercase, number, and special character";
      valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmittedData(formData);
      setFormData({ username: "", email: "", password: "" });
    }
  };

  return (
    <div className="unique-form-container">
      <h2 className="unique-title">Registration Form</h2>
      <form onSubmit={handleSubmit} className="unique-form">
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "input-error" : ""}
            placeholder="Your username"
          />
          {errors.username && <span className="error-msg">{errors.username}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            placeholder="example@mail.com"
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            placeholder="Secure password"
          />
          {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>

        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>

        <button type="submit" className="submit-btn" disabled={!isFormValid}>
          Register
        </button>
      </form>

      {submittedData && (
        <div className="confirmation-box">
          🎉 Registration Successful!
        </div>
      )}

      {submittedData && (
        <div className="submitted-data">
          <h3>User Info</h3>
          <p><strong>Username:</strong> {submittedData.username}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Password:</strong> {submittedData.password}</p>
        </div>
      )}
    </div>
  );
};

export default UniqueForm;
