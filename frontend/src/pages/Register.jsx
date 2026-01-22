import { useState } from "react";
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

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Success! Now please login.");
      openLogin();
    } catch (error) {
      console.error("Error:", error);
      alert("Backend server is not running")
    }
  };

  return (
    <dialog open>
      <span className="close-btn" onClick={close}>
        <i className="fa-solid fa-circle-xmark" style={{ color: "#fd0707" }}></i>
      </span>

      <form onSubmit={handleSubmit}>
        <h3>Registration Form!</h3>

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" value={formData.password} placeholder="Password" onChange={handleChange} />

        <button type="submit">Submit</button>

        <p className="login-register-text"> Already have an account?{" "}
          <span className="login-register-link" onClick={() => {
            close();
            openLogin();
          }}
          >
            Login
          </span>
        </p>
      </form>
    </dialog>
  );
};

export default Register;