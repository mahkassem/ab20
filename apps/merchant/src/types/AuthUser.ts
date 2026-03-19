export interface UserData {
  id: number;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}
