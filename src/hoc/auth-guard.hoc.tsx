import { useAppSelector } from '@/redux';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

function withAuthGuard<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const token = useAppSelector((state) => state.auth.token);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();
    
    

    useEffect(() => {
      
      
      if (!token || !isAuthenticated) {
        // replace so user can't hit “back” into a guarded page
        router.replace('/(food-delivery)/(profile)/login');
      }
    }, [token, router, isAuthenticated]);

    // while we’re redirecting, don’t flash the protected UI
    if (!token || !isAuthenticated) {
      router.replace('/(food-delivery)/(profile)/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}

export default withAuthGuard;
