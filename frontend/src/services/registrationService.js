const API_URL = "http://localhost:5000/api";

export const getMyRegistrations = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/my-registrations`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};

export const getAllRegistrations = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/admin/registrations`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};