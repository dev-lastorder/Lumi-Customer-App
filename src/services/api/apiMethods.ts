// src/services/api/apiMethods.ts
import { AxiosResponse } from 'axios';
import { apiInstance } from './ApiInstance';

export class ApiMethods {
  static async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiInstance.get(url, { params });
      return response.data;
    } catch (error) {
      throw ApiMethods.handleError(error);
    }
  }

  static async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw ApiMethods.handleError(error);
    }
  }

  static async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw ApiMethods.handleError(error);
    }
  }

  static async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw ApiMethods.handleError(error);
    }
  }

  static async delete<T>(url: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiInstance.delete(url, { params });
      return response.data;
    } catch (error) {
      throw ApiMethods.handleError(error);
    }
  }

  private static handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      let message = data?.message || 'An error occurred';
      
      if (status === 422 && data?.errors) {
        const validationErrors = Object.values(data.errors).flat();
        message = validationErrors.join(', ');
      }
      
      const customError = new Error(message) as any;
      customError.status = status;
      customError.data = data;
      return customError;
    }
    
    if (error.request) {
      return new Error('Network error - please check your connection');
    }
    
    return new Error(error.message || 'Unknown error occurred');
  }
}