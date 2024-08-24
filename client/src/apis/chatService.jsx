import API from './axios';
import { toast } from 'react-toastify';

export const accessCreate = async (body) => (await API.post('/chat', body));
export const fetchAllChats = async () => (await API.get('/chat'));
export const createGroup = async (body) => {
  const data = await API.post('/chat/group', body);
  toast.success(`${data.chatName} Group Created`);
  return data;
};
export const addToGroup = async (body) => (await API.patch('/chat/groupAdd', body));
export const renameGroup = async (body) => (await API.patch('/chat/group/rename', body));
export const removeUser = async (body) => (await API.patch('/chat/groupRemove', body));