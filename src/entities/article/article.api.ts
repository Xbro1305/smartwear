import { baseApi } from '@/shared/api'

import {
  ArticleDto,
  CreateArticleDto,
  CreateParagraphDto,
  ParagraphDto,
  UpdateArticleDto,
  UpdateParagraphDto,
} from './article.types'

export const articleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createArticle: builder.mutation<ArticleDto, CreateArticleDto>({
      invalidatesTags: ['Articles'],
      query: body => ({
        body,
        method: 'POST',
        url: '/articles',
      }),
    }),

    createParagraph: builder.mutation<ParagraphDto, CreateParagraphDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/paragraphs',
      }),
    }),

    deleteArticle: builder.mutation<any, number>({
      invalidatesTags: ['Articles'],
      query: id => ({
        method: 'DELETE',
        url: `/articles/delete/${id}`,
      }),
    }),
    deleteParagraph: builder.mutation<any, { articleId: number; order: number }>({
      query: ({ articleId, order }) => ({
        method: 'DELETE',
        url: `/paragraphs/delete/${articleId}/${order}`,
      }),
    }),

    getArticleById: builder.query<ArticleDto | null, number>({
      query: id => ({
        method: 'GET',
        url: `/articles/${id}`,
      }),
    }),

    getArticleDrafts: builder.query<ArticleDto[], void>({
      query: () => ({
        method: 'GET',
        url: '/articles/drafts',
      }),
    }),

    getArticles: builder.query<ArticleDto[], void>({
      providesTags: ['Articles'],
      query: () => ({
        method: 'GET',
        url: '/articles',
      }),
    }),

    searchArticleByKeyword: builder.query<ArticleDto | null, string>({
      query: keyword => ({
        method: 'GET',
        url: `/articles/search/${keyword}`,
      }),
    }),

    updateArticle: builder.mutation<any, { data: UpdateArticleDto; id: number }>({
      invalidatesTags: ['Articles'],
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `/articles/${id}`,
      }),
    }),

    updateParagraph: builder.mutation<any, { data: UpdateParagraphDto; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `/paragraphs/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateArticleMutation,
  useCreateParagraphMutation,
  useDeleteArticleMutation,
  useDeleteParagraphMutation,
  useGetArticleByIdQuery,
  useGetArticleDraftsQuery,
  useGetArticlesQuery,
  useSearchArticleByKeywordQuery,
  useUpdateArticleMutation,
  useUpdateParagraphMutation,
} = articleApi
