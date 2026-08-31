import "./Difficulty.css";
import { Link, useSearchParams } from "react-router-dom";

function Difficulty() {
  const [searchParams] = useSearchParams();

  const topic = searchParams.get("topic");

  return (
    <section className="difficulty">

      <h1>Select Difficulty</h1>

      {topic && (
        <p>
          Topic: <strong>{topic}</strong>
        </p>
      )}

      <div className="difficulty-grid">

        <Link
          to={`/instructions?topic=${encodeURIComponent(
            topic || ""
          )}&difficulty=easy`}
          className="level easy"
        >
          Easy
        </Link>

        <Link
          to={`/instructions?topic=${encodeURIComponent(
            topic || ""
          )}&difficulty=medium`}
          className="level medium"
        >
          Medium
        </Link>

        <Link
          to={`/instructions?topic=${encodeURIComponent(
            topic || ""
          )}&difficulty=hard`}
          className="level hard"
        >
          Hard
        </Link>

      </div>

    </section>
  );
}

export default Difficulty;