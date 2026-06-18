import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const profile = JSON.parse(
      localStorage.getItem("Profile") || "{}"
    );

    if (profile?.token) {
      config.headers.Authorization = `Bearer ${profile.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;