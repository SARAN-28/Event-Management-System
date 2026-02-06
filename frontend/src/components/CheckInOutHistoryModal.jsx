import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/sessionModal.css";

const CheckInOutHistoryModal = ({ close }) => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            const token = localStorage.getItem("token");

            const res = await api.get("/admin/sessions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const organizerSessions = res.data.sessions.filter(
                (s) => s.role === "organizer" && s.checkInTime
            );

            setSessions(organizerSessions);
        };

        fetchSessions();
    }, []);

    const getDuration = (start, end) => {
        if (!start || !end) return "-";
        const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal" style={{ width: "700px" }}>
                <h3>Organizer Check-In / Check-Out History</h3>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((s) => (
                            <tr key={s._id}>
                                <td>{s.user?.name}</td>
                                <td>{new Date(s.checkInTime).toLocaleString()}</td>
                                <td> {s.checkOutTime
                                    ? new Date(s.checkOutTime).toLocaleString()
                                    : "Active"}
                                </td>
                                <td>{getDuration(s.checkInTime, s.checkOutTime)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="logout-actions">
                    <button onClick={close}>Close</button>
                </div>
            </div>
        </div>
    );
};
export default CheckInOutHistoryModal;