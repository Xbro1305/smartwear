import { baseApi } from '@/shared/api'

export const imageApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getImage: builder.query<Blob, { id: string; type: string }>({
      query: ({ id, type }) => ({
        method: 'GET',
        responseHandler: async response => {
          const blob = await response.blob()

          return blob
        },
        url: `/images/${type}/${id}`,
      }),
    }),

    getParagraphsImages: builder.query<Blob[], { articleId: string }>({
      query: ({ articleId }) => ({
        method: 'GET',
        responseHandler: async response => {
          const blob = await response.blob()

          return blob
        },
        url: `/images/article/${articleId}/paragraphs`,
      }),
    }),
    uploadArticleImage: builder.mutation<
      { imagePath: string; message: string },
      { file: File; id: number }
    >({
      query: ({ file, id }) => {
        const formData = new FormData()

        formData.append('file', file)

        return {
          body: formData,
          method: 'POST',
          url: `/images/upload-article/${id}`,
        }
      },
    }),

    uploadParagraphImage: builder.mutation<
      { imagePath: string; message: string },
      { articleId: number; file: File; title: string }
    >({
      query: ({ articleId, file, title }) => {
        const formData = new FormData()

        formData.append('file', file)

        return {
          body: formData,
          method: 'POST',
          url: `/images/upload-paragraph/${articleId}/${title}`,
        }
      },
    }),
  }),
})

export const {
  useGetImageQuery,
  useGetParagraphsImagesQuery,
  useUploadArticleImageMutation,
  useUploadParagraphImageMutation,
} = imageApi
