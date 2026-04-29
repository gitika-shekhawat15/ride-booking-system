import api from "./axios";

export const registerAPI = (data) => {
  return api.post("/users/register", data);
};

export const loginAPI = (data) => {
  return api.post("/users/login", data);
};

export const becomeDriverAPI = (data) => {
  return api.post("/drivers/register", data); 
};

export const getProfileAPI = () => {
  return api.get("/users/me");
};

export const updateProfileAPI = (data) => {
  return api.put("/users/me", data);
};