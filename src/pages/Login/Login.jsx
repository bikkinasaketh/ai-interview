import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaRobot
} from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {

  e.preventDefault();

  try {

    const response = await fetch(
      "http://localhost:8081/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    if (response.ok) {

      const data = await response.json();

      // Save logged-in user details
      localStorage.setItem("user", JSON.stringify(data));

      alert("✅ Login Successful!");

      navigate("/profile");

    } else {

      alert("❌ Invalid email or password");

    }

  } catch (error) {

    console.error(error);

    alert("❌ Backend connection failed!");

  }
};
  return (

    <div className="login-container">

      {/* Left Side */}

      <div className="login-left">

        <img
          src="https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?w=700&auto=format&fit=crop&q=60"
          alt="AI Robot"
          className="robot-image"
        />

        <h1>
          <FaRobot /> AI Interview Coach
        </h1>

        <p>
          Prepare smarter with AI-powered mock interviews.
          Practice Technical & HR questions and improve your
          confidence before your dream job interview.
        </p>

        <div className="feature-list">

          <div className="feature-item">
            ✅ AI Mock Interviews
          </div>

          <div className="feature-item">
            ✅ Instant Performance Analysis
          </div>

          <div className="feature-item">
            ✅ Technical + HR Questions
          </div>

          <div className="feature-item">
            ✅ Track Your Progress
          </div>

        </div>

      </div>


      {/* Right Side */}

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back 👋</h2>

          <p>
            Login to continue your interview preparation.
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="input-box">

              <FaEnvelope className="icon" />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            {/* Password */}

            <div className="input-box">

              <FaLock className="icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>


            {/* Options */}

            <div className="options">

              <label>

                <input type="checkbox" />

                Remember Me

              </label>

              <Link to="#">
                Forgot Password?
              </Link>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>


          <div className="divider">
            <span>OR</span>
          </div>


          <button className="google-btn">
            <FaGoogle />
            Continue with Google
          </button>


          <button className="github-btn">
            <FaGithub />
            Continue with GitHub
          </button>


          <p className="signup-link">

            Don't have an account?

            <Link to="/signup">
              {" "}Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;