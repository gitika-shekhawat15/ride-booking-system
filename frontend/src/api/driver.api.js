import api from "./axios";

// Driver APIs
export const goOnlineAPI = (token, coordinates) => {
    return api.post("/drivers/online", { coordinates }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
export const getDriverProfileAPI = () => {
  const token = localStorage.getItem("token");
  return api.get("/drivers/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateDriverProfileAPI = (data) => {
  const token = localStorage.getItem("token");
  return api.put("/drivers/me", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const goOfflineAPI = (token) => {
    return api.post("/drivers/offline", {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateLocationAPI = (lat, lng, token) => {
    return api.patch("/drivers/location", { lat, lng }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};