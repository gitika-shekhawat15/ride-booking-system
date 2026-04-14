export const validateDriver = (data) => {
  const errors = {};

  // Vehicle Type
  if (!data.vehicleType) {
    errors.vehicleType = "Please select a vehicle type";
  } else if (!["bike", "car", "auto"].includes(data.vehicleType)) {
    errors.vehicleType = "Invalid vehicle type";
  }

  // Vehicle Number
  const rawVehicleNumber = data.vehicleNumber?.trim().toUpperCase() ?? "";
  if (!rawVehicleNumber) {
    errors.vehicleNumber = "Vehicle number is required";
  } else if (!/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(rawVehicleNumber)) {
    errors.vehicleNumber = "Invalid format (e.g. RJ14AB1234)";
  }

  // Vehicle Model
  if (data.vehicleModel && data.vehicleModel.length < 2) {
    errors.vehicleModel = "Enter a valid vehicle model";
  }

  // License Number
  if (!data.licenseNumber?.trim()) {
    errors.licenseNumber = "License number is required";
  } else if (data.licenseNumber.trim().length < 6) { 
    errors.licenseNumber = "Invalid license number";
  }

  // Experience
if (data.experience != null && data.experience !== "") {
    const exp = Number(data.experience);
    if (isNaN(exp)) {
      errors.experience = "Experience must be a number";
    } else if (exp < 0) {
      errors.experience = "Experience cannot be negative";
    } else if (exp > 50) {
      errors.experience = "Invalid experience value";
    }
  }

  return errors;
};