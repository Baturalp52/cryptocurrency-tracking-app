import axios from "axios";
import { getCookie, removeCookie } from "@/utils/cookies";
import { TOKEN_COOKIE_NAME } from "@/utils/constants";
import { deleteCookieServer, getCookieServer } from "@/utils/cookies-server";

// Create a base axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from cookies if it exists
    let token;

    if (typeof window !== "undefined") {
      token = getCookie(TOKEN_COOKIE_NAME);
    } else {
      token = await getCookieServer(TOKEN_COOKIE_NAME);
    }

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear user data from cookies
      if (typeof window !== "undefined") {
        removeCookie(TOKEN_COOKIE_NAME);

        // Redirect to login page if not already there
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
      } else {
        await deleteCookieServer(TOKEN_COOKIE_NAME);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
