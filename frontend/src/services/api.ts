// =================================================================
// services/api.ts — Shared Axios HTTP Client
//
// Centralizes the backend baseURL so we don't repeat
// "http://localhost:3000/api" in every component or service.
// =================================================================

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
