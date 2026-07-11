import { api } from '@/store/api';
import {
  MOCK_WALK_IN_PATIENTS,
  searchWalkInPatients,
} from '@/features/opd/api/mock-walk-in-patients';

export const opdEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation({
      query: (body) => ({
        url: '/registration/patient-registration-with-visit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Patient'],
    }),
    registerPatientWithVisit: builder.mutation({
      query: (body) => ({
        url: '/registration/patient-registration-with-visit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Patient'],
    }),
    getPatientById: builder.query({
      query: (RegNo) => ({
        url: '/registration/patients/get-by-id',
        params: { RegNo },
      }),
      providesTags: ['Patient'],
    }),
    searchWalkInPatients: builder.query({
      queryFn: async (filters) => ({
        data: searchWalkInPatients(MOCK_WALK_IN_PATIENTS, filters),
      }),
      providesTags: ['WalkInPatient'],
    }),
    getGenders: builder.query({
      query: () => '/admin/pathology/lookups/genders',
      transformResponse: (res) =>
        (res.data ?? []).map((g) => ({ value: g.Gender_ID, label: g.Gender })),
      providesTags: ['Lookup'],
    }),
    getReligions: builder.query({
      query: () => '/registration/religions',
      transformResponse: (res) =>
        (res.data ?? []).map((r) => ({ value: r.religion_ID, label: r.religion_name })),
      providesTags: ['Lookup'],
    }),
    getConsultants: builder.query({
      query: () => '/registration/consultants',
      transformResponse: (res) =>
        (res.data ?? []).map((c) => ({ value: c.empID, label: c.employeeName })),
      providesTags: ['Lookup'],
    }),
    getOpdDesignations: builder.query({
      query: () => '/registration/designations',
      transformResponse: (res) =>
        (res.data ?? []).map((d) => ({ value: d.party_Desg_ID, label: d.party_Desg_Name })),
      providesTags: ['Lookup'],
    }),
    searchOpdServices: builder.query({
      query: () => '/opd/services/search',
      transformResponse: (res) => res.data ?? [],
      providesTags: ['OpdService'],
    }),
  }),
});

export const {
  useCreatePatientMutation,
  useRegisterPatientWithVisitMutation,
  useLazySearchWalkInPatientsQuery,
  useGetGendersQuery,
  useGetReligionsQuery,
  useGetConsultantsQuery,
  useGetOpdDesignationsQuery,
  useSearchOpdServicesQuery,
  useLazyGetPatientByIdQuery,
} = opdEndpoints;