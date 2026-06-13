import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/config/env';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiBaseUrl }),
  tagTypes: [
    'PathologyComponent',
    'PathologyTestRange',
    'PathologyLookups',
    'LaboratoryWorklist',
    'WalkInPatient',
    'WalkInService',
    'BillingVisit',
    'BillingVisitServices',
  ],
  endpoints: () => ({}),
});
