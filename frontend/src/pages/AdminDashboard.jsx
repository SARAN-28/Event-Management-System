import { useEffect, useState, useRef } from "react";
import "../styles/admindashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const deleteDialogRef = useRef(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setUsers(data.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: newRole }),
        });

        fetchUsers();
    };

    const openDeleteDialog = (userId) => {
        setSelectedUserId(userId);
        deleteDialogRef.current.showModal();
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");

        await fetch(
            `http://localhost:5000/api/admin/users/${selectedUserId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        deleteDialogRef.current.close();
        setSelectedUserId(null);
        fetchUsers();
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Manage User and their Roles</p>

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
                                    <select className="role-select"
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user._id, e.target.value)
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => openDeleteDialog(user._id)}
                                    >
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

                    <button
                        className="cancel-btn"
                        onClick={() => deleteDialogRef.current.close()}
                    >
                        No
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default AdminDashboard;
