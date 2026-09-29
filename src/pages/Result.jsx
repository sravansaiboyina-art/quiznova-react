import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Result() {
  const storedResult = localStorage.getItem("quizNovaResult");

  if (!storedResult) {
    return (
      <>
        <Navbar />

        <div className="container py-5 text-center">
          <h2>No quiz result found.</h2>

          <Link
            to="/quiz"
            className="btn btn-primary mt-3"
          >
            Start Quiz
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const result = JSON.parse(storedResult);

  const studentName =
    result.userName || "Student";

  const total = Number(result.total) || 0;
  const score = Number(result.score) || 0;

  const percentage =
    total > 0
      ? Math.round((score / total) * 100)
      : 0;

  const wrong = Math.max(total - score, 0);

  function getPerformance(value) {
    if (value >= 90) return "Excellent";
    if (value >= 75) return "Very Good";
    if (value >= 60) return "Good";
    if (value >= 40) return "Average";

    return "Needs Improvement";
  }

  function getPerformanceMessage(value) {
    if (value >= 90) {
      return "Outstanding performance! Keep up the excellent work.";
    }

    if (value >= 75) {
      return "Great job! You have a strong understanding of the topic.";
    }

    if (value >= 60) {
      return "Good work! Keep practicing to improve your score.";
    }

    if (value >= 40) {
      return "You are making progress. Practice more and try again.";
    }

    return "Keep learning and practicing. You can improve your score.";
  }

  return (
    <>
      <Navbar />

      <main className="result-page py-5">

        <div className="container">

          {/* HEADER */}

          <div className="text-center mb-5">

            <h1 className="fw-bold">
              Quiz Result
            </h1>

            <p className="text-muted">
              Well done,{" "}
              <strong>{studentName}</strong>!
            </p>

            <div className="mt-3">
              <span className="badge bg-primary me-2">
                {result.category}
              </span>

              <span className="badge bg-secondary">
                {result.difficulty}
              </span>
            </div>

          </div>

          {/* RESULT CARDS */}

          <div className="row g-4">

            {/* SCORE */}

            <div className="col-6 col-lg-3">
              <div className="result-card">

                <div className="result-card-icon">
                  <i className="bi bi-trophy-fill"></i>
                </div>

                <span>Score</span>

                <h2>
                  {score} / {total}
                </h2>

              </div>
            </div>

            {/* CORRECT */}

            <div className="col-6 col-lg-3">
              <div className="result-card">

                <div className="result-card-icon correct">
                  <i className="bi bi-check-circle-fill"></i>
                </div>

                <span>Correct</span>

                <h2>
                  {score}
                </h2>

              </div>
            </div>

            {/* WRONG */}

            <div className="col-6 col-lg-3">
              <div className="result-card">

                <div className="result-card-icon wrong">
                  <i className="bi bi-x-circle-fill"></i>
                </div>

                <span>Wrong</span>

                <h2>
                  {wrong}
                </h2>

              </div>
            </div>

            {/* PERCENTAGE */}

            <div className="col-6 col-lg-3">
              <div className="result-card">

                <div className="result-card-icon percentage">
                  <i className="bi bi-percent"></i>
                </div>

                <span>Percentage</span>

                <h2>
                  {percentage}%
                </h2>

              </div>
            </div>

          </div>

          {/* PERFORMANCE */}

          <div className="performance-card mt-4">

            <div className="performance-content">

              <div>

                <span>
                  Your Performance
                </span>

                <h2>
                  {getPerformance(percentage)}
                </h2>

                <p>
                  {getPerformanceMessage(
                    percentage
                  )}
                </p>

              </div>

              <div className="performance-circle">
                <span>
                  {percentage}%
                </span>
              </div>

            </div>

          </div>

          {/* REVIEW */}

          <div className="review-section mt-5">

            <div className="section-heading">

              <h2>
                <i className="bi bi-clipboard-check me-2"></i>
                Review Answers
              </h2>

              <p>
                Check your answers and learn
                from your mistakes.
              </p>

            </div>

            <div>

              {result.questions?.map(
                (question, index) => {

                  const userAnswer =
                    result.answers?.[index];

                  const isCorrect =
                    userAnswer ===
                    question.answer;

                  return (
                    <div
                      key={question.id || index}
                      className={`review-question ${
                        isCorrect
                          ? "correct-question"
                          : "wrong-question"
                      }`}
                    >

                      <h5>
                        Question {index + 1}
                      </h5>

                      <p className="fw-semibold">
                        {question.question}
                      </p>

                      <p>
                        <strong>
                          Your Answer:
                        </strong>{" "}
                        {userAnswer || "Not answered"}
                      </p>

                      {!isCorrect && (
                        <p>
                          <strong>
                            Correct Answer:
                          </strong>{" "}
                          {question.answer}
                        </p>
                      )}

                      <span
                        className={`badge ${
                          isCorrect
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {isCorrect
                          ? "Correct"
                          : "Wrong"}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* BUTTONS */}

          <div className="result-actions text-center mt-5">

            <Link
              to="/quiz"
              className="btn btn-primary btn-lg me-2"
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Retry Quiz
            </Link>

            <Link
              to="/"
              className="btn btn-outline-primary btn-lg"
            >
              <i className="bi bi-house-fill me-2"></i>
              Go Home
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Result;