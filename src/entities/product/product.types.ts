export type ProductDto = {
  brand?: string
  category: string
  color?: string
  createdAt: string
  discount?: number
  id: number
  imageUrl?: string
  insulation?: string
  name: string
  price: number
  season?: string
  size?: string
  storeIds?: number[]
  updatedAt: string
}

export type GetAllProductsDto = {
  brand?: string
  category?: string
  color?: string
  discount?: boolean
  priceMax?: number
  priceMin?: number
  season?: string
  sizeMax?: number
  sizeMin?: number
}

export type CreateProductDto = {
  brand?: string
  category: string
  color?: string
  discount?: number
  imageUrl?: string
  insulation?: string
  name: string
  price: number
  season?: string
  size?: string
  storeIds?: number[]
}
