
import api from './apiInstance';

const handleError = (error: any) => {
    if (error.response) {
        console.error('API Response Error:', error.response.data);
        throw error.response.data;
    } else if (error.request) {
        console.error('API No Response:', error.request);
        throw { message: 'No response from server' };
    } else {
        console.error('API Error:', error.message);
        throw { message: error.message };
    }
};

export const getRequest = async (url: string, params = {}, config = {}) => {
    try {
        const response = await api.get(url, { params, ...config });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const postRequest = async (url: string, data = {}, config = {}) => {
    try {
        const response = await api.post(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const putRequest = async (url: string, data = {}, config = {}) => {
    try {
        console.log("i am here")
        const response = await api.put(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteRequest = async (url: string, config = {}) => {
    try {
        const response = await api.delete(url, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
