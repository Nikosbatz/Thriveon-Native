import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { triggerLogout } from "./authBridge";
export const BASE_URI = "http://192.168.2.3:8080/api";

export const api = axios.create({
  baseURL: BASE_URI,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  console.log(await SecureStore.getItemAsync("token"));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If Server Responds with UNAUTHORIZED code then logout user
    // Through the authBridge
    if (error.response.status === 401) {
      triggerLogout();
    }
  }
);
