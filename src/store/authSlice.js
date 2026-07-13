import { createSlice } from '@reduxjs/toolkit';

const LEGACY_TOKEN_KEYS = ['akhf_token', 'akhf_access_token'];
const LEGACY_USER_KEY = 'akhf_user';

/** One-time migration from pre-cookie localStorage / sessionStorage. */
export function readLegacyStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null, remember: false };
  }

  const remember = LEGACY_TOKEN_KEYS.some((key) => localStorage.getItem(key));

  const token =
    sessionStorage.getItem('akhf_token') ||
    localStorage.getItem('akhf_token') ||
    sessionStorage.getItem('akhf_access_token') ||
    localStorage.getItem('akhf_access_token');

  let user = null;
  const raw =
    sessionStorage.getItem(LEGACY_USER_KEY) ||
    localStorage.getItem(LEGACY_USER_KEY);
  if (raw) {
    try {
      user = JSON.parse(raw);
    } catch {
      user = null;
    }
  }

  return { token, user, remember };
}

export function clearLegacyStoredAuth() {
  if (typeof window === 'undefined') return;
  for (const key of LEGACY_TOKEN_KEYS) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
  sessionStorage.removeItem(LEGACY_USER_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
}

const initialState = {
  token: null,
  user: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state, action) {
      const { token = null, user = null } = action.payload ?? {};
      state.token = token;
      state.user = user;
      state.isHydrated = true;
    },
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user ?? null;
      state.isHydrated = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { hydrateAuth, setCredentials, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectIsAuthHydrated = (state) => state.auth.isHydrated;

export default authSlice.reducer;
