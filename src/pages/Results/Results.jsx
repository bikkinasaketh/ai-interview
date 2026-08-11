import "./Results.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Results() {

  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {

    const savedAnswers =
      localStorage.getItem("interviewAnswers");

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

  }, []);

  const totalQuestions = 10;

  const answeredQuestions = answers.length;

  useEffect(() => {

    const calculatedScore = Math.round(
      (answeredQuestions / totalQuestions) * 100
    );

    setScore(calculatedScore);

    // Save latest score
    localStorage.setItem(
      "interviewScore",
      calculatedScore
    );

    // Count interview only once
    const alreadyCounted =
      localStorage.getItem("currentInterviewCounted");

    if (!alreadyCounted) {

      const previousCount =
        Number(
          localStorage.getItem("interviewsCompleted")
        ) || 0;

      localStorage.setItem(
        "interviewsCompleted",
        previousCount + 1
      );

      localStorage.setItem(
        "currentInterviewCounted",
        "true"
      );
    }

  }, [answeredQuestions]);


  let performance = "";

  if (score >= 80) {
    performance = "Excellent Performance";
  } else if (score >= 60) {
    performance = "Good Performance";
  } else if (score >= 40) {
    performance = "Average Performance";
  } else {
    performance = "Needs Improvement";
  }


  return (

    <section className="results">

      <h1>Interview Completed 🎉</h1>


      <div className="score-card">

        <h2>Overall Score</h2>

        <h1>{score}%</h1>

        <p>{performance}</p>

      </div>


      <div className="feedback">

        <div>

          <h3>Questions Answered</h3>

          <p>
            {answeredQuestions} / {totalQuestions}
          </p>

        </div>


        <div>

          <h3>Technical Skills</h3>

          <p>
            {score >= 70
              ? "⭐⭐⭐⭐☆"
              : "⭐⭐⭐☆☆"}
          </p>

        </div>


        <div>

          <h3>Communication</h3>

          <p>
            {score >= 70
              ? "⭐⭐⭐⭐⭐"
              : "⭐⭐⭐☆☆"}
          </p>

        </div>


        <div>

          <h3>Confidence</h3>

          <p>
            {score >= 70
              ? "⭐⭐⭐⭐☆"
              : "⭐⭐⭐☆☆"}
          </p>

        </div>

      </div>


      <div className="result-buttons">

        <Link
          to="/dashboard"
          className="dashboard-btn"
        >
          Go to Dashboard
        </Link>


        <Link
          to="/difficulty"
          className="retry-btn"
          onClick={() => {
            localStorage.removeItem(
              "currentInterviewCounted"
            );
            localStorage.removeItem(
              "interviewAnswers"
            );
          }}
        >
          Try Again
        </Link>

      </div>

    </section>

  );
}

export default Results;