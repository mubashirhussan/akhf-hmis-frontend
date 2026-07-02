import { api } from '@/store/api';
import {
  getServiceAdminRows,
  createServiceAdminRow,
  updateServiceAdminRow,
  deleteServiceAdminRow,
  getHospitalServicesRows,
  setHospitalServicePrice,
  bulkUpdateHospitalServicePrices,
  getPackageRows,
  createPackageRow,
  updatePackageRow,
  deletePackageRow,
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

    // ── Hospital Services ──────────────────────────────────────────────────
    getHospitalServices: builder.query({
      queryFn: async ({ hospitalId, categoryFilter = '', nameFilter = '' }) => ({
        data: getHospitalServicesRows(hospitalId, categoryFilter, nameFilter),
      }),
      providesTags: ['HospitalService'],
    }),
    updateHospitalServicePrice: builder.mutation({
      queryFn: async ({ hospitalId, serviceId, price }) => {
        setHospitalServicePrice(hospitalId, serviceId, price);
        return { data: { hospitalId, serviceId, price } };
      },
      invalidatesTags: ['HospitalService'],
    }),
    bulkUpdateHospitalServicePrices: builder.mutation({
      queryFn: async ({ hospitalId, serviceIds, type, percentage }) => {
        bulkUpdateHospitalServicePrices(hospitalId, serviceIds, type, percentage);
        return { data: { hospitalId, serviceIds, type, percentage } };
      },
      invalidatesTags: ['HospitalService'],
    }),
    getPackages: builder.query({
  queryFn: async () => ({ data: getPackageRows() }),
  providesTags: ['Package'],
}),
createPackage: builder.mutation({
  queryFn: async (payload) => ({ data: createPackageRow(payload) }),
  invalidatesTags: ['Package'],
}),
updatePackage: builder.mutation({
  queryFn: async ({ id, ...payload }) => ({ data: updatePackageRow(id, payload) }),
  invalidatesTags: ['Package'],
}),
deletePackage: builder.mutation({
  queryFn: async (id) => {
    deletePackageRow(id);
    return { data: { id } };
  },
  invalidatesTags: ['Package'],
}),
  }),
});

export const {
  useGetServiceAdminsQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
  useGetHospitalServicesQuery,
  useUpdateHospitalServicePriceMutation,
  useBulkUpdateHospitalServicePricesMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = serviceAdminApi;