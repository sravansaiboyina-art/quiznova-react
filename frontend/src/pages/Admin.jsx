import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
  getAdminAttempts,
} from "../services/api";
import "../css/admin.css";

const emptyForm = {
  category: "HTML",
  difficulty: "Easy",
  question: "",
  options: ["", "", "", ""],
  answer: "",
};

function Admin() {
  const user = JSON.parse(localStorage.getItem("quizNovaUser") || "null");
  const token = localStorage.getItem("quizNovaToken");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = Boolean(token && user?.role === "admin");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsData, usersData, questionsData, attemptsData] =
        await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getAdminQuestions(),
          getAdminAttempts(),
        ]);

      setStats(statsData);
      setUsers(usersData.users || []);
      setQuestions(questionsData.questions || []);
      setAttempts(attemptsData.attempts || []);
    } catch (err) {
      setError(err.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAdminData();
  }, [isAdmin]);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return questions;

    return questions.filter(
      (q) =>
        q.question.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.difficulty.toLowerCase().includes(term)
    );
  }, [questions, search]);

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  const updateOption = (index, value) => {
    setForm((current) => {
      const options = [...current.options];
      options[index] = value;
      return { ...current, options };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        options: form.options.filter((option) => option.trim()),
      };

      if (editingId) {
        await updateAdminQuestion(editingId, payload);
        setMessage("Question updated successfully.");
      } else {
        await createAdminQuestion(payload);
        setMessage("Question added successfully.");
      }

      resetForm();
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Unable to save question.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (question) => {
    setEditingId(question._id);
    setForm({
      category: question.category,
      difficulty: question.difficulty,
      question: question.question,
      options: [...question.options, "", "", "", ""].slice(0, 4),
      answer: question.answer,
    });
    setActiveTab("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question permanently?")) return;

    try {
      await deleteAdminQuestion(id);
      setMessage("Question deleted.");
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Unable to delete question.");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const data = await updateAdminUserRole(id, role);
      setUsers((current) =>
        current.map((item) => (item._id === id ? data.user : item))
      );
      setMessage("User role updated.");
    } catch (err) {
      setError(err.message || "Unable to update user role.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <section className="admin-hero">
          <div className="container">
            <div className="admin-hero-content">
              <div>
                <span className="admin-badge">
                  <i className="bi bi-shield-lock-fill me-2"></i>
                  Administrator Panel
                </span>
                <h1>QuizNova Admin Dashboard</h1>
                <p>
                  Manage users, questions and quiz activity from one secure
                  control center.
                </p>
              </div>
              <div className="admin-profile">
                <i className="bi bi-person-circle"></i>
                <div>
                  <strong>{user?.name || "Administrator"}</strong>
                  <small>{user?.email}</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container admin-container">
          {message && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle-fill me-2"></i>
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="admin-tabs">
            {[
              ["overview", "speedometer2", "Overview"],
              ["questions", "patch-question-fill", "Questions"],
              ["users", "people-fill", "Users"],
              ["attempts", "bar-chart-fill", "Quiz Attempts"],
            ].map(([key, icon, label]) => (
              <button
                key={key}
                className={activeTab === key ? "active" : ""}
                onClick={() => setActiveTab(key)}
              >
                <i className={"bi bi-" + icon}></i>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="spinner-border text-primary"></div>
              <p>Loading administrator data...</p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && stats && (
                <>
                  <section className="admin-stat-grid">
                    <StatCard icon="people-fill" value={stats.users} label="Total Users" />
                    <StatCard icon="mortarboard-fill" value={stats.students} label="Students" />
                    <StatCard icon="patch-question-fill" value={stats.questions} label="Questions" />
                    <StatCard icon="journal-check" value={stats.attempts} label="Quiz Attempts" />
                    <StatCard icon="graph-up-arrow" value={stats.averagePercentage + "%"} label="Average Score" />
                    <StatCard icon="check2-circle" value={stats.totalCorrect} label="Correct Answers" />
                  </section>

                  <section className="admin-panel">
                    <div className="admin-panel-header">
                      <div>
                        <span>Quick Actions</span>
                        <h2>Manage QuizNova</h2>
                      </div>
                    </div>
                    <div className="quick-actions">
                      <button onClick={() => setActiveTab("questions")}>
                        <i className="bi bi-plus-circle-fill"></i>
                        Add / Manage Questions
                      </button>
                      <button onClick={() => setActiveTab("users")}>
                        <i className="bi bi-people-fill"></i>
                        Manage Users
                      </button>
                      <button onClick={() => setActiveTab("attempts")}>
                        <i className="bi bi-bar-chart-fill"></i>
                        View Quiz Attempts
                      </button>
                    </div>
                  </section>
                </>
              )}

              {activeTab === "questions" && (
                <section className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <span>Question Bank</span>
                      <h2>{editingId ? "Edit Question" : "Add New Question"}</h2>
                    </div>
                    {editingId && (
                      <button className="btn btn-outline-secondary" onClick={resetForm}>
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form className="admin-question-form" onSubmit={handleQuestionSubmit}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label>Category</label>
                        <select
                          className="form-select"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                          {["HTML", "CSS", "JavaScript", "Bootstrap", "Aptitude", "General Knowledge", "Science"].map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label>Difficulty</label>
                        <select
                          className="form-select"
                          value={form.difficulty}
                          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label>Correct Answer</label>
                        <select
                          className="form-select"
                          value={form.answer}
                          onChange={(e) => setForm({ ...form, answer: e.target.value })}
                        >
                          <option value="">Select correct option</option>
                          {form.options.filter((option) => option.trim()).map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label>Question</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          required
                          value={form.question}
                          onChange={(e) => setForm({ ...form, question: e.target.value })}
                          placeholder="Enter the quiz question"
                        />
                      </div>

                      {form.options.map((option, index) => (
                        <div className="col-md-6" key={index}>
                          <label>Option {String.fromCharCode(65 + index)}</label>
                          <input
                            className="form-control"
                            required={index < 2}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={"Option " + String.fromCharCode(65 + index)}
                          />
                        </div>
                      ))}

                      <div className="col-12">
                        <button className="btn btn-primary me-2" disabled={saving}>
                          {saving ? "Saving..." : editingId ? "Update Question" : "Add Question"}
                        </button>
                        <button type="button" className="btn btn-light" onClick={resetForm}>
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="admin-table-header">
                    <h3>Question Bank ({questions.length})</h3>
                    <input
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search questions..."
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table admin-table align-middle">
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Category</th>
                          <th>Difficulty</th>
                          <th>Answer</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuestions.map((question) => (
                          <tr key={question._id}>
                            <td>
                              <strong>{question.question}</strong>
                              <small>#{question.legacyId}</small>
                            </td>
                            <td>{question.category}</td>
                            <td><span className={"difficulty-pill " + question.difficulty.toLowerCase()}>{question.difficulty}</span></td>
                            <td>{question.answer}</td>
                            <td className="text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(question)}>
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(question._id)}>
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === "users" && (
                <section className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <span>User Management</span>
                      <h2>Registered Users</h2>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table admin-table align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Change Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((item) => (
                          <tr key={item._id}>
                            <td><strong>{item.name}</strong></td>
                            <td>{item.email}</td>
                            <td>
                              <span className={item.role === "admin" ? "role-badge admin" : "role-badge student"}>
                                {item.role}
                              </span>
                            </td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={item.role}
                                onChange={(e) => handleRoleChange(item._id, e.target.value)}
                              >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === "attempts" && (
                <section className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <span>Quiz Analytics</span>
                      <h2>Recent Quiz Attempts</h2>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table admin-table align-middle">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Category</th>
                          <th>Difficulty</th>
                          <th>Score</th>
                          <th>Percentage</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempts.map((attempt) => (
                          <tr key={attempt._id}>
                            <td>
                              <strong>{attempt.user?.name || attempt.studentName || "Guest"}</strong>
                              <small>{attempt.user?.email || ""}</small>
                            </td>
                            <td>{attempt.category}</td>
                            <td>{attempt.difficulty}</td>
                            <td>{attempt.score}/{attempt.total}</td>
                            <td><strong>{attempt.percentage}%</strong></td>
                            <td>{new Date(attempt.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">
        <i className={"bi bi-" + icon}></i>
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Admin;
