// services/api/userApi.ts
import { ApiMethods } from './api/apiMethods';

interface UpdateProfileResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    phone_is_verified: boolean;
    email_is_verified: boolean;
    profile: string;
    fcm_token: string | null;
    google_id: string | null;
    current_location: any;
    createdAt: string;
    updatedAt: string;
  };
}

const makeImageObj = (image: any) => {
  console.log('Formatting image object:', image);

  let obj: any = {};
  if (image) {
    // CRITICAL FIX: Use 'path' first (cropped image), fallback to sourceURL
    obj.uri = image?.path ? image.path : image?.sourceURL;
    obj.name = image?.filename
      ? image.filename
      : image?.path
        ? image.path.split('/')[image.path.split('/').length - 1]
        : image?.sourceURL?.split('/')[image.sourceURL.split('/').length - 1];
    obj.type = image?.mime;
  }

  console.log('Formatted image object:', obj);
  return obj;
};

export const UserApi = {
  updateProfilePhoto: async (image: any, token: string): Promise<UpdateProfileResponse> => {
    const formData = new FormData();

    const imageObj = makeImageObj(image);

    console.log('Uploading image with object:', imageObj);

    formData.append('profile', imageObj as any);

    const response = await ApiMethods.patch<UpdateProfileResponse>('/api/v1/users/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  },
  // Add these methods to your existing UserApi object:

  updateName: async (name: string, token: string): Promise<UpdateProfileResponse> => {
    console.log('Updating name to:', name);

    const response = await ApiMethods.patch<UpdateProfileResponse>(
      '/api/v1/users/',
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  },

  updatePhone: async (phone: string, token: string): Promise<UpdateProfileResponse> => {
    console.log('Updating phone to:', phone);

    const response = await ApiMethods.patch<UpdateProfileResponse>(
      '/api/v1/users/',
      { phone },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  },
};
