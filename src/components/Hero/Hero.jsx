import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <span className="tag">
          🤖 AI Powered Interview Practice
        </span>

        <h1>
          Master Your <span>Technical</span> &
          <br />
          HR Interviews with AI
        </h1>

        <p>
          Practice interviews, improve your confidence,
          receive AI-powered feedback and crack your dream job.
        </p>

        <div className="hero-buttons">
          <Link to="/categories" className="primary-btn">
            Start Interview
          </Link>

          <Link to="/about" className="secondary-btn">
            Learn More
          </Link>
        </div>

        <div className="hero-stats">

          <div>
            <h2>500+</h2>
            <p>Questions</p>
          </div>

          <div>
            <h2>50+</h2>
            <p>Topics</p>
          </div>

          <div>
            <h2>24/7</h2>
            <p>Practice</p>
          </div>

        </div>

      </div>

      <div className="hero-image">
        🤖
      </div>
    </section>
  );
}

export default Hero;