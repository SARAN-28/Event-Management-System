
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "admin") {
    alert("Access denied: Admins only");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;