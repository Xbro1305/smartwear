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

    getParagraphsImages: builder.query<string[], { articleId: string }>({
      query: ({ articleId }) => ({
        method: 'GET',
        url: `/images/article/${articleId}/paragraphs`, // новый путь для получения всех изображений параграфов
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
      { file: File; paragraphId: string }
    >({
      query: ({ file, paragraphId }) => {
        const formData = new FormData()

        formData.append('file', file)

        return {
          body: formData,
          method: 'POST',
          url: `/images/upload-paragraph/${paragraphId}`,
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
