import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedidos } from "../context/PedidoContext";
import {
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Button,
  Alert,
} from "react-bootstrap";
import { format } from "date-fns";

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderDetails, fetchOrderDetails } = usePedidos();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPedido = async () => {
      setLoading(true);
      setError(""); // Resetear el error antes de cargar

      try {
        await fetchOrderDetails(id);
        setLoading(false); // Terminar el loading si la petición es exitosa
      } catch (err) {
        setError("No tienes permiso para ver este pedido o ocurrió un error.");
        setLoading(false); // Asegurarse de que loading se desactive en caso de error
      }
    };
    loadPedido();
  }, [id]); // Solo depender de 'id' para evitar bucles infinitos

  const getEstadoText = (estado) => {
    switch (estado) {
      case 0:
        return "Por Atender";
      case 1:
        return "En Proceso";
      case 2:
        return "Entregado";
      default:
        return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert
          variant="danger"
          onClose={() => navigate("/pedidos")}
          dismissible
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!orderDetails) return <p>No se encontraron detalles para este pedido.</p>;

  // Calcula el precio total del pedido
  const totalPrecio = orderDetails.productos.reduce(
    (acc, producto) => acc + producto.cantidad * producto.precioProducto,
    0
  );

  return (
    <Container className="mt-4">
      <Button
        variant="secondary"
        onClick={() => navigate("/pedidos")}
        className="mb-4"
      >
        Volver
      </Button>
      <h2>Detalle del Pedido {orderDetails.numeroPedido}</h2>

      <Row className="mb-4">
        <Col md={4}>
          <strong>Fecha de Pedido:</strong>{" "}
          {format(new Date(orderDetails.fechaPedido), "dd/MM/yyyy")}
        </Col>
        <Col md={4}>
          <strong>Fecha de Despacho:</strong>{" "}
          {orderDetails.fechaDespacho
            ? format(new Date(orderDetails.fechaDespacho), "dd/MM/yyyy")
            : "Pendiente"}
        </Col>
        <Col md={4}>
          <strong>Fecha de Entrega:</strong>{" "}
          {orderDetails.fechaEntrega
            ? format(new Date(orderDetails.fechaEntrega), "dd/MM/yyyy")
            : "Pendiente"}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <strong>Estado:</strong> {getEstadoText(orderDetails.estado)}
        </Col>
      </Row>

      <h3>Productos</h3>
      <Table striped bordered hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.productos.map((producto) => (
            <tr key={producto.productoId}>
              <td>{producto.nombreProducto}</td>
              <td>{producto.cantidad}</td>
              <td>${producto.precioProducto.toFixed(2)}</td>
              <td>
                ${(producto.cantidad * producto.precioProducto).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-end">
              <strong>Total:</strong>
            </td>
            <td>
              <strong>${totalPrecio.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default DetallePedido;
