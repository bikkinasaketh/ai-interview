import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

 <div className="logo">
  🤖 AI Interview Coach
</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="nav-buttons">
        <Link to="/login" className="nav-btn login-btn">
          Login
        </Link>

        <Link to="/signup" className="nav-btn signup-btn">
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;