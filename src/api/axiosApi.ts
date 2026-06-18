import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { triggerLogout } from "./authBridge";
import { postRefreshToken } from "./requests";
export const BASE_URI = "http://192.168.2.5:8080/api";
// export const BASE_URI = "http://192.168.1.211:8080/api";
// export const BASE_URI = "https://thriveon.fit/api";

export const api = axios.create({
  baseURL: BASE_URI,
});

api.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept if the request has no response, or if it's already a retry
    if (!error.response) return Promise.reject(error);

    // If the refresh token endpoint itself returns a 401, BAIL OUT immediately.
    // Replace "/refresh-token" with whatever your exact backend refresh URL path is.
    if (originalRequest.url.includes("/refresh-token")) {
      triggerLogout();
      return Promise.reject(error);
    }

    // Check if the error is 401 and ensure we haven't already retried this request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark this request as retried to prevent infinite loops

      try {
        // Wait for the token refresh API call to complete
        await postRefreshToken();
        const newAccessToken = await SecureStore.getItemAsync("accessToken");

        // Update the Authorization header for the retried request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Resend the original request with the updated headers
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token itself is expired or invalid, log the user out
        triggerLogout();
        return Promise.reject(refreshError);
      }
    }

    // Return any other errors normally
    return Promise.reject(error);
  },
);
