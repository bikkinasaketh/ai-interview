import "./Admin.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://localhost:8081";

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter admin name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter email.");
      return;
    }

    if (!password) {
      setError("Please enter password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Registration failed: ${response.status}`
        );
      }

      setSuccess(
        "Admin registered successfully. Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1200);
    } catch (err) {
      console.error("Admin registration error:", err);

      setError(
        err.message ||
          "Unable to register admin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-card">

        <div className="admin-header">
          <div className="admin-icon">
            🛡️
          </div>

          <h1>Admin Register</h1>

          <p>
            Create an administrator account
          </p>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="admin-form-group">
            <label htmlFor="admin-name">
              Name
            </label>

            <input
              id="admin-name"
              type="text"
              placeholder="Enter admin name"
              value={name}
              disabled={loading}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              disabled={loading}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              disabled={loading}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Admin Account"}
          </button>
        </form>

        <div className="admin-footer">
          <span>
            Already have an admin account?
          </span>

          <Link to="/admin/login">
            Admin Login
          </Link>
        </div>

      </div>
    </section>
  );
}

export default AdminRegister;