import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import * as productService from "../api/productService";
import { encryptData } from "../utils/encryption";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [formInitialValues, setFormInitialValues] = useState({
    sku: "",
    nombre: "",
    tipo: "",
    etiqueta: "",
    precio: "",
    unidadStock: "",
  });

  const fetchProductos = async (criterio = "") => {
    setLoading(true);
    try {
      const response = criterio
        ? await productService.searchProductos(criterio)
        : await productService.getProductos();
      setProductos(response.data);
    } catch (error) {
      alert("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSearch = () => {
    fetchProductos(searchTerm);
  };

  const initialValues = {
    sku: "",
    nombre: "",
    tipo: "",
    etiqueta: "",
    precio: "",
    unidadStock: "",
  };

  const validationSchema = Yup.object({
    sku: Yup.string().required("Requerido"),
    nombre: Yup.string().required("Requerido"),
    tipo: Yup.string().required("Requerido"),
    etiqueta: Yup.string(),
    precio: Yup.number().required("Requerido").positive("Debe ser positivo"),
    unidadStock: Yup.number()
      .required("Requerido")
      .integer("Debe ser un número entero")
      .positive("Debe ser positivo"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    try {
      if (editing) {
        await productService.updateProducto(editing, values);
        alert("Producto actualizado exitosamente");
      } else {
        await productService.createProducto(values);
        alert("Producto creado exitosamente");
      }
      fetchProductos();
      resetForm();
      setEditing(null);
    } catch (error) {
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setEditing(producto.id);
    setFormInitialValues({
      sku: producto.sku,
      nombre: producto.nombre,
      tipo: producto.tipo,
      etiqueta: producto.etiqueta,
      precio: producto.precio,
      unidadStock: producto.unidadStock,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await productService.deleteProducto(id);
      alert("Producto eliminado exitosamente");
      fetchProductos();
    } catch (error) {
      alert("Error al eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Gestión de Productos</h2>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <InputGroup className="w-50">
          <FormControl
            placeholder="Buscar producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Buscar
          </Button>
        </InputGroup>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {() => (
              <Form className="mb-4">
                <Row>
                  <Col md={4}>
                    <label>SKU</label>
                    <Field
                      type="text"
                      name="sku"
                      className="form-control"
                      placeholder="SKU"
                    />
                    <ErrorMessage
                      name="sku"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Nombre</label>
                    <Field
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Nombre"
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Tipo</label>
                    <Field
                      type="text"
                      name="tipo"
                      className="form-control"
                      placeholder="Tipo"
                    />
                    <ErrorMessage
                      name="tipo"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Etiqueta</label>
                    <Field
                      type="text"
                      name="etiqueta"
                      className="form-control"
                      placeholder="Etiqueta"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Precio</label>
                    <Field
                      type="number"
                      name="precio"
                      className="form-control"
                      placeholder="Precio"
                    />
                    <ErrorMessage
                      name="precio"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Unidad de Stock</label>
                    <Field
                      type="number"
                      name="unidadStock"
                      className="form-control"
                      placeholder="Unidad de Stock"
                    />
                    <ErrorMessage
                      name="unidadStock"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-center mt-3">
                  <Button type="submit" variant="primary">
                    {editing ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <Table striped bordered hover responsive className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Etiqueta</th>
                <th>Precio</th>
                <th>Unidad de Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.sku}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.tipo}</td>
                  <td>{producto.etiqueta}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.unidadStock}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(producto)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(producto.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default Productos;
