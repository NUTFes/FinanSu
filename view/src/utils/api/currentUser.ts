import { get_with_token } from './api_methods';

export const getCurrentUser = async (auth: { isSignIn: boolean; accessToken: string }) => {
  try {
    const getCurrentUserUrl = process.env.CSR_API_URI + '/current_user';
    const response = await get_with_token(getCurrentUserUrl, auth.accessToken);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
