import api from "./axios";

export const goOnlineAPI = (coordinates) => {
    return api.post("/drivers/online", { coordinates });
};

export const getDriverProfileAPI = () => {
    return api.get("/drivers/me");
};

export const updateDriverProfileAPI = (data) => {
    return api.put("/drivers/me", data);
};

export const goOfflineAPI = () => {
    return api.post("/drivers/offline", {});
};

export const updateLocationAPI = (lat, lng) => {
    return api.patch("/drivers/location", { lat, lng });
};