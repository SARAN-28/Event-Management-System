import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;
  if (user.role !== "user") return <Navigate to="/" />;

  return children;
};

export default UserRoute;