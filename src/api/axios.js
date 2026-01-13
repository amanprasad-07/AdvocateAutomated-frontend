import axios from "axios";

/**
 * Centralized Axios Client
 *
 * Provides a preconfigured Axios instance
 * for making HTTP requests to the backend API.
 *
 * Features:
 * - Configurable base API URL via environment variables
 * - Cookie-based authentication support
 * - Global request timeout to prevent hanging calls
 */
const axiosInstance = axios.create({
  // Base URL for all API requests
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",

  // Enables sending HttpOnly JWT cookies with requests
  withCredentials: true,

  // Global request timeout in milliseconds
  timeout: 10000
});

export default axiosInstance;
