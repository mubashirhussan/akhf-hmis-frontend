import { api } from '@/store/api';
import {
  getServiceAdminRows,
  createServiceAdminRow,
  updateServiceAdminRow,
  deleteServiceAdminRow,
  getServiceCategoryRows,
  createServiceCategoryRow,
  updateServiceCategoryRow,
  deleteServiceCategoryRow,
  getDiscountAuthorityRows,
  createDiscountAuthorityRow,
  deleteDiscountAuthorityRow,
  getRefundAuthorityRows,
  createRefundAuthorityRow,
  deleteRefundAuthorityRow,
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
    getServiceCategories: builder.query({
      queryFn: async () => ({ data: getServiceCategoryRows() }),
      providesTags: ['ServiceCategory'],
    }),
    createServiceCategory: builder.mutation({
      queryFn: async (serviceName) => ({
        data: createServiceCategoryRow(serviceName),
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    updateServiceCategory: builder.mutation({
      queryFn: async ({ id, serviceName }) => ({
        data: updateServiceCategoryRow(id, serviceName),
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    deleteServiceCategory: builder.mutation({
      queryFn: async (id) => {
        deleteServiceCategoryRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['ServiceCategory'],
    }),
    getDiscountAuthorities: builder.query({
      queryFn: async () => ({ data: getDiscountAuthorityRows() }),
      providesTags: ['DiscountAuthority'],
    }),
    createDiscountAuthority: builder.mutation({
      queryFn: async (payload) => ({ data: createDiscountAuthorityRow(payload) }),
      invalidatesTags: ['DiscountAuthority'],
    }),
    deleteDiscountAuthority: builder.mutation({
      queryFn: async (id) => {
        deleteDiscountAuthorityRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['DiscountAuthority'],
    }),
    getRefundAuthorities: builder.query({
      queryFn: async () => ({ data: getRefundAuthorityRows() }),
      providesTags: ['RefundAuthority'],
    }),
    createRefundAuthority: builder.mutation({
      queryFn: async (payload) => ({ data: createRefundAuthorityRow(payload) }),
      invalidatesTags: ['RefundAuthority'],
    }),
    deleteRefundAuthority: builder.mutation({
      queryFn: async (id) => {
        deleteRefundAuthorityRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['RefundAuthority'],
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
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
  useGetDiscountAuthoritiesQuery,
  useCreateDiscountAuthorityMutation,
  useDeleteDiscountAuthorityMutation,
  useGetRefundAuthoritiesQuery,
  useCreateRefundAuthorityMutation,
  useDeleteRefundAuthorityMutation,
  useGetHospitalServicesQuery,
  useUpdateHospitalServicePriceMutation,
  useBulkUpdateHospitalServicePricesMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = serviceAdminApi;