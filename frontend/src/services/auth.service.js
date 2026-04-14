import { registerAPI, loginAPI, becomeDriverAPI, getProfileAPI, updateProfileAPI} from "../api/auth.api";

export const registerUser = async (data) => {

  const res = await registerAPI(data);

  return res.data;

};

export const loginUser = async (data) => {

  const res = await loginAPI(data);
  
  return res.data;

};

export const becomeDriver =  async (data, token) => {

  const res = await becomeDriverAPI(data, token);
  
  return res.data;

};
export const getProfile = async () => {
  const res = await getProfileAPI();
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await updateProfileAPI(data);
  return res.data;
};

