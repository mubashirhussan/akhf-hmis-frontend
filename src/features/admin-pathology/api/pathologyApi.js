import { api } from "@/store/api";
import {
  addPathologyConditionOption,
  getPathologyConditionOptions,
  GENDER_OPTIONS,
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
  query: ({ page, pageSize,search  }) => ({
    url: "/admin/pathology/groups",
    params: {
      page,
      pageSize,
      search 
    },
  }),

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
  query: () => "/admin/pathology/components",
  transformResponse: (response) =>
    response.data.map((item) => ({
      id: String(item.TCID),
      tcid: item.TCID,
      tid: item.TID,
      TID: item.TID,
      TGID: item.TGID ?? null,
      groupName: item.TGName ?? "",
      subGroupName: item.TSGName ?? "",
      testName: item.TestName ?? "",
      componentName: item.ComponentName ?? "",
      fieldType: item.E_Field_Type ?? "",
      unit: item.TC_Range_Unit ?? "",
      referenceMale: item.TC_Range_Unit ?? "",
      referenceFemale: item.TC_Range_Unit_Female ?? "",
      priority: item.Priority ?? 1,
      toolTip: item.Critical_Values ?? "",
      maxLength: item.MaxLength ?? 0,
      minValue: item.Min_Value ?? "",
      maxValue: item.Max_Value ?? "",
      tmUnitID: item.TmUnitID ?? null,
    })),
  providesTags: ["PathologyComponent"],
}),
deletePathologyComponent: builder.mutation({
  query: (id) => ({
    url: `/admin/pathology/components/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["PathologyComponent"],
}),
getPathologyTestRanges: builder.query({
      query: () => "/admin/pathology/ranges",
      transformResponse: (response) =>
        response.data.map((item) => ({
          id: String(item.Refid),
          refid: item.Refid,
          tcId: item.TCId,
          tid: item.TID,
          testName: item.TestName ?? "",
          componentName: item.ComponentName ?? "",
          startValue: item.StartValue !== null && item.StartValue !== undefined ? String(item.StartValue) : "",
          endValue: item.EndValue !== null && item.EndValue !== undefined ? String(item.EndValue) : "",
          reportValues: item.Report_Values ?? "",
          gender: item.Gender ?? "Both",
          genderId: item.Gender_ID ?? 77,
          minAge: item.Min_Age1 ?? "0 (0  Y  0  M  0  D )",
          maxAge: item.Max_Age1 ?? "0 (0  Y  0  M  0  D )",
          minAgeVal: item.Min_Age ?? 0,
          maxAgeVal: item.Max_Age ?? 0,
        })),
      providesTags: ["PathologyTestRange"],
    }),
getPathologyLookups: builder.query({
  queryFn: async () => ({
    data: {
      fieldTypeOptions: [
        { value: "Html", label: "Html" },
        { value: "TextBox", label: "TextBox" },
        { value: "RadioButtonList", label: "RadioButtonList" },
        { value: "CheckBoxList", label: "CheckBoxList" },
        { value: "RadioButton", label: "RadioButton" },
        { value: "CheckBox", label: "CheckBox" },
        { value: "DropDownList", label: "DropDownList" },
      ],
      unitOptions: [],
      genderOptions: GENDER_OPTIONS,
      conditionOptions: getPathologyConditionOptions(),
    },
  }),
  providesTags: ["PathologyLookups"],
}),
createPathologyComponent: builder.mutation({
  query: (rowPayload) => ({
    url: "/admin/pathology/components",
    method: "POST",
    body: {
      tid: rowPayload.TID,
      tgid: rowPayload.TGID,
      componentName: rowPayload.componentName,
      tmUnitID: rowPayload.tmUnitID ?? 0,
      e_Field_Type: rowPayload.fieldType,
      tC_Range_Unit: rowPayload.referenceMale,
      tC_Range_Unit_Female: rowPayload.referenceFemale,
      priority: rowPayload.priority,
      maxLength: rowPayload.maxLength ?? 0,
      min_Value: rowPayload.minValue ?? "",
      max_Value: rowPayload.maxValue ?? "",
      critical_Values: rowPayload.toolTip ?? "",
    },
  }),
  invalidatesTags: ["PathologyComponent"],
}),
updatePathologyComponent: builder.mutation({
  query: ({ id, ...rowPayload }) => ({
    url: `/admin/pathology/components/${id}`,
    method: "PUT",
    body: {
      tid: rowPayload.TID,
      tgid: rowPayload.TGID,
      componentName: rowPayload.componentName,
      tmUnitID: rowPayload.tmUnitID ?? 0,
      e_Field_Type: rowPayload.fieldType,
      tC_Range_Unit: rowPayload.referenceMale,
      tC_Range_Unit_Female: rowPayload.referenceFemale,
      priority: rowPayload.priority,
      maxLength: rowPayload.maxLength ?? 0,
      min_Value: rowPayload.minValue ?? "",
      max_Value: rowPayload.maxValue ?? "",
      critical_Values: rowPayload.toolTip ?? "",
    },
  }),
  invalidatesTags: ["PathologyComponent"],
}),
addPathologyUnit: builder.mutation({
  queryFn: async (option) => ({ data: option }),
  invalidatesTags: ["PathologyLookups"],
}),
createPathologyTestRange: builder.mutation({
      query: (rowPayload) => ({
        url: "/admin/pathology/ranges",
        method: "POST",
        body: {
          tcId: rowPayload.tcId ?? 0,
          startValue: rowPayload.startValue !== "" ? Number(rowPayload.startValue) : null,
          endValue: rowPayload.endValue !== "" ? Number(rowPayload.endValue) : null,
          gender_ID: rowPayload.genderId ?? 77,
          min_Age: rowPayload.minAgeVal ?? 0,
          max_Age: rowPayload.maxAgeVal ?? 0,
          age_Unit: rowPayload.ageUnit ?? "Y",
          report_Values: rowPayload.reportValues ?? "",
        },
      }),
      invalidatesTags: ["PathologyTestRange"],
    }),
updatePathologyTestRange: builder.mutation({
      query: ({ id, ...rowPayload }) => ({
        url: `/admin/pathology/ranges/${id}`,
        method: "PUT",
        body: {
          tcId: rowPayload.tcId ?? 0,
          startValue: rowPayload.startValue !== "" ? Number(rowPayload.startValue) : null,
          endValue: rowPayload.endValue !== "" ? Number(rowPayload.endValue) : null,
          gender_ID: rowPayload.genderId ?? 77,
          min_Age: rowPayload.minAgeVal ?? 0,
          max_Age: rowPayload.maxAgeVal ?? 0,
          age_Unit: rowPayload.ageUnit ?? "Y",
          report_Values: rowPayload.reportValues ?? "",
        },
      }),
      invalidatesTags: ["PathologyTestRange"],
    }),
deletePathologyTestRange: builder.mutation({
      query: (id) => ({
        url: `/admin/pathology/ranges/${id}`,
        method: "DELETE",
      }),
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
