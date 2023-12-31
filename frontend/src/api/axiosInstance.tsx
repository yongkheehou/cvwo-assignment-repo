import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';

// Create an Axios instance with default options
const AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default AxiosInstance;
