import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../styles/addEvent.css";

const AddEvent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    const res = await api.post(
      "/events",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Event created successfully");
    navigate("/events");
  } catch (error) {
    toast.error("Backend server is not running");
  }
};

    return (
        <div className="add-event-container">

            <h2>Create New Event</h2>

            <form className="add-event-form" onSubmit={handleSubmit}>

                <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required maxLength={30} minLength={5} />

                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required maxLength={100} minLength={10}/>

                <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                <input type="text" name="location" placeholder="Event Location" value={formData.location} onChange={handleChange} required />

                <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} min={1} max={200}required />

                <button type="submit">Create Event</button>

            </form>
        </div>
    );
};

export default AddEvent;
