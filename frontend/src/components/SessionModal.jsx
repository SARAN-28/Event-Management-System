import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/sessionModal.css"

const SessionModal = ({ close }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions(res.data.sessions);
    };

    fetchSessions();
  }, []);

  const getDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return "-";

    const start = new Date(loginTime);
    const end = new Date(logoutTime);
    const diff = Math.floor((end - start) / 1000);

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal" style={{ width: "650px" }}>
        <h3>LogIn LogOut Schedule</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>LogIn</th>
              <th>LogOut</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((s, index) => {
              const isLatestSession = index === 0 && !s.logoutTime;

              return (
                <tr key={s._id}>
                  <td>{s.user?.name}</td>
                  <td>{s.role}</td>
                  <td>{new Date(s.loginTime).toLocaleString()}</td>
                  <td> {isLatestSession ? "Active" : s.logoutTime ?
                    new Date(s.logoutTime).toLocaleString() : "Logged out"}</td>
                  <td>{getDuration(s.loginTime, s.logoutTime)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="logout-actions">
          <button onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
};
export default SessionModal;