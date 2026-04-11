import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api/v1`,
  timeout: 20000,
});

// ================= GLOBAL STATE =================
let isRedirecting = false;

// ================= REQUEST =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config || {};

    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // ================= SERVER DOWN / TIMEOUT HANDLER =================
    const isNetworkError = !error.response || error.code === "ERR_NETWORK";
    const isTimeout = error.code === "ECONNABORTED";

    if (isNetworkError || isTimeout) {
      
      if (!originalRequest._retryNetwork) {
        originalRequest._retryNetwork = true;
        console.warn("⚠️ Server lambat/tidak merespon, mencoba ulang dalam 3 detik...");
        
        await new Promise((res) => setTimeout(res, 3000)); 
        return api(originalRequest);
      }

      const isGetMethod = originalRequest.method?.toLowerCase() === 'get';

      if (isGetMethod) {
        console.error("🚨 SERVER DOWN / MATI TOTAL saat load data. Mengalihkan halaman...");
        if (!isRedirecting) {
          isRedirecting = true;
          window.location.href = "/server-busy";
        }
      } else {
        console.error("🚨 Gagal memproses data (Timeout/Network Error). Meneruskan error ke UI...");
      }

      return Promise.reject(error);
    }

    // ================= TOKEN EXPIRED =================
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
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // re-init idle timer
        import("./idleTimer").then(({ initIdleTimer }) => {
          initIdleTimer();
        });

        // retry request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/ayamgoreng/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;