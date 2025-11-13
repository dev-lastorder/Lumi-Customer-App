import { RootState } from '@/redux';
import { LoginScreen } from '@/screens';
import ProfileMainScreen from '@/screens/profile/screens/profile-main';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const router = useRouter();

  // grab auth flag from Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // watch for login → redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      // replace so user can’t go “back” to login
      router.replace('/(food-delivery)/(profile)/profile');
    }
  }, [isAuthenticated, router]);

  

  // while redirecting, avoid flicker
  if (isAuthenticated) {
    return <ProfileMainScreen />;
  }

  return <LoginScreen />;
};

export default LoginPage;
