import api from "./api";

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
  };
}

export const login = async (
  data: LoginDto
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  const result = response.data;

  localStorage.setItem("token", result.access_token);

  localStorage.setItem("user", JSON.stringify(result.user));

  return result;
};

export const logout = () => {
  localStorage.clear(); 
};
