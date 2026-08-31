import "./Topics.css";
import { Link } from "react-router-dom";

function Topics() {

  const topics = [
    "React",
    "JavaScript",
    "Java",
    "Python",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Spring Boot",
    "Node.js",
    "HR Interview",
    "Communication Skills"
  ];

  return (
    <section className="topics">

      <h1>Select Your Interview Topic</h1>

      <p>
        Choose a topic and start practicing with AI.
      </p>

      <div className="topic-grid">

        {topics.map((topic, index) => (

          <Link
            key={index}
            to={`/difficulty?topic=${encodeURIComponent(topic)}`}
            className="topic-card"
          >

            <h2>{topic}</h2>

            <span>
              Start Practice →
            </span>

          </Link>

        ))}

      </div>

    </section>
  );
}

export default Topics;