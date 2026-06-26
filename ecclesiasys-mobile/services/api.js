import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = "3000";

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  const host = hostUri?.split(":")[0];

  if (!host) return null;

  if (host === "localhost" || host === "127.0.0.1") {
    return Platform.OS === "android" ? "10.0.2.2" : host;
  }

  return host;
};

const resolveApiBaseURL = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  const expoHost = getExpoHost();

  if (!configuredUrl || configuredUrl === "auto") {
    return `http://${expoHost || "10.0.2.2"}:${API_PORT}`;
  }

  if (
    Platform.OS === "android" &&
    (configuredUrl.includes("localhost") || configuredUrl.includes("127.0.0.1"))
  ) {
    return `http://${expoHost || "10.0.2.2"}:${API_PORT}`;
  }

  return configuredUrl.replace(/\/$/, "");
};

export const API_BASE_URL = resolveApiBaseURL();

if (__DEV__) {
  console.log("API URL:", API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
