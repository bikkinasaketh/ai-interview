import "./Difficulty.css";
import { Link } from "react-router-dom";

function Difficulty() {
  return (
    <section className="difficulty">

      <h1>Select Difficulty</h1>

      <div className="difficulty-grid">

        <Link to="/instructions" className="level easy">
          Easy
        </Link>

        <Link to="/instructions" className="level medium">
          Medium
        </Link>

        <Link to="/instructions" className="level hard">
          Hard
        </Link>

      </div>

    </section>
  );
}

export default Difficulty;