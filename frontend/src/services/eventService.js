const API_URL = "http://localhost:5000/api/events";

export const getAllEvents = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const registerForEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${eventId}/register`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};

