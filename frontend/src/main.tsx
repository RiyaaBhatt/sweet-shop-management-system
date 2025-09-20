/**
 * @fileoverview Application Entry Point
 * This is the main entry point for the React application.
 * It sets up the root render with React.StrictMode for development safety.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
