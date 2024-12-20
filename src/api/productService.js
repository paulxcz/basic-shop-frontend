import axiosInstance from "./axiosConfig";

export const getProductos = () => axiosInstance.get("/productos");
export const createProducto = (productoData) =>
  axiosInstance.post("/productos", productoData);
export const updateProducto = (id, productoData) =>
  axiosInstance.put(`/productos/${id}`, productoData);
export const deleteProducto = (id) => axiosInstance.delete(`/productos/${id}`);
export const searchProductos = (criterio) =>
  axiosInstance.get(`/productos/buscar?criterio=${criterio}`);
