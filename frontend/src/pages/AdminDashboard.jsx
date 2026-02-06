import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SessionModal from "../components/SessionModal";
import CheckInOutHistoryModal from "../components/CheckInOutHistoryModal";
import "../styles/admindashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const deleteDialogRef = useRef(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showCheckInOutModal, setShowCheckInOutModal] = useState(false);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await api.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(res.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const token = localStorage.getItem("token");

        try {
            await api.put(
                `/admin/users/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchUsers();
        } catch (error) {
            console.error("Error changing role:", error);
        }
    };

    const openDeleteDialog = (userId) => {
        setSelectedUserId(userId);
        deleteDialogRef.current.showModal();
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");

        await api.delete(`/admin/users/${selectedUserId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        deleteDialogRef.current.close();
        setSelectedUserId(null);
        fetchUsers();
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Manage Users and Organizers and their Roles</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="add-event-btn" onClick={() => navigate("/admin/add-event")}>
                        + Add Event
                    </button>

                    <button className="add-event-btn" onClick={() => setShowSessionModal(true)}>
                        View Login History
                    </button>

                    <button className="add-event-btn" onClick={() => setShowCheckInOutModal(true)}>
                        Check-In / Check-Out History
                    </button>
                </div>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ROLE</th>
                        <th>CHANGE ROLE</th>
                        <th>ACTION</th>
                    </tr>
                </thead>

                <tbody>
                    {users
                        .filter((user) => user.role !== "admin")
                        .map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select className="role-select" value={user.role} onChange={(e) =>
                                        handleRoleChange(user._id, e.target.value)}>
                                        <option value="user">User</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="delete-btn" onClick={() => openDeleteDialog(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <dialog ref={deleteDialogRef} className="delete-dialog">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this user?</p>

                <div className="dialog-actions">
                    <button className="confirm-btn" onClick={confirmDelete}>
                        Yes
                    </button>

                    <button className="cancel-btn" onClick={() => deleteDialogRef.current.close()}>
                        No
                    </button>
                </div>
            </dialog>

            {
                showSessionModal && (
                    <SessionModal close={() => setShowSessionModal(false)} />
                )
            }

            {
                showCheckInOutModal && (
                    <CheckInOutHistoryModal close={() => setShowCheckInOutModal(false)} />
                )
            }
        </div >
    );
};

export default AdminDashboard;
