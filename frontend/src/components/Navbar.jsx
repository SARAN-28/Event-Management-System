import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import api from "../api/axios";
import "../styles/navbar.css";

const Navbar = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [activeModal, showLogoutModal]);

  useEffect(() => {
    let interval;
    if (checkedIn) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkedIn]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleCheckInOut = async () => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    const res = await api.post(
      "/auth/checkin-checkout",
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.status === "checked-in") {
      setCheckedIn(true);
      setTimer(0);
    }

    if (res.data.status === "checked-out") {
      setCheckedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const sessionId = localStorage.getItem("sessionId");

      await api.post(
        "/auth/logout",
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) { }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");

    setUser(null);
    setCheckedIn(false);
    setTimer(0);
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h2 onClick={() => navigate("/")}>Event Management</h2>

        <div className="nav-links">
          {!user && (
            <>
              <button onClick={() => setActiveModal("register")}>Register</button>
              <button onClick={() => setActiveModal("login")}>Login</button>
            </>
          )}

          {user && user.role === "user" && (
            <>
              <span className="welcome-text">Hello, {user.name}</span>
              <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
            </>
          )}

          {user && user.role === "organizer" && (
            <>
              <Link to="/organizer/my-events" className="organizer-link">
                My Events
              </Link>

              <span className="welcome-text">Hello, {user.name}</span>

              <button className="checkin-btn" onClick={handleCheckInOut}>
                {checkedIn ? "Check Out" : "Check In"}
              </button>

              {checkedIn && (
                <span className="checkin-timer">{formatTime(timer)}</span>
              )}
              <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="admin-link">
                Admin Dashboard
              </Link>
              <Link to="/admin/registrations" className="admin-link">
                All Registrations
              </Link>
              <span className="welcome-text">Hello, {user.name}</span>
              <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {activeModal === "register" && (
        <Register close={() => setActiveModal(null)} openLogin={() => setActiveModal("login")} />
      )}

      {activeModal === "login" && (
        <Login close={() => setActiveModal(null)} openRegister={() => setActiveModal("register")} />
      )}

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button onClick={handleLogout}>Yes</button>
              <button onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;