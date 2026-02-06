import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import MyRegistrations from "./pages/MyRegistrations";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerEventRegistrations from "./pages/OrganizerEventRegistrations";
import OrganizerRoute from "./routes/OrganizerRoute";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import OrganizerMyEvents from "./pages/OrganizerMyEvents";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="/events" element={<Events />} />

        <Route path="/admin/add-event" element={<AdminRoute><AddEvent /></AdminRoute>} />

        <Route path="/admin/events/edit/:id" element={<AdminRoute><EditEvent /></AdminRoute>} />

        <Route path="/my-registrations" element={<UserRoute><MyRegistrations /></UserRoute>} />

        <Route path="/admin/registrations" element={<AdminRoute><AdminRegistrations /></AdminRoute>} />

        <Route path="/organizer/my-events" element={<OrganizerMyEvents />} />

        <Route path="/organizer/add-event" element={<OrganizerRoute><AddEvent /></OrganizerRoute>} />

        <Route path="/organizer/edit-event/:id" element={<OrganizerRoute><EditEvent /></OrganizerRoute>} />

        <Route path="/organizer/events/:eventId/registrations" element={<OrganizerEventRegistrations />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTopcloseOnClickpauseOnHover />
    </Router>
  );
}

export default App;
