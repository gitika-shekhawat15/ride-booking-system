import api from "./axios";

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Rider - ride create 
export const createRideAPI = (userId, pickupLocation, dropLocation, vehicleType) => {
    return api.post("/rides", { pickupLocation, dropLocation, vehicleType }, getAuthHeader());
};

// Driver - nearby rides 
export const getNearbyRidesAPI = (lat, lng) => {
    return api.get(`/rides/nearby?lat=${lat}&lng=${lng}`, getAuthHeader());
};

// Driver - ride accept 
export const acceptRideAPI = () => {
    return api.post("/rides/accept", {}, getAuthHeader());
};

//status update 
export const updateRideStatusAPI = (rideId, status) => {
    return api.patch(`rides/${rideId}/status`, 
        { status }
     , getAuthHeader());
};

// get status
export const getRideStatusAPI = (rideId, status)=> {
    return api.get(`rides/${rideId}/status`, {status})

}
