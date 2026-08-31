import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRobot
} from "react-icons/fa";

function Signup() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {

    e.preventDefault();

    // ============================================
    // VALIDATION
    // ============================================

    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email!");
      return;
    }

    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }

    if (!password) {
      alert("Please enter a password!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    if (!confirmPassword) {
      alert("Please confirm your password!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // ============================================
    // REQUEST DATA
    // ============================================

    const signupData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password
    };

    console.log("SIGNUP REQUEST:", {
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      passwordPresent: Boolean(signupData.password),
      passwordLength: signupData.password.length
    });

    try {

      setLoading(true);

      // ==========================================
      // BACKEND REQUEST
      // ==========================================

      const response = await fetch(
        "http://localhost:8081/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          body: JSON.stringify(signupData)
        }
      );

      // ==========================================
      // READ RESPONSE
      // ==========================================

      const responseText = await response.text();

      let data = {};

      try {

        data = responseText
          ? JSON.parse(responseText)
          : {};

      } catch (parseError) {

        console.error(
          "Unable to parse backend response:",
          parseError
        );

        data = {
          message: responseText
        };
      }

      // ==========================================
      // DEBUG
      // ==========================================

      console.log(
        "SIGNUP HTTP STATUS:",
        response.status
      );

      console.log(
        "SIGNUP RESPONSE:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      if (response.ok) {

        alert(
          "Signup successful! 🎉"
        );

        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        // Go to login
        navigate("/login");

        return;
      }

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      let errorMessage =
        data?.message ||
        data?.error ||
        data?.detail;

      // Spring validation error
      if (
        !errorMessage &&
        data?.errors &&
        Array.isArray(data.errors)
      ) {

        errorMessage =
          data.errors
            .map(
              (error) =>
                error.defaultMessage ||
                error.message ||
                "Validation error"
            )
            .join("\n");
      }

      if (!errorMessage) {

        errorMessage =
          `Signup failed with HTTP ${response.status}`;
      }

      alert(
        `❌ ${errorMessage}`
      );

    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      alert(
        "❌ Backend connection failed! Make sure Spring Boot is running on port 8081."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="signup-container">

      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div className="signup-left">

        <img
          src="https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?w=700&auto=format&fit=crop&q=60"
          alt="AI Robot"
          className="robot-image"
        />

        <h1>
          <FaRobot /> AI Interview Coach
        </h1>

        <p>
          Create your account and start practicing
          AI-powered mock interviews to improve your
          technical and HR interview skills.
        </p>

        <div className="feature-list">

          <div className="feature-item">
            ✅ Unlimited Mock Interviews
          </div>

          <div className="feature-item">
            ✅ AI Performance Analysis
          </div>

          <div className="feature-item">
            ✅ Track Your Progress
          </div>

          <div className="feature-item">
            ✅ Interview Anytime
          </div>

        </div>

      </div>


      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="signup-right">

        <div className="signup-card">

          <h2>
            Create Account 🚀
          </h2>

          <p>
            Join AI Interview Coach Today
          </p>


          <form onSubmit={handleSignup}>

            {/* ======================================
                NAME
            ====================================== */}

            <div className="input-box">

              <FaUser className="icon" />

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>


            {/* ======================================
                EMAIL
            ====================================== */}

            <div className="input-box">

              <FaEnvelope className="icon" />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            {/* ======================================
                PHONE
            ====================================== */}

            <div className="input-box">

              <FaPhone className="icon" />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                maxLength={10}
                required
              />

            </div>


            {/* ======================================
                PASSWORD
            ====================================== */}

            <div className="input-box">

              <FaLock className="icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                minLength={6}
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


            {/* ======================================
                CONFIRM PASSWORD
            ====================================== */}

            <div className="input-box">

              <FaLock className="icon" />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                minLength={6}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >

                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>


            {/* ======================================
                SIGNUP BUTTON
            ====================================== */}

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* ========================================
              LOGIN
          ======================================== */}

          <p className="login-link">

            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;