import axios from 'axios';

let url = process.env.REACT_APP_SERVER_URL;
const API = axios.create({ baseURL: `${url}/api`, withCredentials: true });

API.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        const axiosInstance = await axios.create({
          baseURL: `${url}/api/auth`,
          withCredentials: true,
        });
        await axiosInstance.post('/tokenRefresh');
        return API.request(err.config);
      } catch (e) {
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        )
          window.location.href = '/login';
        return {
          status: e?.response?.status,
          error: err?.response?.data?.error || err.message,
        };
      }
    } else return { error: err?.response?.data?.error || err.message };
  }
);
export default API;
