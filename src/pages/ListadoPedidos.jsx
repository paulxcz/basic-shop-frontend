import { useState, useEffect } from "react";
import { usePedidos } from "../context/PedidoContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  InputGroup,
  FormControl,
  Spinner,
} from "react-bootstrap";
import { format } from "date-fns";

const ListadoPedidos = () => {
  const { orders, fetchOrders } = usePedidos();
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPedidos = async () => {
      setLoading(true);
      await fetchOrders(); // Obtener todos los pedidos al cargar
      setLoading(false);
    };
    loadPedidos();
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    await fetchOrders(search);
    setSearching(false);
  };

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

  const filteredPedidos = orders.filter((pedido) => {
    if (auth.user.rol === "Delivery" && pedido.deliveryId !== auth.user.id) {
      return false;
    }
    if (search && !pedido.numeroPedido.includes(search)) {
      return false;
    }
    return true;
  });

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Listado de Pedidos</h2>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Volver
        </Button>
        <InputGroup className="w-50">
          <FormControl
            placeholder="Buscar por Nro. de pedido"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch} disabled={searching}>
            {searching ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Buscar"
            )}
          </Button>
        </InputGroup>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive className="table">
          <thead>
            <tr>
              <th>Nro. Pedido</th>
              <th>Fecha Pedido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.numeroPedido}</td>
                <td>
                  {format(new Date(pedido.fechaPedido), "dd/MM/yyyy")}
                </td>{" "}
                {/* Formato de fecha */}
                <td>{getEstadoText(pedido.estado)}</td> {/* Texto del estado */}
                <td>
                  <Link to={`/pedidos/${pedido.id}`} className="btn btn-link">
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ListadoPedidos;
