import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "https://ai-backend-8-7moy.onrender.com";

function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch (err) {
        console.error("Invalid user data:", err);

        setError(
          "Invalid login information. Please login again."
        );

        setLoading(false);
        return;
      }

      if (!user.id) {
        setError(
          "User information is missing. Please login again."
        );

        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/interviews/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load interview history."
          );
        }

        const interviewData = await response.json();

        if (!Array.isArray(interviewData)) {
          throw new Error(
            "Invalid interview history received from backend."
          );
        }

        setInterviews(interviewData);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =========================================================
  // DASHBOARD CALCULATIONS
  // =========================================================

  const interviewsCompleted = interviews.length;

  const bestScore =
    interviews.length > 0
      ? Math.max(
          ...interviews.map((interview) =>
            Number(interview.score) || 0
          )
        )
      : 0;

  const averageScore =
    interviews.length > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              (Number(interview.score) || 0),
            0
          ) / interviews.length
        )
      : 0;

  const topicsPracticed = useMemo(() => {
    const topics = interviews
      .map((interview) => interview.topic)
      .filter(
        (topic) =>
          topic &&
          typeof topic === "string"
      )
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 0);

    return new Set(topics).size;
  }, [interviews]);

  const latestInterview =
    interviews.length > 0
      ? [...interviews].sort(
          (a, b) =>
            new Date(b.completedAt || 0) -
            new Date(a.completedAt || 0)
        )[0]
      : null;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="dashboard">
        <h1>Dashboard</h1>

        <p>
          Loading dashboard...
        </p>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <section className="dashboard">
        <h1>Dashboard</h1>

        <p>{error}</p>
      </section>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <section className="dashboard">

      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        {/* Interviews Completed */}
        <div className="card">
          <h2>
            {interviewsCompleted}
          </h2>

          <p>
            Interviews Completed
          </p>
        </div>

        {/* Best Score */}
        <div className="card">
          <h2>
            {bestScore}%
          </h2>

          <p>
            Best Score
          </p>
        </div>

        {/* Topics Practiced */}
        <div className="card">
          <h2>
            {topicsPracticed}
          </h2>

          <p>
            Topics Practiced
          </p>
        </div>

        {/* Average Score */}
        <div className="card">
          <h2>
            {averageScore}%
          </h2>

          <p>
            Average Score
          </p>
        </div>

      </div>

      {/* Latest Interview */}
      {latestInterview && (
        <div className="interview-history">

          <h2>
            Latest Interview
          </h2>

          <div className="history-list">

            <div className="history-item">

              <div>

                <h3>
                  {latestInterview.topic ||
                    "Interview"}
                </h3>

                <p>
                  Difficulty:{" "}
                  {latestInterview.difficulty ||
                    "N/A"}
                </p>

                <p>
                  Questions:{" "}
                  {latestInterview.totalQuestions ||
                    0}
                </p>

                <p>
                  Completed:{" "}
                  {latestInterview.completedAt
                    ? new Date(
                        latestInterview.completedAt
                      ).toLocaleString()
                    : "N/A"}
                </p>

              </div>

              <div className="history-score">

                <strong>
                  {Number(
                    latestInterview.score
                  ) || 0}
                  %
                </strong>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Interview History */}
      <div className="interview-history">

        <h2>
          Interview History
        </h2>

        {interviews.length === 0 ? (

          <p>
            No interviews completed yet.
          </p>

        ) : (

          <div className="history-list">

            {interviews.map((interview) => (

              <div
                className="history-item"
                key={interview.id}
              >

                <div>

                  <h3>
                    {interview.topic ||
                      `Interview #${interview.id}`}
                  </h3>

                  <p>
                    Difficulty:{" "}
                    {interview.difficulty ||
                      "N/A"}
                  </p>

                  <p>
                    Questions:{" "}
                    {interview.totalQuestions ||
                      0}
                  </p>

                  <p>
                    Completed:{" "}
                    {interview.completedAt
                      ? new Date(
                          interview.completedAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                </div>

                <div className="history-score">

                  <strong>
                    {Number(
                      interview.score
                    ) || 0}
                    %
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Practice Time */}
      <div className="interview-history">

        <h2>
          Practice Time
        </h2>

        <p>
          Practice duration tracking will be
          available after interview start/end
          timestamps are added to the backend.
        </p>

      </div>

    </section>
  );
}

export default Dashboard;
