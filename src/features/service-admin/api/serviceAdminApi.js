import { api } from '@/store/api';
import {
  getServiceAdminRows,
  createServiceAdminRow,
  updateServiceAdminRow,
  deleteServiceAdminRow,
} from '@/features/service-admin/api/mock-service-admin';

export const serviceAdminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServiceAdmins: builder.query({
      queryFn: async () => ({ data: getServiceAdminRows() }),
      providesTags: ['ServiceAdmin'],
    }),
    createServiceAdmin: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createServiceAdminRow(rowPayload),
      }),
      invalidatesTags: ['ServiceAdmin'],
    }),
    updateServiceAdmin: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateServiceAdminRow(id, rowPayload),
      }),
      invalidatesTags: ['ServiceAdmin'],
    }),
    deleteServiceAdmin: builder.mutation({
      queryFn: async (id) => {
        deleteServiceAdminRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['ServiceAdmin'],
    }),
  }),
});

export const {
  useGetServiceAdminsQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} = serviceAdminApi;
