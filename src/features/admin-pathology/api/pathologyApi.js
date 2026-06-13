import { api } from '@/store/api';
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
} from '@/features/admin-pathology/api/mock-pathology-component';
import {
  addPathologyConditionOption,
  createPathologyTestRangeRow,
  deletePathologyTestRangeRow,
  getPathologyConditionOptions,
  getPathologyTestRangeRows,
  GENDER_OPTIONS,
  updatePathologyTestRangeRow,
} from '@/features/admin-pathology/api/mock-pathology-test-range';

export const pathologyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPathologyComponents: builder.query({
      queryFn: async () => ({ data: getPathologyComponentRows() }),
      providesTags: ['PathologyComponent'],
    }),
    getPathologyTestRanges: builder.query({
      queryFn: async () => ({ data: getPathologyTestRangeRows() }),
      providesTags: ['PathologyTestRange'],
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
      providesTags: ['PathologyLookups'],
    }),
    createPathologyComponent: builder.mutation({
      queryFn: async (rowPayload) => ({ data: createPathologyComponentRow(rowPayload) }),
      invalidatesTags: ['PathologyComponent', 'PathologyLookups'],
    }),
    updatePathologyComponent: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updatePathologyComponentRow(id, rowPayload),
      }),
      invalidatesTags: ['PathologyComponent', 'PathologyLookups'],
    }),
    addPathologyUnit: builder.mutation({
      queryFn: async (option) => ({ data: addPathologyUnitOption(option) }),
      invalidatesTags: ['PathologyLookups'],
    }),
    createPathologyTestRange: builder.mutation({
      queryFn: async (rowPayload) => ({ data: createPathologyTestRangeRow(rowPayload) }),
      invalidatesTags: ['PathologyTestRange'],
    }),
    updatePathologyTestRange: builder.mutation({
      queryFn: async ({ id, ...rowPayload }) => ({
        data: updatePathologyTestRangeRow(id, rowPayload),
      }),
      invalidatesTags: ['PathologyTestRange'],
    }),
    deletePathologyTestRange: builder.mutation({
      queryFn: async (id) => {
        deletePathologyTestRangeRow(id);
        return { data: { id } };
      },
      invalidatesTags: ['PathologyTestRange'],
    }),
    addPathologyCondition: builder.mutation({
      queryFn: async (option) => ({ data: addPathologyConditionOption(option) }),
      invalidatesTags: ['PathologyLookups'],
    }),
  }),
});

export const {
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
} = pathologyApi;
