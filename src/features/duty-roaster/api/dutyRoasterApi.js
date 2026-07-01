import { api } from '@/store/api';
import {
  getShiftRows,
  createShiftRow,
  updateShiftRow,
  deleteShiftRow,
} from '@/features/duty-roaster/api/mock-shifts';
import {
  getAdminDutyRoasterRows,
  createAdminDutyRoasterRow,
  updateAdminDutyRoasterRow,
  deleteAdminDutyRoasterRow,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';

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

    getAdminDutyRoasters: builder.query({
      queryFn: async () => ({ data: getAdminDutyRoasterRows() }),
      providesTags: ['AdminDutyRoaster'],
    }),

    addAdminDutyRoaster: builder.mutation({
      queryFn: async (payload) => ({ data: createAdminDutyRoasterRow(payload) }),
      invalidatesTags: ['AdminDutyRoaster'],
    }),

    updateAdminDutyRoaster: builder.mutation({
      queryFn: async ({ id, ...payload }) => ({
        data: updateAdminDutyRoasterRow(id, payload),
      }),
      invalidatesTags: ['AdminDutyRoaster'],
    }),

    deleteAdminDutyRoaster: builder.mutation({
      queryFn: async (id) => {
        deleteAdminDutyRoasterRow(id);
        return { data: true };
      },
      invalidatesTags: ['AdminDutyRoaster'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useGetAdminDutyRoastersQuery,
  useAddAdminDutyRoasterMutation,
  useUpdateAdminDutyRoasterMutation,
  useDeleteAdminDutyRoasterMutation,
} = dutyRoasterApi;
