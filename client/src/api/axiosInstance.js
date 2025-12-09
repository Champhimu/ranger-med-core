import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ----- GLOBAL LOCK -----
let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (error.response?.status === 403 && !originalRequest._retry) {

      originalRequest._retry = true;

      // If refresh already in progress → wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Otherwise → start refresh
      isRefreshing = true;
      refreshPromise = instance.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });

      if(error.response?.data.message === "Invalid refresh token"){
        //remove
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await refreshPromise;

        const newAccess = res.data.accessToken;
        const newRefresh = res.data.refreshToken;

        localStorage.setItem("accessToken", newAccess);
        localStorage.setItem("refreshToken", newRefresh);

        instance.defaults.headers.common["Authorization"] = "Bearer " + newAccess;

        processQueue(null, newAccess);

        originalRequest.headers["Authorization"] = "Bearer " + newAccess;

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
