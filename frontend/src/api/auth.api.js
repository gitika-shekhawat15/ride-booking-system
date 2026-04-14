import api from "./axios";

export const registerAPI = (data) => {
  return api.post("/users/register", data);
};

export const loginAPI = (data) => {
  return api.post("/users/login" , data);
};

export const becomeDriverAPI = (data, token) => {
  return api.post("/drivers/register" , data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getProfileAPI = () => {
  const token = localStorage.getItem("token");
  return api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateProfileAPI = (data) => {
  const token = localStorage.getItem("token");
  return api.put("/users/me", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};