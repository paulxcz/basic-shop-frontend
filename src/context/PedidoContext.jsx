import React, { createContext, useContext, useState } from "react";
import * as pedidoService from "../api/pedidoService";

const PedidoContext = createContext();

export const usePedidos = () => {
  return useContext(PedidoContext);
};

export const PedidoProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeDeliveries, setActiveDeliveries] = useState([]);

  const fetchOrders = async (numeroPedido) => {
    try {
      const response = await pedidoService.getOrders(numeroPedido);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await pedidoService.getOrderDetails(id);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchActiveDeliveries = async () => {
    try {
      const response = await pedidoService.getActiveDeliveries();
      setActiveDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching active deliveries:", error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await pedidoService.createOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, response.data]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <PedidoContext.Provider
      value={{
        orders,
        orderDetails,
        activeDeliveries,
        fetchOrders,
        fetchOrderDetails,
        createOrder,
        fetchActiveDeliveries,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
