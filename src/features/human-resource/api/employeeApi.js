import { api } from '@/store/api';
import {
  getEmployeeRows,
  getEmployeeById,
  createEmployeeRow,
  updateEmployeeRow,
  saveEmployeeSection,
} from '@/features/human-resource/api/mock-employees';

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      queryFn: async () => ({ data: getEmployeeRows() }),
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
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeInfoMutation,
  useSaveEmployeeCertificatesMutation,
  useSaveEmployeeDocumentsMutation,
  useSaveEmployeeSkillsMutation,
  useSaveEmployeeRelationshipsMutation,
} = employeeApi;
