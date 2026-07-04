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
  getPatientTypeRows,
  createPatientTypeRow,
  updatePatientTypeRow,
  deletePatientTypeRow,
  getAssignOpdRows,
  createAssignOpdRow,
  updateAssignOpdRow,
  deleteAssignOpdRow,
} from '@/features/service-admin/api/mock-service-admin';
import {
  getHospitalRows,
  createHospitalRow,
  updateHospitalRow,
  deleteHospitalRow,
} from '@/features/human-resource/api/mock-hospitals';
import {
  getDepartmentRows,
  createDepartmentRow,
  updateDepartmentRow,
  deleteDepartmentRow,
} from '@/features/human-resource/api/mock-departments';
import {
  getSubDepartmentRows,
  createSubDepartmentRow,
  updateSubDepartmentRow,
  deleteSubDepartmentRow,
} from '@/features/human-resource/api/mock-sub-departments';
import {
  getWardBedRows,
  createWardBedRow,
  updateWardBedRow,
  deleteWardBedRow,
  getBedLocationRows,
  createBedLocationRow,
  updateBedLocationRow,
  deleteBedLocationRow,
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
    getHospitalServices: builder.query({
      queryFn: async ({ hospitalId, categoryFilter = '', nameFilter = '' }) => ({
        data: getHospitalServicesRows(hospitalId, categoryFilter, nameFilter),
      }),
      providesTags: ['HospitalService'],
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
getPatientTypes: builder.query({
      queryFn: async () => ({ data: getPatientTypeRows() }),
      providesTags: ['PatientType'],
    }),
    createPatientType: builder.mutation({
      queryFn: async (payload) => ({ data: createPatientTypeRow(payload) }),
      invalidatesTags: ['PatientType'],
    }),
    updatePatientType: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updatePatientTypeRow(id, payload) }),
      invalidatesTags: ['PatientType'],
    }),
    deletePatientType: builder.mutation({
      queryFn: async (id) => {
        deletePatientTypeRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['PatientType'],
    }),
    getAssignOpdServices: builder.query({
      queryFn: async () => ({ data: getAssignOpdRows() }),
      providesTags: ['AssignOpdService'],
    }),
    createAssignOpdService: builder.mutation({
      queryFn: async (payload) => ({ data: createAssignOpdRow(payload) }),
      invalidatesTags: ['AssignOpdService'],
    }),
    updateAssignOpdService: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateAssignOpdRow(id, payload) }),
      invalidatesTags: ['AssignOpdService'],
    }),
    deleteAssignOpdService: builder.mutation({
      queryFn: async (id) => {
        deleteAssignOpdRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['AssignOpdService'],
    }),
    
    getWardBeds: builder.query({
      queryFn: async () => ({ data: getWardBedRows() }),
      providesTags: ['WardBed'],
    }),
    createWardBed: builder.mutation({
      queryFn: async (payload) => ({ data: createWardBedRow(payload) }),
      invalidatesTags: ['WardBed'],
    }),
    updateWardBed: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateWardBedRow(id, payload) }),
      invalidatesTags: ['WardBed'],
    }),
    deleteWardBed: builder.mutation({
      queryFn: async (id) => {
        deleteWardBedRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['WardBed', 'BedLocation'],
    }),
    getBedLocations: builder.query({
      queryFn: async () => ({ data: getBedLocationRows() }),
      providesTags: ['BedLocation'],
    }),
    createBedLocation: builder.mutation({
      queryFn: async (payload) => ({ data: createBedLocationRow(payload) }),
      invalidatesTags: ['BedLocation'],
    }),
    updateBedLocation: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateBedLocationRow(id, payload) }),
      invalidatesTags: ['BedLocation'],
    }),
    deleteBedLocation: builder.mutation({
      queryFn: async (id) => {
        deleteBedLocationRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['BedLocation'],
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
  useGetPatientTypesQuery,
  useCreatePatientTypeMutation,
  useUpdatePatientTypeMutation,
  useDeletePatientTypeMutation,
  useGetAssignOpdServicesQuery,
  useCreateAssignOpdServiceMutation,
  useUpdateAssignOpdServiceMutation,
  useDeleteAssignOpdServiceMutation,
    useGetWardBedsQuery,
  useCreateWardBedMutation,
  useUpdateWardBedMutation,
  useDeleteWardBedMutation,
  useGetBedLocationsQuery,
  useCreateBedLocationMutation,
  useUpdateBedLocationMutation,
  useDeleteBedLocationMutation,
} = serviceAdminApi;