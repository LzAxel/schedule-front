export interface User {
  username: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

export class AuthService {
  private static TOKEN_KEY = "auth_token"

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: token } : {}
  }
}
