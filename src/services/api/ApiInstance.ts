// src/services/api/apiInstance.ts
import { BASE_URL } from '@/environment';
import axios from 'axios';

// const LOCAL_API_BASE_URL = 'http://192.168.18.32:3000/';

const LOCAL_API_BASE_URL = BASE_URL; 

export const apiInstance = axios.create({
  baseURL: LOCAL_API_BASE_URL,
  timeout: 30000,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  console.log("my auth token", authToken)
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common['Authorization'];
  }
};

apiInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (__DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    const status = error.response?.status;

    switch (status) {
      case 401:
        console.log('🔓 Unauthorized - token may be expired');
        break;
      case 403:
        console.log('🚫 Forbidden - insufficient permissions');
        break;
      case 404:
        console.log('🔍 Not Found - endpoint or resource not found');
        break;
      case 422:
        console.log('⚠️ Validation Error - check input data');
        break;
      case 429:
        console.log('⏰ Rate Limited - too many requests');
        break;
      default:
        if (status >= 500) {
          console.log('🔥 Server Error - backend issue');
        }
    }

    return Promise.reject(error);
  }
);

export const initializeApiWithStore = (store: any) => {
  const state = store.getState();
  const token = state.authSuperApp?.token;
  if (token) {
    setAuthToken(token);
  }

  store.subscribe(() => {
    const currentState = store.getState();
    const currentToken = currentState.authSuperApp?.token;
    if (currentToken !== authToken) {
      setAuthToken(currentToken);
    }
  });
};

export { LOCAL_API_BASE_URL };
