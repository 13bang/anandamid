import api from "./api";

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const login = async (
  data: LoginDto
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  const result = response.data;

  localStorage.setItem("access_token", result.access_token);

  return result;
};
