import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api/v1`,
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config || {};

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/ayamgoreng/login";
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/v1/auth/refresh`,
          {
            refresh_token: refreshToken
          }
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        import("./idleTimer").then(({ initIdleTimer }) => {
          initIdleTimer();
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);

      } catch {

        localStorage.clear();
        window.location.href = "/ayamgoreng/login";

      }

    }

    return Promise.reject(error);

  }

);

export default api;