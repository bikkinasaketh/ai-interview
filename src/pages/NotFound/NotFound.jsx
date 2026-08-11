import "./NotFound.css";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function NotFound() {
  return (
    <section className="notfound-page">

      <div className="notfound-card">

        <FaRobot className="robot-icon" />

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry! The page you are looking for doesn't exist.
        </p>

        <Link to="/" className="home-btn">
          Go Back Home
        </Link>

      </div>

    </section>
  );
}

export default NotFound;