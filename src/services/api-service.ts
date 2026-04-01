import axios from '@/lib/axios'
import type { AxiosRequestConfig } from 'axios'

export async function _get(url: string, config?: AxiosRequestConfig) {
  const response = await axios.get(url, config)
  return response.data
}

export async function _post(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await axios.post(url, data, config)
  return response.data
}

export async function _put(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await axios.put(url, data, config)
  return response.data
}

export async function _patch(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await axios.patch(url, data, config)
  return response.data
}

export async function _delete(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await axios.delete(url, { data, ...config })
  return response.data
}
