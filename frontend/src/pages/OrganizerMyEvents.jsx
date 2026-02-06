import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/events.css";

const OrganizerMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(res.data.events);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Events");
      }
    };

    fetchMyEvents();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/events/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(events.filter((event) => event._id !== deleteId));
      setShowConfirm(false);
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>My Events</h2>

        <button
          className="view-registrations-btn"
          onClick={() => navigate("/organizer/add-event")}
        >
          + Create Event
        </button>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>

          <Link to={`/organizer/edit-event/${event._id}`}>
            <button>Edit</button>
          </Link>

          <button onClick={() => confirmDelete(event._id)}>Delete</button>

          <Link to={`/organizer/events/${event._id}/registrations`}>
            <button className="view-btn">View Registration</button>
          </Link>
        </div>
      ))}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete this event?</p>

            <div className="confirm-actions">
              <button className="yes-btn" onClick={handleDelete}>
                Yes
              </button>
              <button className="no-btn" onClick={() => setShowConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerMyEvents;
