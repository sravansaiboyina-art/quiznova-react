import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import questions from "../data/questions";
import { getQuestions, submitQuiz as submitQuizAPI } from "../services/api";

function Quiz() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(5);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    {
      name: "HTML",
      icon: "bi-filetype-html",
      color: "text-danger",
    },
    {
      name: "CSS",
      icon: "bi-filetype-css",
      color: "text-primary",
    },
    {
      name: "JavaScript",
      icon: "bi-filetype-js",
      color: "text-warning",
    },
    {
      name: "Bootstrap",
      icon: "bi-bootstrap-fill",
      color: "text-purple",
    },
    {
      name: "Aptitude",
      icon: "bi-calculator-fill",
      color: "text-success",
    },
    {
      name: "General Knowledge",
      icon: "bi-globe-central-south-asia",
      color: "text-info",
    },
    {
      name: "Science",
      icon: "bi-rocket-takeoff-fill",
      color: "text-secondary",
    },
  ];

  const difficulties = [
    {
      name: "Easy",
      icon: "bi-emoji-smile-fill",
      color: "text-success",
    },
    {
      name: "Medium",
      icon: "bi-emoji-neutral-fill",
      color: "text-warning",
    },
    {
      name: "Hard",
      icon: "bi-emoji-frown-fill",
      color: "text-danger",
    },
  ];

  const currentQuestion = quizQuestions[currentIndex];

  const progress = useMemo(() => {
    if (!quizQuestions.length) return 0;

    return Math.round(
      ((currentIndex + 1) / quizQuestions.length) * 100
    );
  }, [currentIndex, quizQuestions.length]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!started) return;

    if (timeLeft <= 0) {
      if (quizQuestions.length > 0 && !submitting) {
        submitQuiz();
      }

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, quizQuestions.length, submitting]);

  /* ================= START QUIZ ================= */

  async function startQuiz() {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!difficulty) {
      alert("Please select a difficulty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Questions are now requested from:
       *
       * React
       *   ↓
       * GET /api/questions
       *   ↓
       * Express
       *   ↓
       * MongoDB
       */

      const data = await getQuestions({
        category,
        difficulty,
        limit: questionCount,
      });

      if (!data.questions || data.questions.length === 0) {
        alert(
          "No questions available for this category and difficulty."
        );
        return;
      }

      /*
       * Backend intentionally does not send the correct answer.
       *
       * We temporarily match the backend question with the existing
       * local question database so your current Result page can still
       * display answer review.
       *
       * The actual score is also verified by the backend.
       */

      const backendQuestions = data.questions.map((backendQuestion) => {
        const localQuestion = questions.find(
          (localQuestion) =>
            Number(localQuestion.id) ===
            Number(backendQuestion.legacyId)
        );

        return {
          ...backendQuestion,

          // Used by the existing Result page for answer review.
          answer: localQuestion?.answer || null,

          // Keep the existing question id format compatible.
          id: backendQuestion.legacyId,
        };
      });

      setQuizQuestions(backendQuestions);
      setAnswers(new Array(backendQuestions.length).fill(null));
      setCurrentIndex(0);

      // 60 seconds per question
      setTimeLeft(backendQuestions.length * 60);

      localStorage.setItem("quizNovaUserName", name);
      localStorage.setItem("quizNovaCategory", category);
      localStorage.setItem("quizNovaDifficulty", difficulty);

      setStarted(true);
    } catch (err) {
      console.error("Failed to start quiz:", err);

      setError(
        err.message ||
          "Unable to connect to the QuizNova backend."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================= SELECT ANSWER ================= */

  function selectAnswer(answer) {
    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = answer;

    setAnswers(updatedAnswers);
  }

  /* ================= NEXT ================= */

  function nextQuestion() {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  }

  /* ================= PREVIOUS ================= */

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  }

  /* ================= SUBMIT ================= */

  async function submitQuiz() {
    if (!quizQuestions.length || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      /*
       * Convert frontend answers into the format expected by
       * the Express backend.
       */

      const formattedAnswers = quizQuestions.map(
        (question, index) => ({
          questionId: Number(
            question.legacyId ?? question.id
          ),
          selectedAnswer: answers[index] ?? null,
        })
      );

      /*
       * Send answers to:
       *
       * React
       *   ↓
       * POST /api/quizzes/submit
       *   ↓
       * Express
       *   ↓
       * MongoDB
       */

      const backendResponse = await submitQuizAPI({
        category,
        difficulty,
        answers: formattedAnswers,
        studentName: name,
      });

      const backendResult = backendResponse.result;

      /*
       * Backend is the source of truth for score.
       *
       * We keep the questions and selected answers in localStorage
       * so your existing Result page can continue showing the
       * answer review.
       */

      const resultData = {
        userName: name,
        category,
        difficulty,

        score: backendResult.score,
        total: backendResult.total,
        percentage: backendResult.percentage,

        questions: quizQuestions,
        answers,

        completedAt: new Date().toISOString(),

        // Backend result information
        backendResultId: backendResult.id,
        wrong: backendResult.wrong,
      };

      localStorage.setItem(
        "quizNovaResult",
        JSON.stringify(resultData)
      );

      setStarted(false);

      navigate("/result");
    } catch (err) {
      console.error("Quiz submission failed:", err);

      alert(
        err.message ||
          "Unable to submit quiz. Please check the backend."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= TIMER FORMAT ================= */

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  /* =====================================================
     SETUP PAGE
  ===================================================== */

  if (!started) {
    return (
      <>
        <Navbar />

        <section className="quiz-section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="setup-card">

                  <div className="text-center mb-5">
                    <h1 className="fw-bold">
                      Smart Quiz Generator
                    </h1>

                    <p className="text-muted">
                      Select your preferences and start learning.
                    </p>
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}

                  {/* NAME */}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Student Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    />
                  </div>

                  {/* CATEGORY */}

                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">
                      Select Category
                    </h5>

                    <div className="row g-3">
                      {categories.map((item) => (
                        <div
                          className="col-md-4"
                          key={item.name}
                        >
                          <div
                            className={`category-card ${
                              category === item.name
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setCategory(item.name)
                            }
                          >
                            <i
                              className={`bi ${item.icon} display-5 ${item.color}`}
                            ></i>

                            <h5 className="mt-3">
                              {item.name}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DIFFICULTY */}

                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">
                      Select Difficulty
                    </h5>

                    <div className="row g-3">
                      {difficulties.map((item) => (
                        <div
                          className="col-md-4"
                          key={item.name}
                        >
                          <div
                            className={`difficulty-card ${
                              difficulty === item.name
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setDifficulty(item.name)
                            }
                          >
                            <i
                              className={`bi ${item.icon} display-6 ${item.color}`}
                            ></i>

                            <h5 className="mt-3">
                              {item.name}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QUESTION COUNT */}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Number of Questions
                    </label>

                    <select
                      className="form-select"
                      value={questionCount}
                      onChange={(e) =>
                        setQuestionCount(
                          Number(e.target.value)
                        )
                      }
                    >
                      <option value={5}>
                        5 Questions
                      </option>

                      <option value={10}>
                        10 Questions
                      </option>

                      <option value={15}>
                        15 Questions
                      </option>

                      <option value={20}>
                        20 Questions
                      </option>
                    </select>
                  </div>

                  {/* START */}

                  <div className="text-center mt-4">
                    <button
                      className="btn btn-primary btn-lg px-5"
                      onClick={startQuiz}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>

                          Loading Questions...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-play-fill me-2"></i>
                          Start Quiz
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  /* =====================================================
     QUIZ RUNNING
  ===================================================== */

  return (
    <>
      <Navbar />

      <section className="quiz-section py-5">
        <div className="container">

          {/* HEADER */}

          <div className="quiz-header mb-4">

            <div>
              <h5 className="fw-bold mb-1">
                Hello, {name}
              </h5>

              <small className="text-muted">
                {category} • {difficulty}
              </small>
            </div>

            <div
              className={`timer ${
                timeLeft <= 30
                  ? "timer-warning"
                  : ""
              }`}
            >
              <i className="bi bi-clock me-2"></i>

              {formatTime(timeLeft)}
            </div>

          </div>

          {/* PROGRESS */}

          <div className="progress mb-4">
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          {/* QUESTION CARD */}

          {currentQuestion && (
            <div className="question-card">

              <div className="d-flex justify-content-between mb-4">

                <h6 className="fw-bold">
                  Question {currentIndex + 1} /{" "}
                  {quizQuestions.length}
                </h6>

                <span className="badge bg-primary">
                  {currentQuestion.difficulty}
                </span>

              </div>

              <h3 className="question-text mb-4">
                {currentQuestion.question}
              </h3>

              <div className="options-container">

                {currentQuestion.options.map(
                  (option, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`option-btn ${
                        answers[currentIndex] === option
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectAnswer(option)
                      }
                    >
                      <span className="option-number">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span>{option}</span>
                    </button>
                  )
                )}

              </div>

              {/* NAVIGATION */}

              <div className="d-flex justify-content-between mt-5">

                <button
                  className="btn btn-outline-secondary"
                  onClick={previousQuestion}
                  disabled={
                    currentIndex === 0 ||
                    submitting
                  }
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Previous
                </button>

                {currentIndex <
                quizQuestions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={nextQuestion}
                    disabled={submitting}
                  >
                    Next
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={submitQuiz}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Quiz
                      </>
                    )}
                  </button>
                )}

              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Quiz;