export const calculateFare = (pickupCoords, dropCoords, vehicleType) => {
  const [lng1, lat1] = pickupCoords;
  const [lng2, lat2] = dropCoords;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const ratePerKm = { bike: 8, auto: 12, car: 18 };
  const baseFare = { bike: 20, auto: 30, car: 50 };

  const rate = ratePerKm[vehicleType] || 10;
  const base = baseFare[vehicleType] || 20;

  return Math.round(Math.max(base, base + distKm * rate));
};