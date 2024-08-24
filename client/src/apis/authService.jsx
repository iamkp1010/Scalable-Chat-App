import API from './axios';
import { toast } from 'react-toastify';

export const loginUser = async (body) => await API.post(`/auth/login`, body);
export const googleAuth = async (body) => await API.post(`/auth/google`, body);
export const registerUser = async (body) =>
  await API.post(`/auth/register`, body);
export const validUser = async () => await API.post(`/auth/valid`);
export const searchUsers = async (id) => await API.get(`/user?search=${id}`);
export const logoutUser = async (userId) =>
  await API.post(`/auth/logout`, { userId });
export const updateUser = async (id, body) => {
  try {
    const  data  = await API.patch(`/users/update/${id}`, body);
    return data;
  } catch (error) {
    console.log('error in update user api');
    toast.error('Something Went Wrong.try Again!');
  }
};
