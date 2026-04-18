import userApi from "./userApi";

export interface RegisterDto {
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface GoogleLoginDto {
  token: string;
}

export interface UpdateProfileDto {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
}

// ================= REGISTER =================
export const registerUser = async (data: RegisterDto) => {
  const res = await userApi.post("/user/auth/register", data);
  return res.data;
};

// ================= LOGIN =================
export const loginUser = async (data: LoginDto): Promise<AuthResponse> => {
  const res = await userApi.post("/user/auth/login", data);
  const result = res.data;

  localStorage.setItem("user_token", result.access_token);
  localStorage.setItem("user_refresh_token", result.refresh_token);
  localStorage.setItem("user_data", JSON.stringify(result.user));

  return result;
};

// ================= LOGOUT =================
export const logoutUser = async () => {
  try {
    await userApi.post("/user/auth/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_refresh_token");
    localStorage.removeItem("user_data");
  }
};

// ================= GOOGLE LOGIN =================
export const googleLoginUser = async (data: GoogleLoginDto): Promise<AuthResponse> => {
  const res = await userApi.post("/user/auth/google", data);
  const result = res.data;

  localStorage.setItem("user_token", result.access_token);
  localStorage.setItem("user_refresh_token", result.refresh_token);
  localStorage.setItem("user_data", JSON.stringify(result.user));

  return result;
};

// ================= GET PROFILE =================
export const getUserProfile = async () => {
  const res = await userApi.get("/user/auth/profile");
  return res.data;
};

// ================= UPDATE PROFILE =================
export const updateUserProfile = async (data: UpdateProfileDto) => {
  const res = await userApi.put("/user/auth/profile", data);
  
  const currentUserData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const updatedData = { ...currentUserData, ...res.data };
  localStorage.setItem("user_data", JSON.stringify(updatedData));
  
  return res.data;
};