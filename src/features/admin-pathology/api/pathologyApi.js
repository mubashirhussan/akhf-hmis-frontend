import { api } from "@/store/api";
import {
  getMainGroupRows,
  createMainGroupRow,
  updateMainGroupRow,
  deleteMainGroupRow,
} from "@/features/admin-pathology/api/mock-main-group";
import {
  getSubGroupRows,
  createSubGroupRow,
  updateSubGroupRow,
  deleteSubGroupRow,
} from "@/features/admin-pathology/api/mock-sub-group";
import {
  getTestNameRows,
  createTestNameRow,
  updateTestNameRow,
  deleteTestNameRow,
} from "@/features/admin-pathology/api/mock-test-name";
import {
  addPathologyUnitOption,
  createPathologyComponentRow,
  FIELD_TYPE_OPTIONS,
  getPathologyComponentRows,
  getPathologyUnitOptions,
  GROUP_OPTIONS,
  SUB_GROUP_OPTIONS,
  TEST_OPTIONS,
  updatePathologyComponentRow,
} from "@/features/admin-pathology/api/mock-pathology-component";
import {
  addPathologyConditionOption,
  createPathologyTestRangeRow,
  deletePathologyTestRangeRow,
  getPathologyConditionOptions,
  getPathologyTestRangeRows,
  GENDER_OPTIONS,
  updatePathologyTestRangeRow,
} from "@/features/admin-pathology/api/mock-pathology-test-range";
import {
  getTestBookingRows,
  createTestBookingRow,
  updateTestBookingRow,
  deleteTestBookingRow,
} from "@/features/admin-pathology/api/mock-test-booking";
import {
  getReportConsultantRows,
  createReportConsultantRow,
  updateReportConsultantRow,
  deleteReportConsultantRow,
} from "@/features/admin-pathology/api/mock-report-consultant";
import {
  getInterpretationRows,
  createInterpretationRow,
  updateInterpretationRow,
  deleteInterpretationRow,
} from "@/features/admin-pathology/api/mock-interpretation";
export const pathologyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMainGroups: builder.query({
      queryFn: async () => ({ data: getMainGroupRows() }),
      providesTags: ["MainGroup"],
    }),
    createMainGroup: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createMainGroupRow(rowPayload),
      }),
      invalidatesTags: ["MainGroup"],
    }),

    updateMainGroup: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateMainGroupRow(id, rowPayload),
      }),
      invalidatesTags: ["MainGroup"],
    }),

    deleteMainGroup: builder.mutation({
      queryFn: async (id) => {
        deleteMainGroupRow(id);
        return { data: { id } };
      },
      invalidatesTags: ["MainGroup"],
    }),
    getSubGroups: builder.query({
      queryFn: async () => ({ data: getSubGroupRows() }),
      providesTags: ["SubGroup"],
    }),
    createSubGroup: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createSubGroupRow(rowPayload),
      }),
      invalidatesTags: ["SubGroup"],
    }),

    updateSubGroup: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateSubGroupRow(id, rowPayload),
      }),
      invalidatesTags: ["SubGroup"],
    }),

    deleteSubGroup: builder.mutation({
      queryFn: async (id) => {
        deleteSubGroupRow(id);

        return {
          data: { id },
        };
      },
      invalidatesTags: ["SubGroup"],
    }),
    getTestNames: builder.query({
      queryFn: async () => ({ data: getTestNameRows() }),
      providesTags: ["TestName"],
    }),
    createTestName: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createTestNameRow(rowPayload),
      }),
      invalidatesTags: ["TestName"],
    }),

    updateTestName: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateTestNameRow(id, rowPayload),
      }),
      invalidatesTags: ["TestName"],
    }),

    deleteTestName: builder.mutation({
      queryFn: async (id) => {
        deleteTestNameRow(id);

        return {
          data: { id },
        };
      },
      invalidatesTags: ["TestName"],
    }),
    getPathologyComponents: builder.query({
      queryFn: async () => ({ data: getPathologyComponentRows() }),
      providesTags: ["PathologyComponent"],
    }),
    getPathologyTestRanges: builder.query({
      queryFn: async () => ({ data: getPathologyTestRangeRows() }),
      providesTags: ["PathologyTestRange"],
    }),
    getPathologyLookups: builder.query({
      queryFn: async () => ({
        data: {
          groupOptions: GROUP_OPTIONS,
          subGroupOptions: SUB_GROUP_OPTIONS,
          testOptions: TEST_OPTIONS,
          fieldTypeOptions: FIELD_TYPE_OPTIONS,
          unitOptions: getPathologyUnitOptions(),
          genderOptions: GENDER_OPTIONS,
          conditionOptions: getPathologyConditionOptions(),
        },
      }),
      providesTags: ["PathologyLookups"],
    }),
    createPathologyComponent: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createPathologyComponentRow(rowPayload),
      }),
      invalidatesTags: ["PathologyComponent", "PathologyLookups"],
    }),
    updatePathologyComponent: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updatePathologyComponentRow(id, rowPayload),
      }),
      invalidatesTags: ["PathologyComponent", "PathologyLookups"],
    }),
    addPathologyUnit: builder.mutation({
      queryFn: async (option) => ({ data: addPathologyUnitOption(option) }),
      invalidatesTags: ["PathologyLookups"],
    }),
    createPathologyTestRange: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createPathologyTestRangeRow(rowPayload),
      }),
      invalidatesTags: ["PathologyTestRange"],
    }),
    updatePathologyTestRange: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updatePathologyTestRangeRow(id, rowPayload),
      }),
      invalidatesTags: ["PathologyTestRange"],
    }),
    deletePathologyTestRange: builder.mutation({
      queryFn: async (id) => {
        deletePathologyTestRangeRow(id);
        return { data: { id } };
      },
      invalidatesTags: ["PathologyTestRange"],
    }),
    getTestBookings: builder.query({
  queryFn: async () => ({ data: getTestBookingRows() }),
  providesTags: ["TestBooking"],
}),

