'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { selectIsAuthHydrated, selectIsAuthenticated } from '@/store/authSlice';
import { ROUTES } from '@/config/routes';

export default function HomeRedirect() {
  const router = useRouter();
  const isHydrated = useSelector(selectIsAuthHydrated);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(isAuthenticated ? ROUTES.dashboard : ROUTES.login);
  }, [isHydrated, isAuthenticated, router]);

  return <LoadingSpinner />;
}
