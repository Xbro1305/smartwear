import { baseApi } from '@/shared/api'

import { CreateProductDto, GetAllProductsDto, ProductDto } from './product.types'

export const productApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createProduct: builder.mutation<ProductDto, CreateProductDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/products',
      }),
    }),

    getProductById: builder.query<ProductDto, number>({
      query: id => ({
        method: 'GET',
        url: `/products/${id}`,
      }),
    }),

    getProducts: builder.query<ProductDto[], GetAllProductsDto>({
      query: params => ({
        method: 'GET',
        params,
        url: '/products',
      }),
    }),
  }),
})

export const { useCreateProductMutation, useGetProductByIdQuery, useGetProductsQuery } = productApi
