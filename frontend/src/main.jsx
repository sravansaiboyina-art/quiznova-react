import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./css/style.css";
import "./css/responsive.css";
import "./css/about.css";
import "./css/quiz.css";
import "./css/result.css";
import "./css/contact.css";
import "./css/login.css";
import "./css/progress.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);