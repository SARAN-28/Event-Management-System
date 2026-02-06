import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllEvents, registerForEvent, deleteEvent, } from "../services/eventService";
import { getMyRegistrations } from "../services/registrationService";
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);

  const deleteDialogRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data.events || []);
    } catch {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user?.role === "user") {
      getMyRegistrations()
        .then((data) => {
          setMyRegistrations(data.registrations || []);
        })
        .catch(() => {
          setMyRegistrations([]);
        });
    }
  }, [user]);

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.info("Please Register or Login to Continue");
      return;
    }

    try {
      const data = await registerForEvent(eventId);

      if (data.success) {
        toast.success(data.message);
        const updated = await getMyRegistrations();
        setMyRegistrations(updated.registrations || []);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Backend server is not running");
    }
  };

  const openDeleteDialog = (eventId) => {
    setSelectedEventId(eventId);
    deleteDialogRef.current.showModal();
  };

  const confirmDelete = async () => {
    try {
      const data = await deleteEvent(selectedEventId);

      if (data.success) {
        toast.success("Event deleted successfully");
        fetchEvents();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Backend server is not running");
    }

    deleteDialogRef.current.close();
    setSelectedEventId(null);
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>All Events</h2>

        {user?.role === "user" && (
          <button className="view-registrations-btn" onClick={() => navigate("/my-registrations")}>
            View My Registrations
          </button>
        )}
      </div>

      {events.map((event) => {
        const isRegistered = myRegistrations.some(
          (reg) => reg.event?._id === event._id
        );

        return (
          <div className="event-card" key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><b>Date:</b>{" "}{new Date(event.date).toLocaleDateString()}</p>
            <p><b>Location:</b> {event.location}</p>
            <p><b>Capacity:</b> {event.capacity}</p>

            {(!user || user?.role === "user") && (
              <button className="register-btn" onClick={() =>
                handleRegister(event._id)} disabled={user?.role === "user" && isRegistered}>
                {user?.role === "user" && isRegistered ? "Registered" : "Register"}
              </button>
            )}

            {user?.role === "admin" && (
              <div className="admin-event-actions">
                <button className="edit-event-btn" onClick={() => navigate(`/admin/events/edit/${event._id}`)}>
                  Edit
                </button>

                <button className="delete-event-btn" onClick={() => openDeleteDialog(event._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      <dialog ref={deleteDialogRef} className="delete-dialog">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this event?</p>

        <div className="dialog-actions">
          <button className="confirm-btn" onClick={confirmDelete}>
            Yes
          </button>

          <button className="cancel-btn" onClick={() => deleteDialogRef.current.close()}>
            No
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Events;
