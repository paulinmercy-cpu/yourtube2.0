import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://yourtube2-0-4-j9xs.onrender.com", // fallback
  withCredentials: true, // ✅ IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const profile = JSON.parse(
        localStorage.getItem("Profile") || "{}"
      );

      if (profile?.token) {
        config.headers.Authorization = `Bearer ${profile.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;