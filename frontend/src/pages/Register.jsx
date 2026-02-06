import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../styles/dialog.css";

const Register = ({ close, openLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z ]{2,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!nameRegex.test(formData.name)) {
      toast.error("Invalid name format");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number & special character"
      );
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);

      toast.success("Registration successful! Please login");
      close();
      openLogin();
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <h3>Registration Form!</h3>

          <span className="close-btn" onClick={close}>
            <i className="fa-solid fa-circle-xmark" style={{ color: "#ff0505" }}></i>
          </span>

          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />

          <button type="submit">Submit</button>

          <p className="login-register-text">
            Already have an account?{" "}
            <span
              className="login-register-link"
              onClick={() => {
                close();
                openLogin();
              }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
