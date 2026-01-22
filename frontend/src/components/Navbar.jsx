import { useState } from "react";
import Register from "../pages/Register";
import Login from "../pages/Login";
import "../styles/navbar.css";

const Navbar = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <nav className="navbar">
        <h2>Event Management</h2>

        <div>
          <button onClick={() => setActiveModal("register")}>Register</button>
          <button onClick={() => setActiveModal("login")}>Login</button>
        </div>
      </nav>

      {activeModal === "register" && (
        <Register
          close={() => setActiveModal(null)}
          openLogin={() => setActiveModal("login")}
        />
      )}

      {activeModal === "login" && (
        <Login
          close={() => setActiveModal(null)}
          openRegister={() => setActiveModal("register")}
        />
      )}
    </>
  );
};

export default Navbar;