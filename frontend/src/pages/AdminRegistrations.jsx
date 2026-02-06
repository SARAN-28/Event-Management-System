import { useEffect, useState } from "react";
import "../styles/adminRegistrations.css";
import api from "../api/axios";

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/admin/registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRegistrations(res.data.registrations);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch registrations");
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="admin-registrations">
      <h2>All Registrations</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Event</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {registrations.map((reg) => (
            <tr key={reg._id}>
              <td>{reg.user?.name}</td>
              <td>{reg.user?.email}</td>
              <td>{reg.event?.title}</td>
              <td>{new Date(reg.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRegistrations;
