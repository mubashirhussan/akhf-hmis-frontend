import { api } from '@/store/api';
import { endpoints } from '@/services/endpoints';
import { setCredentials } from '@/store/authSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ userName, password }) => ({
        url: endpoints.auth.login,
        method: 'POST',
        body: { userName, password },
      }),
      transformResponse: (response) => {
        if (!response?.success) {
          throw new Error(response?.message || 'Login failed');
        }
        return {
          token: response.data.token,
          user: response.data.user,
        };
      },
      async onQueryStarted({ remember }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          setCredentials({
            token: data.token,
            user: data.user,
            remember,
          }),
        );
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
