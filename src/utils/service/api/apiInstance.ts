import { BASE_URL } from '@/environment';
import axios from 'axios';

const API_BASE_URL = BASE_URL + '/api-docs'; 

let token: string | null =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY3ZGI4OGUxLTg3OGEtNDhhNS04ZDlhLTUxY2U2NmVhMGIzMSIsImlhdCI6MTc1NzU5MDA0OSwiZXhwIjoxNzYwMTgyMDQ5fQ.JCfuhOT2DRgmpQiLmWKYdfUMOf5zzKZI_bCBELDdhzY';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Utility to update token dynamically (for login/logout)
export const setAuthToken = (newToken: string | null) => {
  token = newToken;
};

export default api;
