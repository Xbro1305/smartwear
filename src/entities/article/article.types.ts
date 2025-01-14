export enum Section {
  NEWS = 'NEWS',
  SEO = 'SEO',
  USER = 'USER',
}

export const sectionMapping = {
  [Section.NEWS]: 'Новости',
  [Section.SEO]: 'Seo',
  [Section.USER]: 'Пользовательские',
}

export enum Composition {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type ArticleDto = {
  keyword: string
  composition: Composition
  description: string
  id: number
  imageUrl?: string
  metaDescription: string
  metaTitle: string
  paragraphs: ParagraphDto[]
  section: Section
  title: string
  userId: number
}

export type CreateArticleDto = {
  composition: Composition
  description: string
  draft: boolean
  keyword?: string
  metaDescription: string
  metaTitle: string
  paragraphs: CreateParagraphinArticleDto[]
  section: Section
  title: string
  userId: number
}

export type UpdateArticleDto = {
  composition?: Composition
  description?: string
  imageUrl?: string
  metaDescription?: string
  metaTitle?: string
  section?: Section
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

export type CreateParagraphinArticleDto = {
  content: string
  imageFile?: File
  order: number
  title: string
}

export type ParagraphinArticleDto = {
  content: string
  id: number
  imageFile?: File
  order: number
  title: string
}

export type UpdateParagraphDto = {
  content?: string
  imageUrl?: string
  order?: number
  title?: string
}

export type SectionDto = {
  articles: Array<{
    draft?: boolean
    id: number
    title: string
    keyword: string
  }>
  category: string
}
