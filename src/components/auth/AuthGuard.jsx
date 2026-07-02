'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthHydrated, selectIsAuthenticated } from '@/store/authSlice';
import { ROUTES } from '@/config/routes';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const isHydrated = useSelector(selectIsAuthHydrated);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return children;
}
