
export interface LoginResponse {
    token: string
    user: {
        id: string
        email: string
        name: string | null
    }
}

export interface RegisterResponse {
    token: string
    user: {
        id: string
        email: string
        name: string | null
    }
}