import { Navigate } from "react-router-dom";

const OrganizerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "organizer") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerRoute;
