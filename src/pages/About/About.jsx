import "./About.css";

function About() {
  return (
    <section className="about">

      <h1>About AI Interview Coach</h1>

      <p>
        AI Interview Coach is a smart interview practice platform
        designed to help students improve technical and HR interview
        skills through AI-powered mock interviews.
      </p>

      <div className="about-grid">

        <div className="about-card">
          <h2>🎯 Mission</h2>
          <p>
            Help students prepare for interviews with confidence.
          </p>
        </div>

        <div className="about-card">
          <h2>🚀 Vision</h2>
          <p>
            Become the best AI-powered interview preparation platform.
          </p>
        </div>

        <div className="about-card">
          <h2>🤖 AI Powered</h2>
          <p>
            Personalized interview experience with modern technologies.
          </p>
        </div>

      </div>

    </section>
  );
}

export default About;