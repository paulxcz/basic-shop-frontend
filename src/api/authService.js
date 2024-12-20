import axiosInstance from "./axiosConfig";

export const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  // Almacena el token en localStorage al iniciar sesión
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
