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
      setError("Vui lòng nhập email hợp lệ hoặc số điện thoại 10 số.");
      return;
    }

    if (isSignup) {
      if (!displayName.trim()) {
        setError("Vui lòng nhập tên hiển thị.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Mật khẩu nhập lại không khớp!");
        return;
      }
      localStorage.setItem(
        "user",
        JSON.stringify({ identifier, displayName })
      );
      alert("Đăng ký thành công!");
    } else {
      localStorage.setItem("user", JSON.stringify({ identifier }));
      alert("Đăng nhập thành công!");
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
        <h2>{isSignup ? "Đăng ký" : "Đăng nhập"}</h2>
        <p>
          {isSignup ? "Đã có tài khoản?" : "Nếu bạn chưa có tài khoản,"}{" "}
          <span
            className="link-text"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              resetForm();
            }}
          >
            {isSignup ? "Đăng nhập" : "đăng ký"}
          </span>
        </p>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Tên hiển thị"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <input
            type="text"
            placeholder="Email hoặc Số điện thoại"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          {error && <p className="error-text">{error}</p>}
          <button type="submit">
            {isSignup ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
