
export const validateRide = ({ pickup, drop, pickupCoordinates, dropCoordinates }) => {
  const errors = {};

  if (!pickup?.trim()) {
    errors.pickup = "Pickup location is required";
  }

  if (!drop?.trim()) {
    errors.drop = "Destination is required";
  }

  if (!pickupCoordinates) {
    errors.pickup = "Select a valid pickup location";
  }

  if (!dropCoordinates) {
    errors.drop = "Select a valid destination";
  }

  if (
    pickup &&
    drop &&
    pickup.trim().toLowerCase() === drop.trim().toLowerCase()
  ) {
    errors.drop = "Pickup and destination cannot be same";
  }

  return errors;
};