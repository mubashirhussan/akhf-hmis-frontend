import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/store/api';
import authReducer, { getInitialAuthState } from '@/store/authSlice';
import '@/features/auth/api/authApi';
import '@/features/admin-pathology/api/pathologyApi';
import '@/features/laboratory/api/laboratoryEndpoints';
import '@/features/opd/api/opdEndpoints';
import '@/features/billing/api/billingEndpoints';
import '@/features/service-admin/api/serviceAdminApi';
import '@/features/human-resource/api/employeeApi';
import '@/features/duty-roaster/api/dutyRoasterApi';
import '@/features/user-role/api/userRoleApi';

const preloadedState =
  typeof window !== 'undefined' ? { auth: getInitialAuthState() } : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  preloadedState,
});