createTestBooking: builder.mutation({
  queryFn: async (rowPayload) => ({
    data: createTestBookingRow(rowPayload),
  }),
  invalidatesTags: ["TestBooking"],
}),

updateTestBooking: builder.mutation({
  queryFn: async ({ id, ...rowPayload }) => ({
    data: updateTestBookingRow(id, rowPayload),
  }),
  invalidatesTags: ["TestBooking"],
}),

deleteTestBooking: builder.mutation({
  queryFn: async (id) => {
    deleteTestBookingRow(id);
    return { data: { id } };
  },
  invalidatesTags: ["TestBooking"],
}),
    addPathologyCondition: builder.mutation({
      queryFn: async (option) => ({
        data: addPathologyConditionOption(option),
      }),
      invalidatesTags: ["PathologyLookups"],
    }),
    getReportConsultants: builder.query({
      queryFn: async () => ({ data: getReportConsultantRows() }),
      providesTags: ["ReportConsultant"],
    }),
    createReportConsultant: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createReportConsultantRow(rowPayload),
      }),
      invalidatesTags: ["ReportConsultant"],
    }),
    updateReportConsultant: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateReportConsultantRow(id, rowPayload),
      }),
      invalidatesTags: ["ReportConsultant"],
    }),
    deleteReportConsultant: builder.mutation({
      queryFn: async (id) => {
        deleteReportConsultantRow(id);
        return { data: { id } };
      },
      invalidatesTags: ["ReportConsultant"],
    }),
    getInterpretations: builder.query({
      queryFn: async () => ({ data: getInterpretationRows() }),
      providesTags: ["Interpretation"],
    }),
    createInterpretation: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createInterpretationRow(rowPayload),
      }),
      invalidatesTags: ["Interpretation"],
    }),
    updateInterpretation: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateInterpretationRow(id, rowPayload),
      }),
      invalidatesTags: ["Interpretation"],
    }),
    deleteInterpretation: builder.mutation({
      queryFn: async (id) => {
        deleteInterpretationRow(id);
        return { data: { id } };
      },
      invalidatesTags: ["Interpretation"],
    }),
  }),
});

export const {
  useGetMainGroupsQuery,
  useCreateMainGroupMutation,
  useUpdateMainGroupMutation,
  useDeleteMainGroupMutation,
  useGetSubGroupsQuery,
  useCreateSubGroupMutation,
  useUpdateSubGroupMutation,
  useDeleteSubGroupMutation,
  useGetTestNamesQuery,
  useCreateTestNameMutation,
  useUpdateTestNameMutation,
  useDeleteTestNameMutation,
  useGetPathologyComponentsQuery,
  useGetPathologyTestRangesQuery,
  useGetPathologyLookupsQuery,
  useCreatePathologyComponentMutation,
  useUpdatePathologyComponentMutation,
  useAddPathologyUnitMutation,
  useCreatePathologyTestRangeMutation,
  useUpdatePathologyTestRangeMutation,
  useDeletePathologyTestRangeMutation,
  useAddPathologyConditionMutation,
  useGetTestBookingsQuery,
  useCreateTestBookingMutation,
  useUpdateTestBookingMutation,
  useDeleteTestBookingMutation,
  useGetReportConsultantsQuery,
  useCreateReportConsultantMutation,
  useUpdateReportConsultantMutation,
  useDeleteReportConsultantMutation,
  useGetInterpretationsQuery,
  useCreateInterpretationMutation,
  useUpdateInterpretationMutation,
  useDeleteInterpretationMutation,
} = pathologyApi;
