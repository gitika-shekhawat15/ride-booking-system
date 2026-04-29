import { goOnlineAPI, getDriverProfileAPI, goOfflineAPI, updateDriverProfileAPI, updateLocationAPI } from "../api/driver.api";

export const getDriverProfile = async () => {
  const res = await getDriverProfileAPI();
  return res.data;
};

export const updateDriverProfile = async (data) => {
  const res = await updateDriverProfileAPI(data);
  return res.data;
};

export const goOnlineService = async (driverId, coordinates) => {
    const res = await goOnlineAPI(coordinates);
    return res.data;
};

export const goOfflineService = async () => {
    const res = await goOfflineAPI();
    return res.data;
};

export const updateLocationService = async (lng, lat) => {
    const res = await updateLocationAPI(lng, lat);
    return res.data;
};