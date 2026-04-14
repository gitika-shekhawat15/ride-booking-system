import { createRideAPI, getNearbyRidesAPI, acceptRideAPI, updateRideStatusAPI, getRideStatusAPI} from "../api/ride.api";

export const createRideService = async (userId, pickupLocation, dropLocation, vehicleType) => {
    const res = await createRideAPI(userId,pickupLocation, dropLocation, vehicleType);
    return res.data;
};

export const getNearbyRidesService = async (lat, lng) => {
    const res = await getNearbyRidesAPI(lng,lat);
    return res.data;
};

export const acceptRideService = async () => {
    const res = await acceptRideAPI();
    return res.data;
};

export const updateRideStatusService = async (rideId, status) => {
    const res = await updateRideStatusAPI(rideId, status);
    return res.data;
};
export const getRideStatusService = async (rideId) => {
    const res = await getRideStatusAPI(rideId);
    return res.data;
};