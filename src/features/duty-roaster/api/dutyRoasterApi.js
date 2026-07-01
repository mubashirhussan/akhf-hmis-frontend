import { api } from '@/store/api';
import {
  getShiftRows,
  createShiftRow,
  updateShiftRow,
  deleteShiftRow,
} from '@/features/duty-roaster/api/mock-shifts';

export const dutyRoasterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      queryFn: async () => ({ data: getShiftRows() }),
      providesTags: ['Shift'],
    }),

    addShift: builder.mutation({
      queryFn: async (payload) => ({ data: createShiftRow(payload) }),
      invalidatesTags: ['Shift'],
    }),

    updateShift: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({ data: updateShiftRow(id, payload) }),
      invalidatesTags: ['Shift'],
    }),

    deleteShift: builder.mutation({
      queryFn: async (id) => {
        deleteShiftRow(id);
        return { data: true };
      },
      invalidatesTags: ['Shift'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = dutyRoasterApi;
