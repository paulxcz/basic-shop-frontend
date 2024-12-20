import axiosInstance from "./axiosConfig";

export const getPedidos = () => axiosInstance.get("/pedidos");
export const getPedidoDetalle = (id) =>
  axiosInstance.get(`/pedidos/${id}/detalle`);
export const createPedido = (pedidoData) =>
  axiosInstance.post("/pedidos", pedidoData);
export const updatePedidoEstado = (id, estadoData) =>
  axiosInstance.put(`/pedidos/${id}/estado`, estadoData);
export const deletePedido = (id) => axiosInstance.delete(`/pedidos/${id}`);
