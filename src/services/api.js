const API_BASE_URL = "http://localhost:5000/api";

/* ================= QUESTIONS ================= */

export async function getQuestions({
  category = "",
  difficulty = "",
  limit = 10,
} = {}) {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);

  params.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/questions?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

/* ================= QUESTION META ================= */

export async function getQuestionMeta() {
  const response = await fetch(
    `${API_BASE_URL}/questions/meta`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch question categories");
  }

  return response.json();
}

/* ================= LOGIN ================= */

export async function loginUser({ email, password }) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}

/* ================= REGISTER ================= */

export async function registerUser({
  name,
  email,
  password,
}) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
}

/* ================= CURRENT USER ================= */

export async function getCurrentUser(token) {
  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Authentication failed"
    );
  }

  return data;
}

/* ================= QUIZ SUBMIT ================= */

export async function submitQuiz({
  category,
  difficulty,
  answers,
  studentName,
}) {
  const token = localStorage.getItem("quizNovaToken");

  if (!token) {
    throw new Error("Please login before submitting the quiz.");
  }

  const response = await fetch(
    `${API_BASE_URL}/quizzes/submit`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        category,
        difficulty,
        answers,
        studentName,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to submit quiz"
    );
  }

  return data;
}
export async function getMyResults() {
  const token = localStorage.getItem("quizNovaToken");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_BASE_URL}/quizzes/my-results`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch quiz results"
    );
  }

  return data;
}