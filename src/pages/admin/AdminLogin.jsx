import "./Admin.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8081";

  // =========================================================
  // ADMIN LOGIN
  // =========================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!email.trim()) {
      setError("Please enter admin email.");
      return;
    }

    if (!password) {
      setError("Please enter password.");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      // -------------------------------------------------------
      // LOGIN API
      // -------------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // -------------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Admin login response:",
        data
      );

      // -------------------------------------------------------
      // LOGIN FAILED
      // -------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Login failed: ${response.status}`
        );
      }

      // -------------------------------------------------------
      // JWT TOKEN CHECK
      // -------------------------------------------------------

      if (!data.token) {
        console.error(
          "JWT token missing from backend response:",
          data
        );

        throw new Error(
          "Login successful, but JWT token was not received from server."
        );
      }

      // -------------------------------------------------------
      // SAVE ADMIN INFORMATION
      // -------------------------------------------------------

      localStorage.setItem(
        "admin",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        })
      );

      // -------------------------------------------------------
      // SAVE ADMIN ID
      // -------------------------------------------------------

      localStorage.setItem(
        "adminId",
        String(data.id)
      );

      // -------------------------------------------------------
      // SAVE JWT TOKEN
      // -------------------------------------------------------

      localStorage.setItem(
        "adminToken",
        data.token
      );

      // -------------------------------------------------------
      // SAVE LOGIN STATUS
      // -------------------------------------------------------

      localStorage.setItem(
        "isAdminLoggedIn",
        "true"
      );

      // -------------------------------------------------------
      // VERIFY TOKEN WAS SAVED
      // -------------------------------------------------------

      const savedToken =
        localStorage.getItem(
          "adminToken"
        );

      console.log(
        "Admin login successful:",
        data
      );

      console.log(
        "JWT token saved:",
        Boolean(savedToken)
      );

      // -------------------------------------------------------
      // GO TO ADMIN DASHBOARD
      // -------------------------------------------------------

      navigate("/admin");

    } catch (err) {

      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.message ||
          "Unable to login. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="admin-page">

      <div className="admin-card">

        {/* =====================================================
             HEADER
             ===================================================== */}

        <div className="admin-header">

          <div className="admin-icon">
            🔐
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Login to your administrator account
          </p>

        </div>


        {/* =====================================================
             ERROR
             ===================================================== */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* =====================================================
             LOGIN FORM
             ===================================================== */}

        <form onSubmit={handleLogin}>

          {/* ===================================================
               EMAIL
               =================================================== */}

          <div className="admin-form-group">

            <label htmlFor="admin-login-email">
              Email
            </label>

            <input
              id="admin-login-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              disabled={loading}
              autoComplete="email"
              onChange={(event) => {
                setEmail(
                  event.target.value
                );
              }}
            />

          </div>


          {/* ===================================================
               PASSWORD
               =================================================== */}

          <div className="admin-form-group">

            <label htmlFor="admin-login-password">
              Password
            </label>

            <input
              id="admin-login-password"
              type="password"
              placeholder="Enter password"
              value={password}
              disabled={loading}
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
              }}
            />

          </div>


          {/* ===================================================
               LOGIN BUTTON
               =================================================== */}

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>

        </form>


        {/* =====================================================
             FOOTER
             ===================================================== */}

        <div className="admin-footer">

          <span>
            Don't have an admin account?
          </span>

          <Link to="/admin/register">
            Create Admin Account
          </Link>

        </div>

      </div>

    </section>
  );
}

export default AdminLogin;