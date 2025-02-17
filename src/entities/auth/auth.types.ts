export type RegisterDto = {
  email: string
  isSubscribed: boolean
  middleName: string
  name: string
  phone: string
  surName: string
}

export type RegisteredDto = {
  addresses: {
    city: string
    fullAddress: string
    id: number
    isDefault: boolean
  }[]
  birthday: string
  createdAt: string
  defaultAddress?: {
    city: string
    fullAddress: string
    id: number
  }
  email: string
  gender: string
  id: number
  isApproved: boolean
  isEmailConfirmed: boolean
  isPhoneConfirmed: boolean
  isSubscribed: boolean
  middleName: string
  name: string
  notifications: boolean
  phone: string
  role: string
  surName: string
}
export type ConfirmCodeDto = {
  code: string
  phone: string
}

export type AdminData = {
  phone: string
}

export type RequestCodeDto = {
  phone: string
}

export type RequestAdminCodeDto = {
  email: string
  password: string
}

export type LoginDto = {
  code: string
}
