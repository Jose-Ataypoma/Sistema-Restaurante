import { API_BASE_URL } from './constants'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiClient {
  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return await response.json()
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  static async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return await response.json()
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }
}
