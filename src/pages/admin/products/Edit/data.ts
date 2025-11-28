export interface Product {
  id: number
  name: string
  description: string
  price: string
  oldPrice: string
  articul: string
  imageUrl: string | null
  categoryId: number
  quantity: number
  status: boolean
  lengthId: number | null
  createdAt: string
  updatedAt: string
  careRecommendation: string
  cares: { careIcon: { id: number; name: string; url: string } }[]
  sizeTypeId: number
  seoSlug: string
  metaTitle: string
  metaDescription: string
  isPublished: boolean
  isDeliverable: boolean
  category: Category
  features: ProductFeature[]
  attributeValues: ProductAttributeValue[]
  variants: any[]
  colorPrices: any[]
}

export interface Category {
  id: number
  name: string
}

export interface ProductFeature {
  id: number
  productId: number
  featureId: number
  feature: Feature
}

export interface Feature {
  id: number
  name: string
  description: string
}

export interface ProductAttributeValue {
  id: number
  productId: number
  attributeValueId: number
  attributeValue: AttributeValue
}

export interface AttributeValue {
  id: number
  value: string
  attributeId: number
  meta: AttributeMeta
  colorGroupId: number | null
  attribute: Attribute
  colorGroup: any | null
}

export interface AttributeMeta {
  startDate?: string
  seoSlug?: string
  imageUrl?: string
}

export interface Attribute {
  id: number
  name: string
  isSystem: boolean
  orderNum: number
  isFreeValue: boolean
}
