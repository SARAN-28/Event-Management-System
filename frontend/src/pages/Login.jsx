import { useState } from "react";
import "../styles/dialog.css";

const Login = ({ close, openRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    close();
  };

  return (
    <dialog open>
      <span className="close-btn" onClick={close}>
        <i className="fa-solid fa-circle-xmark" style={{ color: "#ff0505" }}></i>
      </span>

      <form onSubmit={handleLogin}>
        <h3>Login Form</h3>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Login</button>

        <p className="login-register-text"> Don’t have an account?{" "}
          <span className="login-register-link" onClick={() => {
            close();
            openRegister();
          }}
          >
            Register
          </span>
        </p>
      </form>
    </dialog>
  );
};

export default Login;