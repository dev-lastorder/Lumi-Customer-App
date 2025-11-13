import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '@/config/contants';
type AppType = 'customer' | 'driver';
class ApiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
  /**
   * Get Twilio access token for voice calls
   * @param identity - User's unique identity (e.g., "driver_456")
   * @returns Access token string
   */
  async getTwilioToken(identity: string, appType: AppType): Promise<string> {
    try {
      console.log(':key: Requesting token for identity:', identity);
      const response = await this.api.get<{ token: string }>(
        API_CONFIG.ENDPOINTS.GET_TOKEN,
        {
          params: { identity, appType }
        }
      );
      console.log(':white_check_mark: Token received');
      return response.data.token;
    } catch (error) {
      console.error(':x: Error getting Twilio token:', error);
      throw new Error('Failed to get Twilio token: ' + (error as Error).message);
    }
  }
}
export default new ApiService();