import axiosInstance from "./axiosConfig";

export const getUsuarios = () => axiosInstance.get("/usuarios");
export const createUsuario = (usuarioData) =>
  axiosInstance.post("/usuarios", usuarioData);
export const updateUsuario = (id, usuarioData) =>
  axiosInstance.put(`/usuarios/${id}`, usuarioData);
export const deleteUsuario = (id) => axiosInstance.delete(`/usuarios/${id}`);
