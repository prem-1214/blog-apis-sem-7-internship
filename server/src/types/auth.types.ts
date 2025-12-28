import { UserResponseDTO } from "@/types/user.types";

export interface RegisterInput {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  userName: string;
  email: string;
  password: string;
}

// Auth service response with tokens
export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
