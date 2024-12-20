import axiosInstance from "./axiosConfig";

export const getOrders = (numeroPedido) =>
  axiosInstance.post("/pedidos/listar", { NumeroPedido: numeroPedido });

export const getOrderDetails = (id) =>
  axiosInstance.get(`/pedidos/${id}/detalle`);

export const createOrder = (orderData) =>
  axiosInstance.post("/pedidos", orderData);

export const getActiveDeliveries = () =>
  axiosInstance.get("/pedidos/usuarios-delivery-activos");
