import { api } from '@/store/api';
import { endpoints } from '@/services/endpoints';
import { setCredentials } from '@/store/authSlice';
import { persistAuthSession } from '@/features/auth/session';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      async queryFn({ userName, password, remember }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: endpoints.auth.login,
          method: 'POST',
          body: { userName, password },
        });

        if (result.error) {
          return { error: result.error };
        }

        const response = result.data;
        if (!response?.success) {
          return {
            error: {
              status: 400,
              data: { message: response?.message || 'Login failed' },
            },
          };
        }

        const token = response.data?.token;
        const user = response.data?.user ?? null;

        if (!token) {
          return {
            error: {
              status: 400,
              data: { message: 'Login succeeded but no token was returned' },
            },
          };
        }

        try {
          await persistAuthSession({ token, user, remember });
        } catch {
          return {
            error: {
              status: 500,
              data: { message: 'Signed in, but failed to create a secure session. Try again.' },
            },
          };
        }

        return { data: { token, user } };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // LoginPage handles and displays the error.
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
