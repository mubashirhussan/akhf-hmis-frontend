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
  getReportHeaderRows,
  createReportHeaderRow,
  updateReportHeaderRow,
  deleteReportHeaderRow,
  getCompanyRows,
  createCompanyRow,
  updateCompanyRow,
  deleteCompanyRow,
  getHospitalServicesRows,
  setHospitalServicePrice,
  bulkUpdateHospitalServicePrices,
  getPackageRows,
  createPackageRow,
  updatePackageRow,
  deletePackageRow,
  getCompanyServicesRows,
  setCompanyServicePrice,
  bulkUpdateCompanyServicePrices,
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
    getReportHeaders: builder.query({
      queryFn: async () => ({ data: getReportHeaderRows() }),
      providesTags: ['ReportHeader'],
    }),
    createReportHeader: builder.mutation({
      queryFn: async (payload) => ({ data: createReportHeaderRow(payload) }),
      invalidatesTags: ['ReportHeader'],
    }),
    updateReportHeader: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateReportHeaderRow(id, payload) }),
      invalidatesTags: ['ReportHeader'],
    }),
    deleteReportHeader: builder.mutation({
      queryFn: async (id) => {
        deleteReportHeaderRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['ReportHeader'],
    }),
    getCompanies: builder.query({
      queryFn: async () => ({ data: getCompanyRows() }),
      providesTags: ['Company'],
    }),
    createCompany: builder.mutation({
      queryFn: async (payload) => ({ data: createCompanyRow(payload) }),
      invalidatesTags: ['Company'],
    }),
    updateCompany: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateCompanyRow(id, payload) }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation({
      queryFn: async (id) => {
        deleteCompanyRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['Company'],
    }),
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
      queryFn: async ({ hospitalId, serviceIds, type, percentage, fixedAmount }) => {
        bulkUpdateHospitalServicePrices(hospitalId, serviceIds, type, percentage, fixedAmount);
        return { data: { hospitalId, serviceIds, type, percentage, fixedAmount } };
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
getCompanyServices: builder.query({
  queryFn: async ({ companyId, categoryFilter = '', nameFilter = '' }) => ({
    data: getCompanyServicesRows(companyId, categoryFilter, nameFilter),
  }),
  providesTags: ['CompanyService'],
}),
updateCompanyServicePrice: builder.mutation({
  queryFn: async ({ companyId, serviceId, price }) => {
    setCompanyServicePrice(companyId, serviceId, price);
    return { data: { companyId, serviceId, price } };
  },
  invalidatesTags: ['CompanyService'],
}),
bulkUpdateCompanyServicePrices: builder.mutation({
  queryFn: async ({ companyId, serviceIds, type, percentage, fixedAmount }) => {
    bulkUpdateCompanyServicePrices(companyId, serviceIds, type, percentage, fixedAmount);
    return { data: { companyId, serviceIds, type, percentage, fixedAmount } };
  },
  invalidatesTags: ['CompanyService'],
}),
bulkUpdateHospitalServicePrices: builder.mutation({
  queryFn: async ({ hospitalId, serviceIds, type, percentage, fixedAmount }) => {
    bulkUpdateHospitalServicePrices(hospitalId, serviceIds, type, percentage, fixedAmount);
    return { data: { hospitalId, serviceIds, type, percentage, fixedAmount } };
  },
  invalidatesTags: ['HospitalService'],
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
  useGetReportHeadersQuery,
  useCreateReportHeaderMutation,
  useUpdateReportHeaderMutation,
  useDeleteReportHeaderMutation,
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useGetHospitalServicesQuery,
  useUpdateHospitalServicePriceMutation,
  useBulkUpdateHospitalServicePricesMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetCompanyServicesQuery,
  useUpdateCompanyServicePriceMutation,
  useBulkUpdateCompanyServicePricesMutation,
} = serviceAdminApi;