
export const validateSignup = (data) => {
  const errors = {};

  // First Name
  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (data.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Last Name
  if (!data.lastName?.trim()) {
    errors.lastName = "Last name is required";
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  // Password
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
};

