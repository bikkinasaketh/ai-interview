import "./Loading.css";
import { FaRobot } from "react-icons/fa";

function Loading() {
  return (
    <section className="loading-page">

      <div className="loading-container">

        <FaRobot className="loading-robot" />

        <h1>AI Interview Coach</h1>

        <p>Preparing your interview experience...</p>

        <div className="loader"></div>

      </div>

    </section>
  );
}

export default Loading;