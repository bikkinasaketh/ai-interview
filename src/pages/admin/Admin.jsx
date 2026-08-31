import "./Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8081";

// =========================================================
// JWT AUTH HEADERS
// =========================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

function Admin() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    averageScore: 0,
    highestScore: 0,
  });

  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [topicAnalytics, setTopicAnalytics] = useState({});
  const [difficultyAnalytics, setDifficultyAnalytics] =
    useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] =
    useState(false);
  const [feedbackError, setFeedbackError] =
    useState("");

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  // =========================================================
  // ADMIN LOGIN CHECK
  // =========================================================

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    const savedAdmin =
      localStorage.getItem("admin");

    if (
      isLoggedIn !== "true" ||
      !savedAdmin
    ) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsedAdmin =
        JSON.parse(savedAdmin);

      setAdmin(parsedAdmin);

      loadDashboardData();

    } catch (error) {
      console.error(
        "Invalid admin data:",
        error
      );

      localStorage.removeItem("admin");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminToken");
      localStorage.removeItem(
        "isAdminLoggedIn"
      );

      navigate("/admin/login");
    }
  }, [navigate]);

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const authHeaders = getAuthHeaders();

      const [
        statsResponse,
        usersResponse,
        interviewsResponse,
        topicResponse,
        difficultyResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/admin/stats`,
          {
            method: "GET",
            headers: authHeaders,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/admin/users`,
          {
            method: "GET",
            headers: authHeaders,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/admin/interviews`,
          {
            method: "GET",
            headers: authHeaders,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/admin/analytics/topic`,
          {
            method: "GET",
            headers: authHeaders,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/admin/analytics/difficulty`,
          {
            method: "GET",
            headers: authHeaders,
          }
        ),
      ]);

      if (!statsResponse.ok) {
        throw new Error(
          `Stats API failed: ${statsResponse.status}`
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          `Users API failed: ${usersResponse.status}`
        );
      }

      if (!interviewsResponse.ok) {
        throw new Error(
          `Interviews API failed: ${interviewsResponse.status}`
        );
      }

      if (!topicResponse.ok) {
        throw new Error(
          `Topic analytics API failed: ${topicResponse.status}`
        );
      }

      if (!difficultyResponse.ok) {
        throw new Error(
          `Difficulty analytics API failed: ${difficultyResponse.status}`
        );
      }

      const statsData =
        await statsResponse.json();

      const usersData =
        await usersResponse.json();

      const interviewsData =
        await interviewsResponse.json();

      const topicData =
        await topicResponse.json();

      const difficultyData =
        await difficultyResponse.json();

      setStats({
        totalUsers:
          statsData.totalUsers ?? 0,

        totalInterviews:
          statsData.totalInterviews ?? 0,

        averageScore:
          statsData.averageScore ?? 0,

        highestScore:
          statsData.highestScore ?? 0,
      });

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

      setInterviews(
        Array.isArray(interviewsData)
          ? interviewsData
          : []
      );

      setTopicAnalytics(
        topicData &&
        typeof topicData === "object"
          ? topicData
          : {}
      );

      setDifficultyAnalytics(
        difficultyData &&
        typeof difficultyData === "object"
          ? difficultyData
          : {}
      );

    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD AI FEEDBACK
  // =========================================================

  const loadFeedback = async (interview) => {
    setSelectedInterview(interview);
    setFeedback([]);
    setFeedbackError("");
    setFeedbackLoading(true);

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/interviews/${interview.id}/feedback`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

      if (!response.ok) {
        throw new Error(
          `Feedback API failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      setFeedback(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Feedback loading error:",
        error
      );

      setFeedbackError(
        error.message ||
        "Unable to load AI feedback."
      );

    } finally {
      setFeedbackLoading(false);
    }
  };

  // =========================================================
  // CLOSE FEEDBACK
  // =========================================================

  const closeFeedback = () => {
    setSelectedInterview(null);
    setFeedback([]);
    setFeedbackError("");
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdminLoggedIn");

    navigate("/admin/login");
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleString();

    } catch {
      return "—";
    }
  };

  // =========================================================
  // SCORE CLASS
  // =========================================================

  const getScoreClass = (score) => {
    const value =
      Number(score) || 0;

    if (value >= 80) {
      return "score-high";
    }

    if (value >= 50) {
      return "score-medium";
    }

    return "score-low";
  };

  // =========================================================
  // BAR WIDTH
  // =========================================================

  const getBarWidth = (score) => {
    const value =
      Number(score) || 0;

    return `${Math.min(
      100,
      Math.max(0, value)
    )}%`;
  };

  // =========================================================
  // ANALYTICS ENTRIES
  // =========================================================

  const topicEntries =
    Object.entries(
      topicAnalytics || {}
    );

  const difficultyEntries =
    Object.entries(
      difficultyAnalytics || {}
    );

  // =========================================================
  // LOADING
  // =========================================================

  if (!admin) {
    return (
      <section className="admin-page">
        <div className="admin-card">
          <h2>
            Loading Admin Dashboard...
          </h2>
        </div>
      </section>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="admin-dashboard">

      {/* HEADER */}

      <header className="admin-dashboard-header">

        <div>

          <h1>
            🤖 AI Interview Admin
          </h1>

          <p>
            Manage users, interviews and AI
            performance
          </p>

        </div>

        <div className="admin-profile">

          <div>

            <strong>
              {admin.name}
            </strong>

            <small>
              {admin.email}
            </small>

          </div>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ERROR */}

      {error && (

        <div className="admin-error">

          <strong>
            Dashboard Error:
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadDashboardData}
          >
            Retry
          </button>

        </div>

      )}


      {/* STATS */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <span>
            👥
          </span>

          <h3>
            Total Users
          </h3>

          <strong>
            {loading
              ? "..."
              : stats.totalUsers}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            🎤
          </span>

          <h3>
            Total Interviews
          </h3>

          <strong>
            {loading
              ? "..."
              : stats.totalInterviews}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            📊
          </span>

          <h3>
            Average Score
          </h3>

          <strong>
            {loading
              ? "..."
              : `${stats.averageScore}%`}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>
            🏆
          </span>

          <h3>
            Highest Score
          </h3>

          <strong>
            {loading
              ? "..."
              : `${stats.highestScore}%`}
          </strong>

        </div>

      </div>


      {/* PERFORMANCE ANALYTICS */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              📈 Performance Analytics
            </h2>

            <p>
              Analyze average interview scores
              by topic and difficulty.
            </p>

          </div>

        </div>


        <div className="admin-feature-grid">

          {/* TOPIC */}

          <div className="admin-feature-card">

            <h3>
              📚 Topic-wise Average Score
            </h3>

            {topicEntries.length === 0 ? (

              <p>
                No topic analytics available yet.
              </p>

            ) : (

              <div
                style={{
                  marginTop: "20px",
                }}
              >

                {topicEntries.map(
                  ([topic, score]) => (

                    <div
                      key={topic}
                      style={{
                        marginBottom: "18px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginBottom: "6px",
                        }}
                      >

                        <strong>
                          {topic}
                        </strong>

                        <strong>
                          {Number(score).toFixed(1)}%
                        </strong>

                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          background:
                            "#e5e7eb",
                          borderRadius:
                            "999px",
                          overflow:
                            "hidden",
                        }}
                      >

                        <div
                          style={{
                            width:
                              getBarWidth(score),
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            borderRadius:
                              "999px",
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* DIFFICULTY */}

          <div className="admin-feature-card">

            <h3>
              🎯 Difficulty-wise Average Score
            </h3>

            {difficultyEntries.length === 0 ? (

              <p>
                No difficulty analytics available yet.
              </p>

            ) : (

              <div
                style={{
                  marginTop: "20px",
                }}
              >

                {difficultyEntries.map(
                  ([difficulty, score]) => (

                    <div
                      key={difficulty}
                      style={{
                        marginBottom: "18px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginBottom: "6px",
                        }}
                      >

                        <strong
                          style={{
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {difficulty}
                        </strong>

                        <strong>
                          {Number(score).toFixed(1)}%
                        </strong>

                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          background:
                            "#e5e7eb",
                          borderRadius:
                            "999px",
                          overflow:
                            "hidden",
                        }}
                      >

                        <div
                          style={{
                            width:
                              getBarWidth(score),
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #0ea5e9, #06b6d4)",
                            borderRadius:
                              "999px",
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>


      {/* REGISTERED USERS */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              👥 Registered Users
            </h2>

            <p>
              Users who have registered on
              the platform.
            </p>

          </div>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="4">
                    Loading users...
                  </td>

                </tr>

              ) : users.length === 0 ? (

                <tr>

                  <td colSpan="4">
                    No registered users yet.
                  </td>

                </tr>

              ) : (

                users.map(
                  (user, index) => (

                    <tr
                      key={user.id}
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {user.name || "—"}
                      </td>

                      <td>
                        {user.email || "—"}
                      </td>

                      <td>
                        {user.phone || "—"}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* INTERVIEW HISTORY */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              🎤 Interview History
            </h2>

            <p>
              View candidate interview
              performance and AI feedback.
            </p>

          </div>

          <button
            type="button"
            onClick={loadDashboardData}
          >
            Refresh
          </button>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  Candidate
                </th>

                <th>
                  Email
                </th>

                <th>
                  Topic
                </th>

                <th>
                  Difficulty
                </th>

                <th>
                  Score
                </th>

                <th>
                  Questions
                </th>

                <th>
                  Date
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="8">
                    Loading interview data...
                  </td>

                </tr>

              ) : interviews.length === 0 ? (

                <tr>

                  <td colSpan="8">
                    No interview data available.
                  </td>

                </tr>

              ) : (

                interviews.map(
                  (interview) => (

                    <tr
                      key={interview.id}
                    >

                      <td>
                        {interview.userName ||
                          "—"}
                      </td>

                      <td>
                        {interview.userEmail ||
                          "—"}
                      </td>

                      <td>
                        {interview.topic ||
                          "—"}
                      </td>

                      <td>
                        {interview.difficulty ||
                          "—"}
                      </td>

                      <td>

                        <span
                          className={
                            getScoreClass(
                              interview.score
                            )
                          }
                        >
                          {interview.score ?? 0}%
                        </span>

                      </td>

                      <td>
                        {interview.totalQuestions ??
                          0}
                      </td>

                      <td>
                        {formatDate(
                          interview.completedAt
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onClick={() =>
                            loadFeedback(
                              interview
                            )
                          }
                          style={{
                            border: "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "8px",
                            background:
                              "#4f46e5",
                            color: "white",
                            fontWeight:
                              "700",
                            cursor:
                              "pointer",
                          }}
                        >
                          View Feedback
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* OTHER FEATURES */}

      <div className="admin-feature-grid">

        <div className="admin-feature-card">

          <h3>
            🧠 AI Feedback
          </h3>

          <p>
            Review candidate answers,
            improvements and learning topics.
          </p>

        </div>


        <div className="admin-feature-card">

          <h3>
            📚 Learning Insights
          </h3>

          <p>
            Identify concepts candidates
            need to improve.
          </p>

        </div>


        <div className="admin-feature-card">

          <h3>
            📊 Performance Reports
          </h3>

          <p>
            Monitor interview performance
            across topics and difficulty levels.
          </p>

        </div>

      </div>


      {/* AI FEEDBACK MODAL */}

      {selectedInterview && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
          }}
          onClick={closeFeedback}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              color: "#111827",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: "20px",
                marginBottom:
                  "25px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin:
                      "0 0 8px",
                  }}
                >
                  🧠 AI Interview Feedback
                </h2>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#64748b",
                  }}
                >
                  {selectedInterview.userName}
                  {" — "}
                  {selectedInterview.topic}
                  {" — "}
                  {selectedInterview.difficulty}
                </p>

              </div>

              <button
                type="button"
                onClick={closeFeedback}
                style={{
                  border: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius:
                    "50%",
                  background:
                    "#f1f5f9",
                  color:
                    "#334155",
                  fontSize:
                    "20px",
                  cursor:
                    "pointer",
                }}
              >
                ×
              </button>

            </div>


            {/* FEEDBACK ERROR */}

            {feedbackError && (

              <div
                className="admin-error"
                style={{
                  color:
                    "#991b1b",
                  background:
                    "#fee2e2",
                  marginBottom:
                    "20px",
                }}
              >
                {feedbackError}
              </div>

            )}


            {/* FEEDBACK LOADING */}

            {feedbackLoading && (

              <div
                style={{
                  padding:
                    "40px",
                  textAlign:
                    "center",
                  color:
                    "#64748b",
                }}
              >
                Loading AI feedback...
              </div>

            )}


            {/* NO FEEDBACK */}

            {!feedbackLoading &&
              !feedbackError &&
              feedback.length === 0 && (

                <div
                  style={{
                    padding:
                      "40px",
                    textAlign:
                      "center",
                    background:
                      "#f8fafc",
                    borderRadius:
                      "14px",
                    color:
                      "#64748b",
                  }}
                >
                  No AI feedback found
                  for this interview.
                </div>
              )}


            {/* FEEDBACK ITEMS */}

            {!feedbackLoading &&
              feedback.map(
                (item, index) => (

                  <div
                    key={
                      item.id ??
                      index
                    }
                    style={{
                      marginBottom:
                        "24px",
                      padding:
                        "22px",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "16px",
                      background:
                        "#ffffff",
                    }}
                  >

                    {/* QUESTION HEADER */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap:
                          "15px",
                        marginBottom:
                          "18px",
                      }}
                    >

                      <div>

                        <span
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "6px",
                            color:
                              "#6366f1",
                            fontSize:
                              "12px",
                            fontWeight:
                              "800",
                            textTransform:
                              "uppercase",
                          }}
                        >
                          Question {index + 1}
                        </span>

                        <h3
                          style={{
                            margin: 0,
                            fontSize:
                              "17px",
                            lineHeight:
                              "1.5",
                          }}
                        >
                          {item.question}
                        </h3>

                      </div>

                      <span
                        className={
                          getScoreClass(
                            item.aiScore
                          )
                        }
                      >
                        {item.aiScore ?? 0}%
                      </span>

                    </div>


                    {/* CANDIDATE ANSWER */}

                    <div
                      style={{
                        marginBottom:
                          "18px",
                      }}
                    >

                      <h4>
                        👤 Candidate Answer
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          padding:
                            "14px",
                          background:
                            "#f8fafc",
                          borderRadius:
                            "10px",
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.answer ||
                          "No answer provided."}
                      </p>

                    </div>


                    {/* FEEDBACK */}

                    <div
                      style={{
                        marginBottom:
                          "18px",
                      }}
                    >

                      <h4>
                        💬 AI Feedback
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.feedback ||
                          "No feedback available."}
                      </p>

                    </div>


                    {/* CORRECT POINTS */}

                    <div
                      style={{
                        marginBottom:
                          "18px",
                      }}
                    >

                      <h4>
                        ✅ Correct Points
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.correctPoints ||
                          "No correct points recorded."}
                      </p>

                    </div>


                    {/* IMPROVEMENTS */}

                    <div
                      style={{
                        marginBottom:
                          "18px",
                      }}
                    >

                      <h4>
                        🔧 Improvements
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.improvements ||
                          "No improvements recorded."}
                      </p>

                    </div>


                    {/* LEARN NEXT */}

                    <div
                      style={{
                        marginBottom:
                          "18px",
                      }}
                    >

                      <h4>
                        📚 Learn Next
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.learnNext ||
                          "No learning topics recorded."}
                      </p>

                    </div>


                    {/* BETTER ANSWER */}

                    <div>

                      <h4>
                        💡 Better Answer
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          padding:
                            "14px",
                          background:
                            "#eff6ff",
                          border:
                            "1px solid #bfdbfe",
                          borderRadius:
                            "10px",
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.betterAnswer ||
                          "No better answer available."}
                      </p>

                    </div>

                  </div>

                )
              )}

          </div>

        </div>

      )}

    </section>
  );
}

export default Admin;