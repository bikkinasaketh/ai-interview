import "./Profile.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaTrophy,
  FaChartLine,
  FaSignOutAlt
} from "react-icons/fa";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("interviewAnswers");
    localStorage.removeItem("interviewScore");
  };

  if (!user) {

    return (
      <div className="profile-card">

        <h2>Please login first</h2>

        <Link to="/login">
          Login
        </Link>

      </div>
    );
  }

  return (

    <div className="profile-card">

      <div className="profile-header">

        <FaUserCircle className="profile-icon" />

        <h1>{user.name}</h1>

        <p>
          MCA Student | AI Interview Coach User
        </p>

      </div>


      <div className="profile-details">

        <div className="detail">

          <FaEnvelope className="icon" />

          <span>
            {user.email}
          </span>

        </div>


        <div className="detail">

          <FaPhone className="icon" />

          <span>
            {user.phone || "Phone number not available"}
          </span>

        </div>


        <div className="detail">

          <FaChartLine className="icon" />

          <span>
            Total Interviews :{" "}
            {localStorage.getItem("interviewsCompleted") || 0}
          </span>

        </div>


        <div className="detail">

          <FaTrophy className="icon" />

          <span>
            Best Score :{" "}
            {localStorage.getItem("interviewScore") || 0}%
          </span>

        </div>

      </div>


      <div className="profile-buttons">

        {/* Dashboard */}

        <Link
          to="/dashboard"
          className="dashboard-btn"
        >
          Dashboard
        </Link>


        {/* Start Interview */}

        <Link
          to="/difficulty"
          className="interview-btn"
        >
          Start Interview
        </Link>


        {/* Logout */}

        <Link
          to="/"
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </Link>

      </div>

    </div>

  );
}

export default Profile;