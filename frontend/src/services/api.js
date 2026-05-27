import axios from "axios";

const api = axios.create({
    baseURL: "https://stunning-barnacle-jj75qw6qjq54cp64j-3000.app.github.dev/"
});

api.interceptors.request.use(async config => {
    const token = localStorage.getItem("token");

    if (token){
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;