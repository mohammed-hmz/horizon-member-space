// components/ProtectedRoute.tsx
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router, user]);
  
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
