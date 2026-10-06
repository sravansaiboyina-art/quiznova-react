const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

/**
 * Parse JSON safely so an HTML error page from a misconfigured deployment
 * never becomes "Unexpected token '<'".
 */
async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = null;
    }
  } else if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (raw && raw.trim().startsWith("<")
        ? "The API server returned an HTML page. Check the deployed backend URL."
        : "Request failed.");

    throw new Error(message);
  }

  if (data === null) {
    throw new Error(
      "The API server returned an invalid response. Check the backend deployment."
    );
  }

  return data;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  return readResponse(response);
}

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

  return request(`/questions?${params.toString()}`);
}

/* ================= QUESTION META ================= */

export async function getQuestionMeta() {
  return request("/questions/meta");
}

/* ================= LOGIN ================= */

export async function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

/* ================= REGISTER ================= */

export async function registerUser({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
}

/* ================= CURRENT USER ================= */

export async function getCurrentUser(token) {
  return request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

  return request("/quizzes/submit", {
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
  });
}

/* ================= MY RESULTS ================= */

export async function getMyResults() {
  const token = localStorage.getItem("quizNovaToken");

  if (!token) {
    throw new Error("Please login first.");
  }

  return request("/quizzes/my-results", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ================= PROGRESS ================= */

export async function getProgress() {
  const token = localStorage.getItem("quizNovaToken");

  if (!token) {
    throw new Error("Please login to view your progress.");
  }

  return request("/progress", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


/* ================= ADMIN ================= */

function adminHeaders() {
  const token = localStorage.getItem("quizNovaToken");
  if (!token) throw new Error("Please login as an administrator.");
  return { Authorization: `Bearer ${token}` };
}

export async function getAdminStats() {
  return request("/admin/stats", { headers: adminHeaders() });
}

export async function getAdminUsers() {
  return request("/admin/users", { headers: adminHeaders() });
}

export async function updateAdminUserRole(id, role) {
  return request(`/admin/users/${id}/role`, {
    method: "PATCH",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });
}

export async function getAdminQuestions() {
  return request("/admin/questions", { headers: adminHeaders() });
}

export async function createAdminQuestion(question) {
  return request("/admin/questions", {
    method: "POST",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
}

export async function updateAdminQuestion(id, question) {
  return request(`/admin/questions/${id}`, {
    method: "PUT",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
}

export async function deleteAdminQuestion(id) {
  return request(`/admin/questions/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

export async function getAdminAttempts() {
  return request("/admin/attempts", { headers: adminHeaders() });
}
