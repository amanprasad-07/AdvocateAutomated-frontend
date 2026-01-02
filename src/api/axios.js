import axios from "axios";

/**
 * Centralized Axios client used across the application.
 * Configures the base API URL and enables cookie-based
 * authentication for protected backend endpoints.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // Required to send HttpOnly JWT cookies
  timeout: 10000 // Prevents hanging requests (10 seconds)
});

export default axiosInstance;
