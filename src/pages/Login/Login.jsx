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

  // =========================================================
  // USER LOGIN
  // =========================================================

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
            email: email.trim(),
            password: password
          })
        }
      );

      // =======================================================
      // LOGIN SUCCESS
      // =======================================================

      if (response.ok) {

        const data = await response.json();

        console.log(
          "Login user data:",
          data
        );


        // =====================================================
        // CHECK JWT TOKEN
        // =====================================================

        if (!data.token) {

          console.error(
            "JWT token was not returned:",
            data
          );

          alert(
            "Login succeeded, but JWT token was not returned by backend."
          );

          return;
        }


        // =====================================================
        // SAVE COMPLETE USER
        // =====================================================

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );


        // =====================================================
        // SAVE USER ID
        // =====================================================

        if (data.id) {

          localStorage.setItem(
            "userId",
            String(data.id)
          );

          console.log(
            "Saved PostgreSQL userId:",
            data.id
          );

        } else {

          console.error(
            "Login response does not contain user id:",
            data
          );

          alert(
            "Login succeeded, but user ID was not returned by backend."
          );

          return;
        }


        // =====================================================
        // SAVE JWT TOKEN
        // =====================================================

        localStorage.setItem(
          "userToken",
          data.token
        );

        console.log(
          "User JWT token saved:",
          Boolean(
            localStorage.getItem(
              "userToken"
            )
          )
        );


        // =====================================================
        // CLEAR OLD INTERVIEW DATA
        // =====================================================

        localStorage.removeItem(
          "interviewAnswers"
        );

        localStorage.removeItem(
          "interviewScore"
        );

        localStorage.removeItem(
          "currentInterviewCounted"
        );


        // =====================================================
        // SUCCESS
        // =====================================================

        alert(
          "✅ Login Successful!"
        );

        navigate("/profile");

      } else {

        // =====================================================
        // LOGIN FAILED
        // =====================================================

        let errorMessage =
          "Invalid email or password";

        try {

          const errorData =
            await response.json();

          if (errorData?.message) {

            errorMessage =
              errorData.message;

          } else if (errorData?.error) {

            errorMessage =
              errorData.error;
          }

        } catch (error) {

          console.error(
            "Unable to read login error:",
            error
          );
        }

        alert(
          `❌ ${errorMessage}`
        );
      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        "❌ Backend connection failed!"
      );
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="login-container">

      {/* =====================================================
          LEFT SIDE
          ===================================================== */}

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


      {/* =====================================================
          RIGHT SIDE
          ===================================================== */}

      <div className="login-right">

        <div className="login-card">

          <h2>
            Welcome Back 👋
          </h2>

          <p>
            Login to continue your interview preparation.
          </p>


          {/* =================================================
              LOGIN FORM
              ================================================= */}

          <form onSubmit={handleLogin}>

            {/* =================================================
                EMAIL
                ================================================= */}

            <div className="input-box">

              <FaEnvelope className="icon" />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================================
                PASSWORD
                ================================================= */}

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
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>


            {/* =================================================
                OPTIONS
                ================================================= */}

            <div className="options">

              <label>

                <input
                  type="checkbox"
                />

                Remember Me

              </label>

              <Link to="#">
                Forgot Password?
              </Link>

            </div>


            {/* =================================================
                LOGIN BUTTON
                ================================================= */}

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>


          {/* =================================================
              DIVIDER
              ================================================= */}

          <div className="divider">

            <span>
              OR
            </span>

          </div>


          {/* =================================================
              GOOGLE
              ================================================= */}

          <button
            type="button"
            className="google-btn"
          >

            <FaGoogle />

            Continue with Google

          </button>


          {/* =================================================
              GITHUB
              ================================================= */}

          <button
            type="button"
            className="github-btn"
          >

            <FaGithub />

            Continue with GitHub

          </button>


          {/* =================================================
              SIGN UP
              ================================================= */}

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