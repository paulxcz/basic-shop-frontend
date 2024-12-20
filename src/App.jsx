import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";
import ProtectedRoute from "./components/ProtectedRoute";
import ListadoPedidos from "./pages/ListadoPedidos";
import DetallePedido from "./pages/DetallePedido";
import CreateOrder from "./pages/CreateOrder";

const App = () => {
  const { auth } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth.token ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["Encargado", "Vendedor", "Delivery"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["Encargado"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute roles={["Encargado"]}>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute roles={["Encargado", "Vendedor", "Delivery"]}>
              <ListadoPedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/:id"
          element={
            <ProtectedRoute roles={["Encargado", "Vendedor", "Delivery"]}>
              <DetallePedido />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crear-pedido"
          element={
            <ProtectedRoute roles={["Vendedor"]}>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        {/* Agrega otras rutas según sea necesario */}
      </Routes>
    </Router>
  );
};

export default App;
