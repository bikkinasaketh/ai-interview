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

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Mobile number validation
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8081/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

         body: JSON.stringify({
  name: name,
  email: email,
  phone: phone,
  password: password
})
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Signup successful! 🎉");

        console.log(data);

        // Go to login page
        navigate("/login");

      } else {

        alert(data.message || "Signup failed!");

      }

    } catch (error) {

      console.error(error);

      alert("Backend connection failed!");

    }
  };

  return (

    <div className="signup-container">

      {/* LEFT SIDE */}

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


      {/* RIGHT SIDE */}

      <div className="signup-right">

        <div className="signup-card">

          <h2>Create Account 🚀</h2>

          <p>
            Join AI Interview Coach Today
          </p>


          <form onSubmit={handleSignup}>

            {/* NAME */}

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


            {/* EMAIL */}

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


            {/* PHONE */}

            <div className="input-box">

              <FaPhone className="icon" />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                maxLength="10"
                required
              />

            </div>


            {/* PASSWORD */}

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


            {/* CONFIRM PASSWORD */}

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
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >

                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>


            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              className="signup-btn"
            >
              Create Account
            </button>

          </form>


          {/* LOGIN */}

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