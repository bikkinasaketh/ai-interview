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

  const [interviewsCompleted, setInterviewsCompleted] =
    useState(0);

  const [bestScore, setBestScore] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // API URL
  // =========================================================

  const API_URL = "http://localhost:8081";


  // =========================================================
  // GET JWT AUTH HEADERS
  // =========================================================

  const getAuthHeaders = () => {

    const token =
      localStorage.getItem("userToken");

    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {

    const loadProfile = async () => {

      // -------------------------------------------------------
      // GET SAVED USER
      // -------------------------------------------------------

      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {

        setLoading(false);

        return;
      }


      try {

        const loggedInUser =
          JSON.parse(savedUser);


        // -----------------------------------------------------
        // CHECK USER ID
        // -----------------------------------------------------

        if (!loggedInUser.id) {

          setError(
            "User information is missing."
          );

          setLoading(false);

          return;
        }


        // -----------------------------------------------------
        // CHECK JWT TOKEN
        // -----------------------------------------------------

        const token =
          localStorage.getItem("userToken");

        if (!token) {

          setError(
            "Login session expired. Please login again."
          );

          setLoading(false);

          return;
        }


        // =====================================================
        // GET LATEST USER PROFILE
        // =====================================================

        const userResponse =
          await fetch(
            `${API_URL}/api/users/${loggedInUser.id}`,
            {
              method: "GET",

              headers:
                getAuthHeaders()
            }
          );


        // -----------------------------------------------------
        // UNAUTHORIZED
        // -----------------------------------------------------

        if (
          userResponse.status === 401 ||
          userResponse.status === 403
        ) {

          throw new Error(
            "Your login session is invalid or expired."
          );
        }


        // -----------------------------------------------------
        // OTHER ERROR
        // -----------------------------------------------------

        if (!userResponse.ok) {

          throw new Error(
            "Failed to load profile"
          );
        }


        const userData =
          await userResponse.json();

        setUser(userData);


        // =====================================================
        // GET INTERVIEW HISTORY
        // =====================================================

        const interviewResponse =
          await fetch(
            `${API_URL}/api/interviews/user/${loggedInUser.id}`,
            {
              method: "GET",

              headers:
                getAuthHeaders()
            }
          );


        // -----------------------------------------------------
        // UNAUTHORIZED
        // -----------------------------------------------------

        if (
          interviewResponse.status === 401 ||
          interviewResponse.status === 403
        ) {

          throw new Error(
            "Your login session is invalid or expired."
          );
        }


        // -----------------------------------------------------
        // OTHER ERROR
        // -----------------------------------------------------

        if (!interviewResponse.ok) {

          throw new Error(
            "Failed to load interview history"
          );
        }


        const interviewData =
          await interviewResponse.json();


        // =====================================================
        // TOTAL INTERVIEWS
        // =====================================================

        setInterviewsCompleted(
          interviewData.length
        );


        // =====================================================
        // BEST SCORE
        // =====================================================

        if (
          interviewData.length > 0
        ) {

          const highestScore =
            Math.max(
              ...interviewData.map(
                (interview) =>
                  Number(
                    interview.score
                  ) || 0
              )
            );

          setBestScore(
            highestScore
          );

        } else {

          setBestScore(0);
        }

      } catch (err) {

        console.error(
          "Profile error:",
          err
        );


        setError(
          err.message ||
          "Unable to load profile information."
        );


        // -----------------------------------------------------
        // FALLBACK TO LOCAL STORAGE
        // -----------------------------------------------------

        try {

          const fallbackUser =
            JSON.parse(savedUser);

          setUser(fallbackUser);

        } catch {

          setUser(null);
        }

      } finally {

        setLoading(false);
      }
    };


    loadProfile();

  }, []);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    // -------------------------------------------------------
    // USER DATA
    // -------------------------------------------------------

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userId"
    );


    // -------------------------------------------------------
    // JWT TOKEN
    // -------------------------------------------------------

    localStorage.removeItem(
      "userToken"
    );


    // -------------------------------------------------------
    // INTERVIEW DATA
    // -------------------------------------------------------

    localStorage.removeItem(
      "interviewAnswers"
    );

    localStorage.removeItem(
      "interviewScore"
    );

    localStorage.removeItem(
      "interviewsCompleted"
    );

    localStorage.removeItem(
      "currentInterviewCounted"
    );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="profile-card">

        <h2>
          Loading profile...
        </h2>

      </div>
    );
  }


  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!user) {

    return (
      <div className="profile-card">

        <h2>
          Please login first
        </h2>

        <Link to="/login">
          Login
        </Link>

      </div>
    );
  }


  // =========================================================
  // PROFILE
  // =========================================================

  return (

    <div className="profile-card">

      {/* =====================================================
          PROFILE HEADER
          ===================================================== */}

      <div className="profile-header">

        <FaUserCircle
          className="profile-icon"
        />

        <h1>
          {user.name}
        </h1>

        <p>
          MCA Student | AI Interview Coach User
        </p>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <p className="profile-error">
          {error}
        </p>

      )}


      {/* =====================================================
          PROFILE DETAILS
          ===================================================== */}

      <div className="profile-details">

        {/* ===================================================
            EMAIL
            =================================================== */}

        <div className="detail">

          <FaEnvelope
            className="icon"
          />

          <span>
            {user.email}
          </span>

        </div>


        {/* ===================================================
            PHONE
            =================================================== */}

        <div className="detail">

          <FaPhone
            className="icon"
          />

          <span>
            {user.phone ||
              "Phone number not available"}
          </span>

        </div>


        {/* ===================================================
            TOTAL INTERVIEWS
            =================================================== */}

        <div className="detail">

          <FaChartLine
            className="icon"
          />

          <span>
            Total Interviews :{" "}
            {interviewsCompleted}
          </span>

        </div>


        {/* ===================================================
            BEST SCORE
            =================================================== */}

        <div className="detail">

          <FaTrophy
            className="icon"
          />

          <span>
            Best Score :{" "}
            {bestScore}%
          </span>

        </div>

      </div>


      {/* =====================================================
          PROFILE BUTTONS
          ===================================================== */}

      <div className="profile-buttons">

        {/* ===================================================
            DASHBOARD
            =================================================== */}

        <Link
          to="/dashboard"
          className="dashboard-btn"
        >
          Dashboard
        </Link>


        {/* ===================================================
            START INTERVIEW
            =================================================== */}

        <Link
          to="/topics"
          className="interview-btn"
        >
          Start Interview
        </Link>


        {/* ===================================================
            LOGOUT
            =================================================== */}

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