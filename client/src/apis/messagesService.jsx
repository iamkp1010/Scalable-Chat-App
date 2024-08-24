import API from './axios';

export const sendMessage = async (body) =>
  (await API.post('/message/', body));
export const fetchMessages = async (id) =>
  (await API.get(`/message/${id}`));
