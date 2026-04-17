export const getDecodedToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = JSON.parse(atob(token.split(".")[1]));

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded; // { _id, role, exp, iat }
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};