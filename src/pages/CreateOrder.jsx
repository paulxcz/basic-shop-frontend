import React, { useState, useEffect } from "react";
import { usePedidos } from "../context/PedidoContext";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateOrder = () => {
  const { auth } = useAuth();
  const { createOrder, activeDeliveries, fetchActiveDeliveries } = usePedidos();
  const navigate = useNavigate();

  const [product, setProduct] = useState({ productoId: "", cantidad: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Solo permitir acceso al rol "Vendedor"
  if (!auth.user || auth.user.rol !== "Vendedor") {
    return (
      <Alert variant="danger">
        Acceso denegado. Solo los vendedores pueden registrar pedidos.
      </Alert>
    );
  }

  // Cargar los deliveries activos al montar el componente
  useEffect(() => {
    fetchActiveDeliveries();
  }, [fetchActiveDeliveries]);

  // Validación del formulario usando Yup y Formik
  const validationSchema = Yup.object({
    numeroPedido: Yup.string().required("Número de pedido es requerido"),
    fechaPedido: Yup.date().required("Fecha de pedido es requerida"),
    deliveryId: Yup.number().required("ID de Delivery es requerido"),
    estado: Yup.string().required("Estado es requerido"),
  });

  // Manejar cambios en los campos del formulario de producto
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Agregar producto al pedido
  const handleAddProduct = (setFieldValue, productos) => {
    if (product.productoId && product.cantidad) {
      setFieldValue("productos", [...productos, product]);
      setProduct({ productoId: "", cantidad: "" });
    }
  };

  // Enviar el pedido
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const orderData = {
      ...values,
      vendedorId: auth.user.id, // Agrega el ID del usuario logueado como vendedor
      estado: parseInt(values.estado), // Asegurarse de que el estado sea un número
      productos: values.productos.map((prod) => ({
        productoId: parseInt(prod.productoId),
        cantidad: parseInt(prod.cantidad),
      })),
    };

    try {
      await createOrder(orderData);
      setMessage("Pedido creado exitosamente.");
      setMessageType("success");
      resetForm();
    } catch (error) {
      setMessage("Error al crear el pedido.");
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
        Volver
      </Button>
      <h2>Registrar Nuevo Pedido</h2>
      {message && <Alert variant={messageType}>{message}</Alert>}

      <Formik
        initialValues={{
          numeroPedido: "",
          fechaPedido: "",
          deliveryId: "",
          estado: "",
          productos: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="numeroPedido">
                  <Form.Label>Número de Pedido</Form.Label>
                  <Field name="numeroPedido" className="form-control" />
                  <ErrorMessage
                    name="numeroPedido"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="fechaPedido">
                  <Form.Label>Fecha de Pedido</Form.Label>
                  <Field
                    name="fechaPedido"
                    type="date"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="fechaPedido"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="deliveryId">
                  <Form.Label>ID de Delivery</Form.Label>
                  <Field as="select" name="deliveryId" className="form-control">
                    <option value="">Seleccionar Delivery</option>
                    {activeDeliveries.map((delivery) => (
                      <option key={delivery.id} value={delivery.id}>
                        {`${delivery.nombre} - ${delivery.codigoTrabajador}`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="deliveryId"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Field as="select" name="estado" className="form-control">
                    <option value="">Seleccionar Estado</option>
                    <option value="0">Por Atender</option>
                    <option value="1">En Proceso</option>
                    <option value="2">Entregado</option>
                  </Field>
                  <ErrorMessage
                    name="estado"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4>Agregar Producto</h4>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="productoId">
                  <Form.Label>ID de Producto</Form.Label>
                  <Form.Control
                    type="text"
                    name="productoId"
                    value={product.productoId}
                    onChange={handleProductChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="cantidad">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="cantidad"
                    value={product.cantidad}
                    onChange={handleProductChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  onClick={() =>
                    handleAddProduct(setFieldValue, values.productos)
                  }
                  className="w-100"
                >
                  Agregar
                </Button>
              </Col>
            </Row>

            <Button
              type="submit"
              variant="success"
              className="w-100 mt-4"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Registrar Pedido"
              )}
            </Button>

            <h4 className="mt-5">Productos en el Pedido</h4>
            {values.productos.length > 0 ? (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>ID de Producto</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {values.productos.map((prod, index) => (
                    <tr key={index}>
                      <td>{prod.productoId}</td>
                      <td>{prod.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">
                No hay productos agregados al pedido.
              </p>
            )}
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default CreateOrder;
