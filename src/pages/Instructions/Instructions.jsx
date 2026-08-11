import "./Instructions.css";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaQuestionCircle,
  FaMicrophone,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

function Instructions() {
  return (
    <section className="instructions">

      <h1>📋 Interview Instructions</h1>

      <p className="subtitle">
        Please read the instructions carefully before starting your AI Interview.
      </p>

      <div className="instruction-card">

        <div className="instruction-item">
          <FaQuestionCircle className="icon" />

          <div>
            <h3>10 Questions</h3>
            <p>You will answer 10 interview questions.</p>
          </div>
        </div>

        <div className="instruction-item">
          <FaClock className="icon" />

          <div>
            <h3>10 Minutes</h3>
            <p>Complete the interview within the given time.</p>
          </div>
        </div>

        <div className="instruction-item">
          <FaMicrophone className="icon" />

          <div>
            <h3>Answer Clearly</h3>
            <p>Speak confidently and provide meaningful answers.</p>
          </div>
        </div>

        <div className="instruction-item">
          <FaCheckCircle className="icon" />

          <div>
            <h3>Stay Focused</h3>
            <p>
              Do not refresh or close the browser during the interview.
            </p>
          </div>
        </div>

      </div>

      <Link to="/interview" className="start-btn">
        Start Interview <FaArrowRight />
      </Link>

    </section>
  );
}

export default Instructions;