import { goOnlineAPI, getDriverProfileAPI,goOfflineAPI,updateDriverProfileAPI, updateLocationAPI } from "../api/driver.api";



export const getDriverProfile = async () => {
  const res = await getDriverProfileAPI();
  return res.data;
};

export const updateDriverProfile = async (data) => {
  const res = await updateDriverProfileAPI(data);
  return res.data;
};

export const goOnlineService = async (token, coordinates) => {
    const res = await goOnlineAPI(token, coordinates);
    return res.data;
};

export const goOfflineService = async (token) => {
    const res = await goOfflineAPI(token);
    return res.data;
};

export const updateLocationService = async (lat, lng, token) => {
    const res = await updateLocationAPI(lat, lng, token);
    return res.data;
};