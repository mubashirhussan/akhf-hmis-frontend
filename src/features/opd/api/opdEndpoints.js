import { api } from '@/store/api';
import {
  MOCK_WALK_IN_PATIENTS,
  searchWalkInPatients,
} from '@/features/opd/api/mock-walk-in-patients';
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  searchServices,
} from '@/features/opd/api/mock-walk-in-services';

export const opdEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation({
      query: (body) => ({
        url: '/registration/patients/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Patient'],
    }),
    searchWalkInPatients: builder.query({
      queryFn: async (filters) => ({
        data: searchWalkInPatients(MOCK_WALK_IN_PATIENTS, filters),
      }),
      providesTags: ['WalkInPatient'],
    }),
    searchWalkInServices: builder.query({
      queryFn: async ({ category, query }) => ({
        data: searchServices(MOCK_SERVICES, category, query),
      }),
      providesTags: ['WalkInService'],
    }),
    getWalkInDoctors: builder.query({
      queryFn: async () => ({ data: MOCK_DOCTORS }),
      providesTags: ['WalkInService'],
    }),
  }),
});

export const {
  useLazySearchWalkInPatientsQuery,
  useLazySearchWalkInServicesQuery,
  useGetWalkInDoctorsQuery,
  useCreatePatientMutation,
} = opdEndpoints;
