export interface IResponse<T> {
  data: T
  message: string
  statusCode: number
}

export interface IPaginatedData<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IUser {
  id: string
  username: string
  email: string
  name: string
  role: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface IPaginationParams {
  page: number
  limit: number
}
