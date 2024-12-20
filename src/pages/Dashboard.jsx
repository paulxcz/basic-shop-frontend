import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const { auth, logout } = useAuth();
  const userRole = auth.user?.rol;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirecciona a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h2>Bienvenido, {auth.user?.nombre}</h2>
                <Button variant="danger" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
              <p className="text-center text-muted">Rol: {userRole}</p>
              <hr />

              <Row className="mt-4">
                {userRole === "Encargado" && (
                  <>
                    <Col md={6} className="mb-3">
                      <Link to="/usuarios">
                        <Button variant="primary" className="w-100">
                          Gestión de Usuarios
                        </Button>
                      </Link>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Link to="/productos">
                        <Button variant="primary" className="w-100">
                          Gestión de Productos
                        </Button>
                      </Link>
                    </Col>
                  </>
                )}
                {userRole === "Vendedor" && (
                  <Col md={12} className="mb-3">
                    <Link to="/crear-pedido">
                      <Button variant="primary" className="w-100">
                        Registro de Pedidos
                      </Button>
                    </Link>
                  </Col>
                )}
                <Col md={12} className="mb-3">
                  <Link to="/pedidos">
                    <Button variant="secondary" className="w-100">
                      Listado de Pedidos
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
