import React, { useState } from "react";
import "./LoginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidPhone = (value: string) => /^0\d{9}$/.test(value);

  const resetForm = () => {
    setDisplayName("");
    setIdentifier("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      setError("Please enter a valid email or a 10-digit phone number.");
      return;
    }

    if (isSignup) {
      if (!displayName.trim()) {
        setError("Please enter a display name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      localStorage.setItem(
        "user",
        JSON.stringify({ identifier, displayName })
      );
      alert("Sign up successful!");
    } else {
      localStorage.setItem("user", JSON.stringify({ identifier }));
      alert("Login successful!");
    }

    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="link-text"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              resetForm();
            }}
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          {error && <p className="error-text">{error}</p>}
          <button type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
