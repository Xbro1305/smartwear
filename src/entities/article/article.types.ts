export type ArticleDto = {
  composition: string
  description: string
  id: number
  metaDescription: string
  metaTitle: string
  paragraphs: ParagraphDto[]
  section: string
  title: string
  userId: number
}

export type CreateArticleDto = {
  composition: string
  description: string
  metaDescription: string
  metaTitle: string
  paragraphs: CreateParagraphDto[]
  section: string
  title: string
  userId: number
}

export type UpdateArticleDto = {
  composition?: string
  description?: string
  imageUrl?: string
  metaDescription?: string
  metaTitle?: string
  section?: string
  title?: string
}

export type ParagraphDto = {
  articleId: number
  content: string
  id: number
  imageUrl?: string
  isDeleted?: boolean
  order: number
  title: string
}

export type CreateParagraphDto = {
  articleId: number
  content: string
  imageUrl?: string
  isDeleted?: boolean
  order: number
  title: string
}

export type UpdateParagraphDto = {
  content?: string
  imageUrl?: string
  order?: number
  title?: string
}
