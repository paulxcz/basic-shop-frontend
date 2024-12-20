import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PedidoProvider } from "./context/PedidoContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PedidoProvider>
      <App />
    </PedidoProvider>
  </AuthProvider>
);
