import { api } from '@/store/api';
import {
  getBillingVisitServiceRows,
  setBillingVisitServiceRows,
} from '@/features/billing/api/mock-billing-visit-services';
import {
  MOCK_SERVICES_BILLING_VISITS,
  searchServicesBillingVisits,
} from '@/features/billing/api/mock-services-billing';

export const billingEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    searchBillingVisits: builder.query({
      queryFn: async (filters) => ({
        data: searchServicesBillingVisits(MOCK_SERVICES_BILLING_VISITS, filters),
      }),
      providesTags: ['BillingVisit'],
    }),
    getBillingVisit: builder.query({
      queryFn: async (visitId) => ({
        data: MOCK_SERVICES_BILLING_VISITS.find((visit) => visit.id === visitId) ?? null,
      }),
      providesTags: (_result, _error, visitId) => [{ type: 'BillingVisit', id: visitId }],
    }),
    getBillingVisitServices: builder.query({
      queryFn: async (visitId) => ({ data: getBillingVisitServiceRows(visitId) }),
      providesTags: (_result, _error, visitId) => [{ type: 'BillingVisitServices', id: visitId }],
    }),
    updateBillingVisitServices: builder.mutation({
      queryFn: async ({ visitId, rows }) => ({
        data: setBillingVisitServiceRows(visitId, rows),
      }),
      invalidatesTags: (_result, _error, { visitId }) => [
        { type: 'BillingVisitServices', id: visitId },
      ],
    }),
  }),
});

export const {
  useLazySearchBillingVisitsQuery,
  useGetBillingVisitQuery,
  useGetBillingVisitServicesQuery,
  useUpdateBillingVisitServicesMutation,
} = billingEndpoints;
