import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Progress from "./pages/progress";

/* =========================
   PUBLIC ROUTE
========================= */

function PublicRoute({ children }) {
  const token = localStorage.getItem("quizNovaToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

/* =========================
   PRIVATE ROUTE
========================= */

function PrivateRoute({ children }) {
  const token = localStorage.getItem("quizNovaToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Home */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Protected Quiz */}
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />

        {/* Protected Result */}
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />

        {/* Protected About */}
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />

        {/* Protected Contact */}
        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />
        <Route
  path="/progress"
  element={
    <PrivateRoute>
      <Progress />
    </PrivateRoute>
  }
/>

        {/* Invalid URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;