// hooks/useUserRole.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setRole(idTokenResult.claims.role as string || null);
      }
    }
    fetchRole();
  }, [user]);
  
  return role;
}
