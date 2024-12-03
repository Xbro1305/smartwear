import { baseApi } from '@/shared/api';  
import { RegisterDto, RequestAdminCodeDto, RequestCodeDto, ConfirmCodeDto, LoginDto } from './auth.types';
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    register: builder.mutation<void, RegisterDto>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    confirmRegistration: builder.mutation<void, ConfirmCodeDto>({
      query: (body) => ({
        url: '/auth/confirm-registration',
        method: 'POST',
        body,
      }),
    }),

    requestCode: builder.mutation<void, RequestCodeDto>({
      query: (body) => ({
        url: '/auth/request-code',
        method: 'POST',
        body,
      }),
    }),

    requestAdminCode: builder.mutation<void, RequestAdminCodeDto>({
      query: (body) => ({
        url: '/auth/request-admin-code',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<{ access_token: string }, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<any, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
        
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useConfirmRegistrationMutation,
  useRequestCodeMutation,
  useRequestAdminCodeMutation,
  useLoginMutation,
  useGetMeQuery, 
} = authApi;
