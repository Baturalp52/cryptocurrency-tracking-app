import axios from "axios";
import { getCookie, removeCookie } from "@/utils/cookies";
import { TOKEN_COOKIE_NAME } from "@/utils/constants";
import { getCookieServer } from "@/utils/cookies-server";
import { toast } from "react-toastify";

/**
 * Get the API URL based on the environment (server-side vs client-side)
 * In Docker:
 * - Server-side should use http://backend:80/api (internal Docker network)
 * - Client-side should use http://localhost:8000/api (browser access)
 */
const getApiUrl = () => {
  // Server-side rendering (Next.js server in Docker)
  if (typeof window === "undefined") {
    // Use the Docker service name for internal communication
    return process.env.SERVER_API_URL || "http://backend:80/api";
  }

  // Client-side rendering (browser)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
};

// Create a base axios instance with dynamic config
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Refresh the baseURL on each request to ensure it's up-to-date
    // This is important when the code is reused between server and client
    config.baseURL = getApiUrl();

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
    // Only show toast notifications in browser environment
    if (typeof window !== "undefined") {
      const { response } = error;

      if (response) {
        const { status, data } = response;

        // Handle specific status codes
        if (status >= 500) {
          // Server errors - show generic message
          toast.error(
            "The server is currently unavailable. Please try again later."
          );
        } else if (status === 401) {
          // Unauthorized - handled separately below
          toast.warning("Your session has expired. Please log in again.");
        } else if (status === 403) {
          // Forbidden
          const message =
            data?.message ||
            "You don't have permission to access this resource.";
          toast.error(message);
        } else {
          // All other errors (including validation errors)
          const message =
            data?.message || "An error occurred. Please try again.";

          // Show validation errors if available
          if (data?.errors) {
            const errorMessages = Object.entries(data.errors)
              .map(([field, messages]) => {
                const fieldErrors = Array.isArray(messages)
                  ? messages[0]
                  : messages;
                return `${field}: ${fieldErrors}`;
              })
              .join("\n");

            toast.error(
              <div>
                <div>{message}</div>
                <div className="text-muted fs-7">{errorMessages}</div>
              </div>
            );
          } else {
            toast.error(message);
          }
        }
      } else {
        // Network errors or request cancelled
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    }

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear user data from cookies
      if (typeof window !== "undefined") {
        const token = getCookie(TOKEN_COOKIE_NAME);
        if (token) {
          removeCookie(TOKEN_COOKIE_NAME);

          // Redirect to login page if not already there
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
