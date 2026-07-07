import { api } from "@/store/api";
import {
  addPathologyUnitOption,
  createPathologyComponentRow,
  deletePathologyComponentRow,
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
import {
  getMachineIntegrationCompwiseRows,
  createMachineIntegrationCompwiseRow,
  updateMachineIntegrationCompwiseRow,
  deleteMachineIntegrationCompwiseRow,
} from "@/features/admin-pathology/api/mock-machine-integration-compwise";
export const pathologyApi = api.injectEndpoints({
  endpoints: (builder) => ({
getMainGroups: builder.query({
  query: () => "/admin/pathology/groups",
  transformResponse: (response) =>
response.data.map((item) => ({
  id: String(item.TGID),
  groupId: item.TGID,
  TGID: item.TGID,
  groupName: item.TGName,
  fee: item.Fee ?? 0,
})),
  providesTags: ["MainGroup"],
}),
createMainGroup: builder.mutation({
  query: (rowPayload) => ({
    url: "/admin/pathology/groups",
    method: "POST",
    body: {
      TGName: rowPayload.groupName,
      Fee: rowPayload.fee,
    },
  }),
  invalidatesTags: ["MainGroup"],
}),
updateMainGroup: builder.mutation({
  query: ({ id, ...rowPayload }) => ({
    url: `/admin/pathology/groups/${id}`,
    method: "PUT",
    body: {
      TGName: rowPayload.groupName,
      Fee: rowPayload.fee,
    },
  }),
  invalidatesTags: ["MainGroup"],
}),
deleteMainGroup: builder.mutation({
  query: (id) => ({
    url: `/admin/pathology/groups/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["MainGroup"],
}),
  getSubGroups: builder.query({
  query: () => "/admin/pathology/sub-groups",
  transformResponse: (response) =>
    response.data.map((item) => ({
      id: String(item.TSGID),
      TGID: item.TGID,
      groupName: item.TGName,
      TSGID: item.TSGID,
      subGroupName: item.TSGName,
      fee: item.Fee ?? 0,
    })),
  providesTags: ["SubGroup"],
}),
createSubGroup: builder.mutation({
  query: (rowPayload) => ({
    url: "/admin/pathology/sub-groups",
    method: "POST",
    body: {
      TGName: rowPayload.groupName,
      TGID: rowPayload.TGID,
      TSGName: rowPayload.subGroupName,
      Fee: rowPayload.fee,
    },
  }),
  invalidatesTags: ["SubGroup"],
}),
updateSubGroup: builder.mutation({
  query: ({ id, ...rowPayload }) => ({
    url: `/admin/pathology/sub-groups/${id}`,
    method: "PUT",
    body: {
      TGName: rowPayload.groupName,
      TGID: rowPayload.TGID,
      TSGName: rowPayload.subGroupName,
      Fee: rowPayload.fee,
    },
  }),
  invalidatesTags: ["SubGroup"],
}),
deleteSubGroup: builder.mutation({
  query: (id) => ({
    url: `/admin/pathology/sub-groups/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["SubGroup"],
}),
getTestNames: builder.query({
  query: () => "/admin/pathology/tests",
  transformResponse: (response) =>
    response.data.map((item) => ({
      id: String(item.TID),
      tid: item.TID,
      TGID: item.TGID ?? null,
      TSGID: item.TSGID ?? null,
      groupName: item.TGName,
      subGroupName: item.TSGName,
      testName: item.TestName,
      fieldType: item.E_Field_Type ?? null,
      fee: item.Fee ?? 0,
      medicalName: item.MedicalName ?? "",
      standardName: item.StandardName ?? "",
    })),
  providesTags: ["TestName"],
}),
createTestName: builder.mutation({
  query: (rowPayload) => ({
    url: "/admin/pathology/tests",
    method: "POST",
    body: {
      tgid: rowPayload.TGID,
      tsgid: rowPayload.TSGID,
      testName: rowPayload.testName,
      fee: rowPayload.fee,
      medicalName: rowPayload.medicalName,
      standardName: rowPayload.standardName,
    },
  }),
  invalidatesTags: ["TestName"],
}),
updateTestName: builder.mutation({
  query: ({ id, ...rowPayload }) => ({
    url: `/admin/pathology/tests/${id}`,
    method: "PUT",
    body: {
      tgid: rowPayload.TGID,
      tsgid: rowPayload.TSGID,
      testName: rowPayload.testName,
      fee: rowPayload.fee,
      medicalName: rowPayload.medicalName,
      standardName: rowPayload.standardName,
    },
  }),
  invalidatesTags: ["TestName"],
}),
deleteTestName: builder.mutation({
  query: (id) => ({
    url: `/admin/pathology/tests/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["TestName"],
}),
    getPathologyComponents: builder.query({
      queryFn: async () => ({ data: getPathologyComponentRows() }),
      providesTags: ["PathologyComponent"],
    }),
    deletePathologyComponent: builder.mutation({
  queryFn: async (id) => {
    deletePathologyComponentRow(id);
    return { data: { id } };
  },
  invalidatesTags: ["PathologyComponent", "PathologyLookups"],
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
    getMachineIntegrationCompwise: builder.query({
      queryFn: async () => ({ data: getMachineIntegrationCompwiseRows() }),
      providesTags: ["MachineIntegrationCompwise"],
    }),
    createMachineIntegrationCompwise: builder.mutation({
      queryFn: async (rowPayload) => ({
        data: createMachineIntegrationCompwiseRow(rowPayload),
      }),
      invalidatesTags: ["MachineIntegrationCompwise"],
    }),
    updateMachineIntegrationCompwise: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updateMachineIntegrationCompwiseRow(id, rowPayload),
      }),
      invalidatesTags: ["MachineIntegrationCompwise"],
    }),
    deleteMachineIntegrationCompwise: builder.mutation({
      queryFn: async (id) => {
        deleteMachineIntegrationCompwiseRow(id);
        return { data: { id } };
      },
      invalidatesTags: ["MachineIntegrationCompwise"],
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
  useDeletePathologyComponentMutation,
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
  useGetMachineIntegrationCompwiseQuery,
  useCreateMachineIntegrationCompwiseMutation,
  useUpdateMachineIntegrationCompwiseMutation,
  useDeleteMachineIntegrationCompwiseMutation,
} = pathologyApi;
