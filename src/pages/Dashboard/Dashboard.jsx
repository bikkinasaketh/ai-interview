import "./Dashboard.css";
import { useEffect, useState } from "react";

function Dashboard() {

  const [score, setScore] = useState(0);
  const [interviewsCompleted, setInterviewsCompleted] = useState(0);

  useEffect(() => {

    const savedScore =
      localStorage.getItem("interviewScore");

    const savedInterviews =
      localStorage.getItem("interviewsCompleted");

    if (savedScore) {
      setScore(Number(savedScore));
    }

    if (savedInterviews) {
      setInterviewsCompleted(
        Number(savedInterviews)
      );
    }

  }, []);

  return (

    <section className="dashboard">

      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        {/* Interviews Completed */}

        <div className="card">

          <h2>{interviewsCompleted}</h2>

          <p>Interviews Completed</p>

        </div>


        {/* Best Score */}

        <div className="card">

          <h2>{score}%</h2>

          <p>Best Score</p>

        </div>


        {/* Topics Practiced */}

        <div className="card">

          <h2>12</h2>

          <p>Topics Practiced</p>

        </div>


        {/* Practice Time */}

        <div className="card">

          <h2>6 hrs</h2>

          <p>Practice Time</p>

        </div>

      </div>

    </section>

  );
}

export default Dashboard;