import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import * as userService from "../api/userService";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../utils/encryption";
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    codigoTrabajador: "",
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    estado: "0",
    password: "",
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      alert("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const validationSchema = Yup.object({
    codigoTrabajador: Yup.string().required("Requerido"),
    nombre: Yup.string().required("Requerido"),
    email: Yup.string().email("Email inválido").required("Requerido"),
    telefono: Yup.string(),
    rol: Yup.string().required("Requerido"),
    estado: Yup.string(),
    password: Yup.string().required("Requerido"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    const formattedValues = {
      ...values,
      rol: parseInt(values.rol),
      estado: parseInt(values.estado),
      puesto:
        values.rol === "0"
          ? "Encargado"
          : values.rol === "1"
          ? "Vendedor"
          : "Delivery",
    };

    try {
      if (editing) {
        await userService.updateUsuario(editing, formattedValues);
        alert("Usuario actualizado exitosamente");
      } else {
        await userService.createUsuario(formattedValues);
        alert("Usuario creado exitosamente");
      }
      await fetchUsuarios();
      resetForm();
      setEditing(null);
      setInitialValues({
        codigoTrabajador: "",
        nombre: "",
        email: "",
        telefono: "",
        rol: "",
        estado: "0",
        password: "",
      });
    } catch (error) {
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditing(usuario.id);
    setInitialValues({
      codigoTrabajador: usuario.codigoTrabajador,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol.toString(),
      estado: usuario.estado.toString(),
      password: "", // Deja vacío para que el usuario reingrese la contraseña si es necesario
    });
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await userService.deleteUsuario(id);
      alert("Usuario eliminado exitosamente");
      await fetchUsuarios();
    } catch (error) {
      alert("Error al eliminar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>
      <div className="d-flex justify-content-start mb-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {() => (
              <Form className="mb-4">
                <Row>
                  <Col md={4}>
                    <label>Código de Trabajador</label>
                    <Field
                      type="text"
                      name="codigoTrabajador"
                      className="form-control"
                      placeholder="Código de Trabajador"
                    />
                    <ErrorMessage
                      name="codigoTrabajador"
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
                    <label>Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Teléfono</label>
                    <Field
                      type="text"
                      name="telefono"
                      className="form-control"
                      placeholder="Teléfono"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Rol</label>
                    <Field as="select" name="rol" className="form-control">
                      <option value="">Seleccionar Rol</option>
                      <option value="0">Encargado</option>
                      <option value="1">Vendedor</option>
                      <option value="3">Delivery</option>
                    </Field>
                    <ErrorMessage
                      name="rol"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={4}>
                    <label>Estado</label>
                    <Field as="select" name="estado" className="form-control">
                      <option value="0">Activo</option>
                      <option value="1">Inactivo</option>
                    </Field>
                  </Col>
                  <Col md={4}>
                    <label>Contraseña</label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Contraseña"
                    />
                    <ErrorMessage
                      name="password"
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
                <th>Código Trabajador</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.codigoTrabajador}</td>
                  <td>{encryptData(usuario.nombre)}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    {usuario.rol === 0
                      ? "Encargado"
                      : usuario.rol === 1
                      ? "Vendedor"
                      : "Delivery"}
                  </td>
                  <td>{usuario.estado === 0 ? "Activo" : "Inactivo"}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(usuario)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(usuario.id)}
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

export default Usuarios;
