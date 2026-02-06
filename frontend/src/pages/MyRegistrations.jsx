import { useEffect, useState } from "react";
import { getMyRegistrations } from "../services/registrationService";
import "../styles/myregistrations.css";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const data = await getMyRegistrations();
    setRegistrations(data.registrations || []);
  };

  return (
    <div className="my-registrations-container">
      <h2>My Registrations</h2>

      {registrations.length === 0 && (
        <p style={{ textAlign: "center" }}>No registration found</p>
      )}

      <div className="my-registrations-grid">
        {registrations.map((reg) => (
          <div className="my-registration-card" key={reg._id}>
            <h3>{reg.event.title}</h3>
            <p>{reg.event.description}</p>
            <p><b>Date:</b>{" "}{new Date(reg.event.date).toLocaleDateString()}</p>
            <p><b>Location:</b> {reg.event.location}</p>

            <span className="my-registration-badge">
              Registered
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;