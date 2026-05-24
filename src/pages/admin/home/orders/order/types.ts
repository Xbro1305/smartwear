export type AdminOrderStatus = 'NEW' | string
export type AdminOrderAdminStatus = 'NEW_ORDERS' | string
export type PaymentType = 'OFFLINE' | 'ONLINE' | string
export type AddressType = 'PVZ' | 'DELIVERY' | string
export type DeliveryStatus = 'NOT_DELIVERED' | 'DELIVERED' | string
export type UserRole = 'ADMIN' | 'USER' | string
export type Gender = 'male' | 'female' | string

export type AdminOrder = {
  promoCode: any
  statusHistory: never[]
  id: number
  orderNumber: string
  orderGroup: string
  userId: number
  addressId: number
  status: AdminOrderStatus
  adminStatus: AdminOrderAdminStatus
  totalAmount: string
  promoCodeId: number | null
  paymentType: PaymentType
  deliveryFrom: string
  deliveryTo: string
  comment: string | null
  storeId: number | null
  moyskladId: string | null
  moyskladHref: string | null
  moyskladStatus: string | null
  trackingNumber: string | null
  trackingUpdatedAt: string | null
  shipmentNotifiedAt: string | null
  invoiceNumber: string | null
  createdAt: string
  updatedAt: string
  user: AdminOrderUser
  address: AdminOrderAddress
  items: AdminOrderItem[]
  trackingUrl: string | null
}

export type AdminOrderUser = {
  id: number
  email: string
  name: string
  middleName: string | null
  surName: string
  phone: string
  password: string
  role: UserRole
  isApproved: boolean
  isEmailConfirmed: boolean
  isPhoneConfirmed: boolean
  isSubscribed: boolean
  notifications: boolean
  gender: Gender | null
  birthday: string | null
  createdAt: string
}

export type AdminOrderAddress = {
  id: number
  userId: number
  fullAddress: string
  longitude: string | null
  latitude: string | null
  city: string
  isDefault: boolean
  type: AddressType
  apartment: string | null
  floor: string | null
  entrance: string | null
  intercom: string | null
  comment: string | null
}

export type AdminOrderItem = {
  storeAddress: string
  storeId: string
  trackingNumber: string | null
  id: number
  orderId: number
  variantId: number
  quantity: number
  price: string
  colorAlias: string | null
  markingCode: string | null
  deliveryStatus: DeliveryStatus
  createdAt: string
  variant: AdminOrderVariant
}

export type AdminOrderVariant = {
  id: number
  productId: number
  colorAttrValueId: number
  sizeValueId: number
  createdAt: string
  colorAlias: string | null
  product: AdminOrderProduct
  sizeValue: AdminOrderSizeValue
  colorAttrValue: AdminOrderColorAttrValue
}

export type AdminOrderProduct = {
  id: number
  name: string
  description: string | null
  price: string
  oldPrice: string | null
  articul: string
  imageUrl: string | null
  categoryId: number
  quantity: number
  status: boolean
  lengthId: number | null
  createdAt: string
  updatedAt: string
  careRecommendation: string | null
  sizeTypeId: number | null
  lengthValue: number | null
  seoSlug: string | null
  metaTitle: string | null
  metaDescription: string | null
  isPublished: boolean
  isDeliverable: boolean
  media: AdminOrderProductMedia[]
}

export type AdminOrderProductMedia = {
  colorAttrValueId: number | null
  createdAt: string
  id: number
  kind: 'photo' | 'video' | 'cover' | 'lining'
  productId: number
  url: string
}

export type AdminOrderSizeValue = {
  id: number
  typeId: number
  name: string
  orderNum: number
}

export type AdminOrderColorAttrValue = {
  id: number
  value: string
  attributeId: number
  meta: {
    aliases: string[]
    colorCode: string
  }
  colorGroupId: number | null
}
