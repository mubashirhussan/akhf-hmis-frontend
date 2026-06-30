import { api } from '@/store/api';
import {
  getEmployeeRows,
  getEmployeeById,
  createEmployeeRow,
  updateEmployeeRow,
  saveEmployeeSection,
  deleteEmployeeRow,
  toggleEmployeeActive,
} from '@/features/human-resource/api/mock-employees';
import { searchEmployees } from '@/features/human-resource/api/mock-employee-search';
import {
  getHospitalRows,
  createHospitalRow,
  updateHospitalRow,
  deleteHospitalRow,
} from '@/features/human-resource/api/mock-hospitals';

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      queryFn: async () => ({ data: getEmployeeRows() }),
      providesTags: ['Employee'],
    }),
    searchEmployees: builder.query({
      queryFn: async (filters) => ({ data: searchEmployees(filters) }),
      providesTags: ['Employee'],
    }),
    getEmployee: builder.query({
      queryFn: async (id) => {
        const employee = getEmployeeById(id);
        if (!employee) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data: employee };
      },
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),
    createEmployee: builder.mutation({
      queryFn: async (employeePayload) => ({
        data: createEmployeeRow(employeePayload),
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployeeInfo: builder.mutation({
      queryFn: async ({ id, ...employeePayload }) => {
        const employee = updateEmployeeRow(id, employeePayload);
        if (!employee) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data: employee };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }, 'Employee'],
    }),    
    saveEmployeeEducations: builder.mutation({
      queryFn: async ({ id, educations }) => {
        const data = saveEmployeeSection(id, 'educations', educations);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeCertificates: builder.mutation({
      queryFn: async ({ id, certificates }) => {
        const data = saveEmployeeSection(id, 'certificates', certificates);
        if (!data) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeDocuments: builder.mutation({
      queryFn: async ({ id, documents }) => {
        const data = saveEmployeeSection(id, 'documents', documents);
        if (!data) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeSkills: builder.mutation({
      queryFn: async ({ id, skills }) => {
        const data = saveEmployeeSection(id, 'skills', skills);
        if (!data) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeRelationships: builder.mutation({
      queryFn: async ({ id, relationships }) => {
        const data = saveEmployeeSection(id, 'relationships', relationships);
        if (!data) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeAdditionalInfos: builder.mutation({
      queryFn: async ({ id, additionalInfos }) => {
        const data = saveEmployeeSection(id, 'additionalInfos', additionalInfos);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeCards: builder.mutation({
      queryFn: async ({ id, cards }) => {
        const data = saveEmployeeSection(id, 'cards', cards);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeEmpConfirmations: builder.mutation({
      queryFn: async ({ id, empConfirmations }) => {
        const data = saveEmployeeSection(id, 'empConfirmations', empConfirmations);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeResignations: builder.mutation({
      queryFn: async ({ id, resignations }) => {
        const data = saveEmployeeSection(id, 'resignations', resignations);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeSuspensions: builder.mutation({
      queryFn: async ({ id, suspensions }) => {
        const data = saveEmployeeSection(id, 'suspensions', suspensions);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeContracts: builder.mutation({
      queryFn: async ({ id, contracts }) => {
        const data = saveEmployeeSection(id, 'contracts', contracts);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeAcImprovements: builder.mutation({
      queryFn: async ({ id, acImprovements }) => {
        const data = saveEmployeeSection(id, 'acImprovements', acImprovements);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeProImprovements: builder.mutation({
      queryFn: async ({ id, proImprovements }) => {
        const data = saveEmployeeSection(id, 'proImprovements', proImprovements);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeJobHistories: builder.mutation({
      queryFn: async ({ id, jobHistories }) => {
        const data = saveEmployeeSection(id, 'jobHistories', jobHistories);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeFileLabels: builder.mutation({
      queryFn: async ({ id, fileLabels }) => {
        const data = saveEmployeeSection(id, 'fileLabels', fileLabels);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeeEmpSummaries: builder.mutation({
      queryFn: async ({ id, empSummaries }) => {
        const data = saveEmployeeSection(id, 'empSummaries', empSummaries);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    saveEmployeePromotions: builder.mutation({
      queryFn: async ({ id, promotions }) => {
        const data = saveEmployeeSection(id, 'promotions', promotions);
        if (!data) return { error: { status: 404, data: 'Employee not found' } };
        return { data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteEmployee: builder.mutation({
      queryFn: async (id) => {
        const deleted = deleteEmployeeRow(id);
        if (!deleted) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data: { id } };
      },
      invalidatesTags: ['Employee'],
    }),
getHospitals: builder.query({
    queryFn: async () => ({
        data: getHospitalRows(),
    }),
    providesTags: ['Hospital'],
}),

addHospital: builder.mutation({
    queryFn: async (payload) => ({
        data: createHospitalRow(payload),
    }),
    invalidatesTags: ['Hospital'],
}),

updateHospital: builder.mutation({
    queryFn: async ({ id, payload }) => ({
        data: updateHospitalRow(id, payload),
    }),
    invalidatesTags: ['Hospital'],
}),

deleteHospital: builder.mutation({
    queryFn: async (id) => {
        deleteHospitalRow(id);
        return { data: true };
    },
    invalidatesTags: ['Hospital'],
}),
    toggleEmployeeActive: builder.mutation({
      queryFn: async (id) => {
        const employee = toggleEmployeeActive(id);
        if (!employee) {
          return { error: { status: 404, data: 'Employee not found' } };
        }
        return { data: employee };
      },
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useSearchEmployeesQuery,
  useLazySearchEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeInfoMutation,
    useSaveEmployeeEducationsMutation,
  useSaveEmployeeCertificatesMutation,
  useSaveEmployeeDocumentsMutation,
  useSaveEmployeeSkillsMutation,
  useSaveEmployeeRelationshipsMutation,
  useSaveEmployeeAdditionalInfosMutation,
  useSaveEmployeeCardsMutation,
  useSaveEmployeeEmpConfirmationsMutation,
  useSaveEmployeeResignationsMutation,
  useSaveEmployeeSuspensionsMutation,
  useSaveEmployeeContractsMutation,
  useSaveEmployeeAcImprovementsMutation,
  useSaveEmployeeProImprovementsMutation,
  useSaveEmployeeJobHistoriesMutation,
  useSaveEmployeeFileLabelsMutation,
  useSaveEmployeeEmpSummariesMutation,
  useSaveEmployeePromotionsMutation,
  useDeleteEmployeeMutation,
  useGetHospitalsQuery,
  useAddHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
  useToggleEmployeeActiveMutation,
} = employeeApi;
