import { api } from '@/store/api';
import {
  getAllLaboratoryWorklistRows,
  getWorklistRowById,
  searchLaboratoryWorklistRows,
  updateLaboratoryWorklistStatus,
} from '@/features/laboratory/api/mock-laboratory-worklist';

export const laboratoryEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    searchLaboratoryWorklist: builder.query({
      queryFn: async (filters) => ({
        data: searchLaboratoryWorklistRows(getAllLaboratoryWorklistRows(), filters),
      }),
      providesTags: ['LaboratoryWorklist'],
    }),
    getLaboratoryWorklistRecord: builder.query({
      queryFn: async (recordId) => ({
        data: getWorklistRowById(recordId),
      }),
      providesTags: (_result, _error, recordId) => [{ type: 'LaboratoryWorklist', id: recordId }],
    }),
    updateLaboratoryWorklistStatus: builder.mutation({
      queryFn: async ({ recordId, status }) => ({
        data: updateLaboratoryWorklistStatus(recordId, status),
      }),
      invalidatesTags: ['LaboratoryWorklist'],
    }),
  }),
});

export const {
  useSearchLaboratoryWorklistQuery,
  useLazySearchLaboratoryWorklistQuery,
  useGetLaboratoryWorklistRecordQuery,
  useUpdateLaboratoryWorklistStatusMutation,
} = laboratoryEndpoints;
