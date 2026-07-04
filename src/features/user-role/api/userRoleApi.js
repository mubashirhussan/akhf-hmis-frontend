import { api } from '@/store/api';
import {
  createUserLoginRow,
  getUserLoginRows,
} from '@/features/user-role/api/mock-create-login';

export const userRoleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserLogins: builder.query({
      queryFn: async () => ({ data: getUserLoginRows() }),
      providesTags: ['UserLogin'],
    }),

    createUserLogin: builder.mutation({
      queryFn: async (payload) => ({ data: createUserLoginRow(payload) }),
      invalidatesTags: ['UserLogin'],
    }),
  }),
});

export const {
  useGetUserLoginsQuery,
  useCreateUserLoginMutation,
} = userRoleApi;
