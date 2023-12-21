import axios from 'axios';
import { BACKEND_URL } from '../utils';

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default axiosInstance;
