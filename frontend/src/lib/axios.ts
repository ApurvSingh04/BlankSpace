import axios from "axios";
import { BACKEND_URL } from "../config";

export const api = axios.create({
    baseURL: BACKEND_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            if (token.startsWith("Bearer ")) {
                config.headers.Authorization = token;
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token");
            localStorage.removeItem("user-storage");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);
