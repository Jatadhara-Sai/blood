import axios from "axios";

// Set base URL from environment variable or fallback to localhost
const API = axios.create({
  baseURL: process.env.REACT_APP_BASEURL?.trim() || "http://localhost:8080/api/v1",
});

// Attach token to every request if available
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token")?.trim(); // Trim to avoid extra spaces
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle global response errors (optional but useful)
API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token"); // Remove invalid token
      window.location.replace("/login"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;