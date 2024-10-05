import axios from "axios";

const userAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userAPI.interceptors.request.use(
  (config) => {
    const key = localStorage.getItem("key");
    if (key) {
      config.headers["Authorization"] = `Bearer ${key}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default userAPI;
