import "../styles/home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the</h1>
        <h1>Event Management System</h1>

        <p>
          Discover and then register to participate in that Events
        </p>

        <div className="home-buttons">
          <Link to="/events" className="home-btn outline">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;  