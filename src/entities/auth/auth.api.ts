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
    addAddress: builder.mutation<void, { fullAddress: string; userId: number }>({
      query: ({ fullAddress, userId }) => ({
        body: { fullAddress },
        method: 'POST',
        url: `/users/add-address/${userId}`,
      }),
    }),

    confirmEmail: builder.mutation<void, { code: string; userId: number }>({
      query: ({ code, userId }) => ({
        body: { code },
        method: 'POST',
        url: `/users/confirm-email/${userId}`,
      }),
    }),

    confirmPhoneChange: builder.mutation<void, { code: string; userId: number }>({
      query: ({ code, userId }) => ({
        body: { code },
        method: 'POST',
        url: `/users/confirm-phone-change/${userId}`,
      }),
    }),

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

    removeAddress: builder.mutation<void, { addressId: number }>({
      query: ({ addressId }) => ({
        method: 'DELETE',
        url: `/users/remove-address/${addressId}`,
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

    requestEmailConfirmation: builder.mutation<void, { userId: number }>({
      query: ({ userId }) => ({
        method: 'POST',
        url: `/users/confirm-email-request/${userId}`,
      }),
    }),

    requestPhoneChange: builder.mutation<void, { newPhone: string; userId: number }>({
      query: ({ newPhone, userId }) => ({
        body: { newPhone },
        method: 'POST',
        url: `/users/confirm-phone-change/${userId}`,
      }),
    }),

    setDefaultAddress: builder.mutation<void, { addressId: number }>({
      query: ({ addressId }) => ({
        method: 'POST',
        url: `/users/set-default-address/${addressId}`,
      }),
    }),
  }),
})

export const {
  useAddAddressMutation,
  useConfirmEmailMutation,
  useConfirmPhoneChangeMutation,
  useConfirmRegistrationMutation,
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useRemoveAddressMutation,
  useRequestAdminCodeMutation,
  useRequestCodeMutation,
  useRequestEmailConfirmationMutation,
  useRequestPhoneChangeMutation,
  useSetDefaultAddressMutation,
} = authApi
