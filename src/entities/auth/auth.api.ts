import { baseApi } from '@/shared/api'

import {
  AdminData,
  ConfirmCodeDto,
  LoginDto,
  RegisterDto,
  RegisteredDto,
  RequestAdminCodeDto,
  RequestCodeDto,
} from './auth.types'
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    confirmRegistration: builder.mutation<void, ConfirmCodeDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/confirm-registration',
      }),
    }),

    getMe: builder.query<RegisteredDto, void>({
      query: () => ({
        method: 'GET',
        url: '/users/me',
      }),
    }),

    login: builder.mutation<{ access_token: string; user: RegisteredDto }, LoginDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/login',
      }),
    }),

    register: builder.mutation<void, RegisterDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/register',
      }),
    }),

    requestAdminCode: builder.mutation<AdminData, RequestAdminCodeDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/request-admin-code',
      }),
    }),

    requestCode: builder.mutation<void, RequestCodeDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/request-code',
      }),
    }),
  }),
})

export const {
  useConfirmRegistrationMutation,
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useRequestAdminCodeMutation,
  useRequestCodeMutation,
} = authApi
