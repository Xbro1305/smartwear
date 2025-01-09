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
      query: id => ({
        method: 'DELETE',
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
  useGetArticleDraftsQuery,
  useGetArticlesQuery,
  useSearchArticleByKeywordQuery,
  useUpdateArticleMutation,
  useUpdateParagraphMutation,
} = articleApi
