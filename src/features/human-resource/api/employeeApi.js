import { api } from '@/store/api';
import {
  getEmployeeRows,
  getEmployeeById,
  createEmployeeRow,
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
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
} = employeeApi;
