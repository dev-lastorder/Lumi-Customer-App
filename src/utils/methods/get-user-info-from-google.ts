export const getUserInfoFromGoogle = async (token: string) => {
  if (!token) return;

  let response = null;

  try {
    response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    
  }
};
