import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/organizerRegistrations.css";
import api from "../api/axios";

const OrganizerEventRegistrations = () => {
    const { eventId } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get(
                    `/events/${eventId}/registrations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRegistrations(response.data.registrations);

            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch registrations");
            }
        };

        fetchRegistrations();
    }, [eventId]);

    return (
        <div className="container">
            <h2 className="page-title">Event Registration Details</h2>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <div className="table-card">
                <table className="registrations-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Event Name</th>
                            <th>Event Date</th>
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
        </div>
    );
};

export default OrganizerEventRegistrations;
