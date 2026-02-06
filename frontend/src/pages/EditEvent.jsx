import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../styles/addEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");

      const res = await api.get(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data.event);
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.put(`/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event updated successfully");

      if (user.role === "admin") {
        navigate("/events");
      } else {
        navigate("/organizer/my-events");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="add-event-container">
      <h2>Edit Event</h2>

      <form className="add-event-form" onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} minLength={3} maxLength={20} required />

        <textarea name="description" value={formData.description} onChange={handleChange} minLength={7} maxLength={40} required />

        <input type="date" name="date" value={formData.date?.slice(0, 10)} onChange={handleChange} required />

        <input name="location" value={formData.location} onChange={handleChange} required />

        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min={50} max={200} required />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
