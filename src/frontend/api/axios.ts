import axios, { AxiosError } from 'axios';
axios.defaults.baseURL = window.location.origin;
export const preferredAxios = axios;
