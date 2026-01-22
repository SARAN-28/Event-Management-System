
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./routes/AdminRoute";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Welcome to Event Management</h1>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
      </Routes>

    </Router>
  );
}

export default App;
