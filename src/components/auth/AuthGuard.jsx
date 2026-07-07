'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
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

  if (!isHydrated) {
    return <LoadingSpinner description="Alkhidmat Foundation" />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner description="Redirecting to login..." />;
  }

  return children;
}
