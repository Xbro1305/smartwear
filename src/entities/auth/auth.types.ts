export type RegisterDto = {
  email: string
  isSubscribed: boolean
  middleName: string
  name: string
  phone: string
  surName: string
}

export type RegisteredDto = {
  createdAt: string
  id: number
  isApproved: boolean
  role: string
} & RegisterDto
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
