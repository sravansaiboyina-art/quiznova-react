import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quizNovaUser") || "null");
    } catch {
      return null;
    }
  });
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const token = localStorage.getItem("quizNovaToken");
    if (!token) return;

    getCurrentUser(token)
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("quizNovaUser", JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Keep the existing local user state; protected routes handle invalid tokens.
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("quizNovaToken");
    localStorage.removeItem("quizNovaUser");
    localStorage.removeItem("quizNovaLoginEmail");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold text-primary" to="/home">
          <i className="bi bi-mortarboard-fill me-2"></i>
          QuizNova
        </Link>

        {/* Mobile Menu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#quizNovaNavbar"
          aria-controls="quizNovaNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="quizNovaNavbar">

          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/quiz">
                Quiz
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link className="nav-link fw-semibold" to="/admin">
                <i className="bi bi-shield-lock-fill me-1"></i>
                Admin
              </Link>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link
                className="btn btn-primary px-4"
                to="/quiz"
              >
                <i className="bi bi-play-fill me-1"></i>
                Start Quiz
              </Link>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <button
                className="btn btn-outline-danger px-4"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
            <li className="nav-item">
  <Link className="nav-link" to="/progress">
    <i className="bi bi-graph-up-arrow me-1"></i>
    Progress
  </Link>
</li>

          </ul>

        </div>
      </div>
    </nav>
  );
}


export default Navbar;