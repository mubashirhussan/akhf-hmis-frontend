'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import {
  clearLegacyStoredAuth,
  hydrateAuth,
  readLegacyStoredAuth,
} from '@/store/authSlice';
import {
  clearAuthSession,
  fetchAuthSession,
  persistAuthSession,
} from '@/features/auth/session';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';

async function bootstrapAuthSession() {
  try {
    const session = await fetchAuthSession();
    if (session?.authenticated && session.token) {
      store.dispatch(
        hydrateAuth({ token: session.token, user: session.user ?? null }),
      );
      return;
    }

    const legacy = readLegacyStoredAuth();
    if (legacy.token) {
      await persistAuthSession({
        token: legacy.token,
        user: legacy.user,
        remember: legacy.remember,
      });
      clearLegacyStoredAuth();
      store.dispatch(
        hydrateAuth({ token: legacy.token, user: legacy.user ?? null }),
      );
      return;
    }

    store.dispatch(hydrateAuth({ token: null, user: null }));
  } catch {
    try {
      await clearAuthSession();
    } catch {
      // ignore
    }
    store.dispatch(hydrateAuth({ token: null, user: null }));
  }
}

export default function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    bootstrapAuthSession().finally(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <LoadingSpinner description="Alkhidmat Foundation" />;
  }

  return <Provider store={store}>{children}</Provider>;
}
