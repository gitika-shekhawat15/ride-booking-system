import api from "./axios";


export const createRideAPI = (userId, pickupLocation, dropLocation, vehicleType) => {
    return api.post("/rides", { pickupLocation, dropLocation, vehicleType }); // ← clean
};

export const getNearbyRidesAPI = (lat, lng) => {
    return api.get(`/rides/nearby?lat=${lat}&lng=${lng}`);
};

export const acceptRideAPI = (rideId) => {
    return api.post("/rides/accept", { rideId });
};

export const updateRideStatusAPI = (rideId, status) => {
    return api.patch(`/rides/${rideId}/status`, { status });
};

export const getRideStatusAPI = (rideId) => {
    return api.get(`/rides/${rideId}/status`);
};
