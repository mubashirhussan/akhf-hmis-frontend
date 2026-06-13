import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/store/api';
import '@/features/admin-pathology/api/pathologyApi';
import '@/features/laboratory/api/laboratoryEndpoints';
import '@/features/opd/api/opdEndpoints';
import '@/features/billing/api/billingEndpoints';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
