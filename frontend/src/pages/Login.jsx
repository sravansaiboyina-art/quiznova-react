import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (isRegister && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = isRegister
        ? await registerUser({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await loginUser({
            email: email.trim(),
            password,
          });

      if (!data?.token || !data?.user) {
        throw new Error("The server returned an incomplete login response.");
      }

      localStorage.setItem("quizNovaToken", data.token);
      localStorage.setItem("quizNovaUser", JSON.stringify(data.user));
      localStorage.setItem("quizNovaLoginEmail", email.trim());

      if (remember) {
        localStorage.setItem("quizNovaRemember", "true");
      } else {
        localStorage.removeItem("quizNovaRemember");
      }

      setMessage(
        isRegister
          ? "Account created successfully! Redirecting..."
          : "Login successful! Redirecting..."
      );

      window.setTimeout(() => {
        navigate("/home", { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || "Unable to connect to the QuizNova server.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister((previous) => !previous);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
    setError("");
    setShowPassword(false);
  }

  return (
    <div className="login-screen">
      <section className="login-brand">
        <div className="brand-content">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <h1>
            Quiz<span>Nova</span>
          </h1>

          <h2>
            Learn. Practice.
            <br />
            Improve.
          </h2>

          <p>
            Test your knowledge, improve your skills, and track your learning
            journey with QuizNova.
          </p>

          <div className="brand-features">
            <div>
              <i className="bi bi-check-circle-fill"></i>
              500+ Practice Questions
            </div>
            <div>
              <i className="bi bi-check-circle-fill"></i>
              Multiple Categories
            </div>
            <div>
              <i className="bi bi-check-circle-fill"></i>
              Instant Results
            </div>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-logo">
            <div className="mobile-logo-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h2>QuizNova</h2>
          </div>

          <div className="login-heading">
            <span className="login-badge">
              <i className="bi bi-stars"></i>
              Smart Quiz Generator
            </span>

            <h2>{isRegister ? "Create your account" : "Welcome back!"}</h2>

            <p>
              {isRegister
                ? "Join QuizNova and start your learning journey."
                : "Login to continue your learning journey."}
            </p>
          </div>

          {error && (
            <div className="login-alert error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="login-alert success">
              <i className="bi bi-check-circle-fill"></i>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="login-field">
                <label htmlFor="name">Full Name</label>
                <div className="login-input">
                  <i className="bi bi-person"></i>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input">
                <i className="bi bi-envelope"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="password-label">
                <label htmlFor="password">Password</label>
              </div>

              <div className="login-input">
                <i className="bi bi-lock"></i>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isRegister ? "Create a password" : "Enter your password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={
                      showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {!isRegister && (
              <div className="login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Please wait...
                </>
              ) : (
                <>
                  <i
                    className={
                      isRegister
                        ? "bi bi-person-plus-fill"
                        : "bi bi-box-arrow-in-right"
                    }
                  ></i>
                  {isRegister ? "Create Account" : "Login"}
                </>
              )}
            </button>
          </form>

          <div className="login-switch">
            {isRegister ? (
              <>
                Already have an account?
                <button type="button" onClick={switchMode}>
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?
                <button type="button" onClick={switchMode}>
                  Create Account
                </button>
              </>
            )}
          </div>

          <div className="login-bottom">
            <p>© 2026 QuizNova. All Rights Reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
