import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// THIS IS THE DEFINITIVE FIX: A GLOBAL RESPONSE INTERCEPTOR
api.interceptors.response.use(
  // If the response is successful (2xx), just pass it through
  (response) => response,

  // If the response is an error, this function will run
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // This means the user's session is invalid on the backend.
      // We must force a logout on the frontend.
      console.error("Authentication error (401). Forcing logout.");

      // Clear the invalid user data from local storage
      localStorage.removeItem("user");

      // Force a full page reload to the login screen.
      // This is a brute-force but 100% effective way to reset the app's state.
      window.location.href = "/login";
    }

    // For all other errors, just pass them along to be handled by the component
    return Promise.reject(error);
  }
);

export default api;
