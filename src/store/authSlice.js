import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'akhf_token';
const LEGACY_TOKEN_KEY = 'akhf_access_token';
const USER_KEY = 'akhf_user';

function readStoredToken() {
  if (typeof window === 'undefined') return null;
  return (
    sessionStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(LEGACY_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

function readStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getInitialAuthState() {
  return {
    token: readStoredToken(),
    user: readStoredUser(),
    isHydrated: true,
  };
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
    hydrateAuth(state) {
      state.token = readStoredToken();
      state.user = readStoredUser();
      state.isHydrated = true;
    },
    setCredentials(state, action) {
      const { token, user, remember } = action.payload;
      state.token = token;
      state.user = user ?? null;
      clearStoredAuth();
      if (typeof window !== 'undefined') {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, token);
        if (user) {
          storage.setItem(USER_KEY, JSON.stringify(user));
        }
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      clearStoredAuth();
    },
  },
});

export const { hydrateAuth, setCredentials, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectIsAuthHydrated = (state) => state.auth.isHydrated;

export default authSlice.reducer;
