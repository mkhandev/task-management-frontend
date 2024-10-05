import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
