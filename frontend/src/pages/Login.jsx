import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/dialog.css";

const Login = ({ close, openRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!password) {
      toast.error("Password is Required");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      toast.success("Login successful");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("sessionId", data.sessionId);

      close();
      navigate(from);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Backend server is not running");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-btn" onClick={close}>
          <i className="fa-solid fa-circle-xmark" style={{ color: "#ff0505" }}></i>
        </span>

        <form onSubmit={handleLogin}>
          <h3>Login Form</h3>

          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Login</button>

          <p className="login-register-text">
            Don’t have an account?{" "}
            <span className="login-register-link" onClick={() => {
              close();
              openRegister();
            }}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;