import "./Interview.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaArrowRight } from "react-icons/fa";

function Interview() {

  const navigate = useNavigate();

  const questions = [
    "What is React? Explain its main features.",
    "What is the difference between props and state in React?",
    "What is a component in React?",
    "What is the Virtual DOM?",
    "What are React Hooks?",
    "What is the use of useState()?",
    "What is the use of useEffect()?",
    "What is REST API?",
    "What is the difference between GET and POST?",
    "Explain what you know about JavaScript."
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleNext = async () => {

    if (answer.trim() === "") {
      alert("Please enter your answer first.");
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentQuestion],
        answer: answer
      }
    ];

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");

    } else {

      // Calculate score
      const score = Math.round(
        (updatedAnswers.length / questions.length) * 100
      );

      // Get logged-in user
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(savedUser);

      try {

        const response = await fetch(
          "http://localhost:8081/api/interviews/save",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              userId: user.id,
              score: score,
              totalQuestions: questions.length
            })
          }
        );

        if (response.ok) {

          console.log("Interview saved to MySQL");

          // Save answers for Results page
          localStorage.setItem(
            "interviewAnswers",
            JSON.stringify(updatedAnswers)
          );

          // Save latest score
          localStorage.setItem(
            "interviewScore",
            score
          );

          navigate("/results");

        } else {

          alert("Failed to save interview.");

        }

      } catch (error) {

        console.error("Interview save error:", error);

        alert("Backend connection failed.");

      }
    }
  };

  return (

    <section className="interview">

      <div className="question-box">

        <h3>🤖 AI Interview Coach</h3>

        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h2>
          {questions[currentQuestion]}
        </h2>

        <textarea
          placeholder="Type your answer here..."
          rows="8"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <div className="buttons">

          <button
            type="button"
            className="voice-btn"
          >
            <FaMicrophone />
            Speak
          </button>

          <button
            type="button"
            className="next-btn"
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1
              ? "Finish"
              : "Next"}

            <FaArrowRight />
          </button>

        </div>

      </div>

    </section>
  );
}

export default Interview;