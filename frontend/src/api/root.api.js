import api from "./axios";

export const rootAPI = () => api.get("/");
