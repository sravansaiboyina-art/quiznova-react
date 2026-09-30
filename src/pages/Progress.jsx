import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/progress.css";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    try {
      const token = localStorage.getItem("quizNovaToken");

      if (!token) {
        throw new Error("Please login to view your progress.");
      }

      const response = await fetch(
        "/api/progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load progress"
        );
      }

      setProgress(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="progress-loading">
          <div className="spinner-border text-primary"></div>
          <p>Loading your progress...</p>
        </div>

        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div className="progress-error">
          <i className="bi bi-exclamation-circle"></i>

          <h3>Unable to Load Progress</h3>

          <p>{error}</p>

          <Link to="/home" className="btn btn-primary">
            Back to Home
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const {
    summary,
    attempts,
    categoryPerformance,
    difficultyPerformance,
    feedback,
  } = progress;

  return (
    <>
      <Navbar />

      <main className="progress-page">

        {/* Header */}

        <section className="progress-header">
          <div className="container text-center">
            <span className="progress-badge">
              <i className="bi bi-graph-up-arrow me-2"></i>
              Learning Analytics
            </span>

            <h1>
              My <span>Progress</span>
            </h1>

            <p>
              Track your quiz performance and improve your
              learning journey.
            </p>
          </div>
        </section>

        <div className="container">

          {/* Summary Cards */}

          <section className="progress-summary">

            <div className="progress-card">
              <div className="progress-card-icon">
                <i className="bi bi-journal-check"></i>
              </div>

              <div>
                <h3>{summary.totalQuizzes}</h3>
                <p>Total Quizzes</p>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-card-icon">
                <i className="bi bi-bar-chart-fill"></i>
              </div>

              <div>
                <h3>{summary.averagePercentage}%</h3>
                <p>Average Score</p>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-card-icon">
                <i className="bi bi-trophy-fill"></i>
              </div>

              <div>
                <h3>{summary.bestPercentage}%</h3>
                <p>Best Score</p>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-card-icon">
                <i className="bi bi-question-circle-fill"></i>
              </div>

              <div>
                <h3>{summary.totalQuestions}</h3>
                <p>Questions Attempted</p>
              </div>
            </div>

          </section>

          {/* Performance Chart */}

          <section className="progress-section">

            <div className="section-title">
              <h2>
                <i className="bi bi-activity me-2"></i>
                Performance Over Time
              </h2>

              <p>
                Your quiz scores across previous attempts.
              </p>
            </div>

            <div className="performance-chart">

              {attempts.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-bar-chart"></i>
                  <p>
                    Complete a quiz to start tracking your
                    performance.
                  </p>
                </div>
              ) : (
                <div className="chart-bars">

                  {attempts.map((attempt) => (
                    <div
                      className="chart-item"
                      key={attempt.attempt}
                    >

                      <div className="chart-value">
                        {attempt.percentage}%
                      </div>

                      <div className="bar-wrapper">
                        <div
                          className="chart-bar"
                          style={{
                            height: `${Math.max(
                              attempt.percentage,
                              5
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <span>
                        Quiz {attempt.attempt}
                      </span>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </section>

          {/* Category Performance */}

          <section className="progress-section">

            <div className="section-title">
              <h2>
                <i className="bi bi-grid-fill me-2"></i>
                Category Performance
              </h2>

              <p>
                Identify how you are performing in each
                category.
              </p>
            </div>

            <div className="performance-list">

              {categoryPerformance.map((item) => (
                <div
                  className="performance-row"
                  key={item.category}
                >

                  <div className="performance-label">
                    <span>{item.category}</span>
                    <strong>{item.average}%</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${item.average}%`,
                      }}
                    ></div>
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* Difficulty Performance */}

          <section className="progress-section">

            <div className="section-title">
              <h2>
                <i className="bi bi-speedometer2 me-2"></i>
                Difficulty Performance
              </h2>

              <p>
                Compare your performance across difficulty
                levels.
              </p>
            </div>

            <div className="difficulty-grid">

              {difficultyPerformance.map((item) => (
                <div
                  className="difficulty-card"
                  key={item.difficulty}
                >

                  <div className="difficulty-icon">
                    <i className="bi bi-lightning-charge-fill"></i>
                  </div>

                  <h4>{item.difficulty}</h4>

                  <div className="difficulty-score">
                    {item.average}%
                  </div>

                  <p>
                    {item.attempts} attempt
                    {item.attempts !== 1 ? "s" : ""}
                  </p>

                </div>
              ))}

            </div>

          </section>

          {/* Feedback */}

          <section className="feedback-section">

            <div className="feedback-header">
              <div className="feedback-icon">
                <i className="bi bi-lightbulb-fill"></i>
              </div>

              <div>
                <span>Personalized Feedback</span>

                <h2>{feedback.level}</h2>
              </div>
            </div>

            <p className="feedback-message">
              {feedback.message}
            </p>

            <div className="recommendation-box">
              <i className="bi bi-arrow-right-circle-fill"></i>

              <div>
                <h5>Recommendation</h5>

                <p>
                  {feedback.recommendation}
                </p>
              </div>
            </div>

            {feedback.weakArea && (
              <div className="weak-area-box">

                <i className="bi bi-exclamation-triangle-fill"></i>

                <div>
                  <h5>Area to Improve</h5>

                  <p>
                    Your lowest-performing category is{" "}
                    <strong>
                      {feedback.weakArea.category}
                    </strong>{" "}
                    with an average score of{" "}
                    <strong>
                      {feedback.weakArea.average}%
                    </strong>
                    . Consider practicing more quizzes in
                    this category.
                  </p>
                </div>

              </div>
            )}

            {feedback.improvement && (
              <div className="improvement-box">

                <i className="bi bi-arrow-up-right-circle-fill"></i>

                <p>
                  {feedback.improvement}
                </p>

              </div>
            )}

            <Link
              to="/quiz"
              className="btn btn-primary feedback-button"
            >
              <i className="bi bi-play-fill me-2"></i>
              Practice More Quizzes
            </Link>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Progress;