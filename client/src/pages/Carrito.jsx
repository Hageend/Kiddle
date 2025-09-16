import React, { useId, useState, useEffect } from 'react';
import "../css/Carrito.css";
import Direccion from "./Direccion";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [cantidades] = useState({});
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [direccionGuardada, setDireccionGuardada] = useState(null);

  const Id = useId();
  const [formData, setFormData] = useState({
    calle: '',
    numeroIn: '',
    numeroEx: '',
    colonia: '',
    estado: '',
    codigoPostal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [alertas, setAlertas] = React.useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errores = {};
    if (formData.calle && !/^[a-zA-Z0-9\s]{2,50}$/.test(formData.calle)) {
      errores.calle = "La calle debe tener entre 2 y 50 caracteres.";
    }
    if (formData.numeroIn && !/^[0-9]{1,5}$/.test(formData.numeroIn)) {
      errores.numeroIn = "El número interior debe ser numérico (máx 5 dígitos).";
    }
    if (formData.numeroEx && !/^[0-9]{1,5}$/.test(formData.numeroEx)) {
      errores.numeroEx = "El número exterior debe ser numérico (máx 5 dígitos).";
    }
    if (formData.colonia && !/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.colonia)) {
      errores.colonia = "La colonia debe contener solo letras (2 a 40 caracteres).";
    }
    if (formData.estado && !/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.estado)) {
      errores.estado = "El estado debe contener solo letras (2 a 40 caracteres).";
    }
    if (formData.codigoPostal && !/^[0-9]{5}$/.test(formData.codigoPostal)) {
      errores.codigoPostal = "El código postal debe tener 5 números.";
    }

    if (Object.keys(errores).length > 0) {
      setAlertas(errores);
      return;
    }
    setAlertas({});

    try {
      const response = await api.post("/direccion", {
        id_usuario: 1,
        calle: formData.calle,
        numero_exterior: formData.numeroEx,
        numero_interior: formData.numeroIn,
        colonia: formData.colonia,
        codigo_postal: formData.codigoPostal,
        estado: formData.estado
      });
      console.log("Dirección guardada:", response.data);
      setDireccionGuardada(response.data);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error guardando dirección:", error);
      alert("No se pudo guardar la dirección");
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos");
        const productosConCantidad = response.data.map((p) => ({
          ...p,
          cantidad: 1
        }));
        setProductos(productosConCantidad);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const response = await api.get("/direccion");
        const dire = response.data.map((p) => ({
          ...p,
        }));
        setDireccionGuardada(dire[0]); // solo la primera dirección si hay varias
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDireccion();
  }, []);

  const incrementar = (id_producto) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id_producto === id_producto ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const decrementar = (id_producto) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id_producto === id_producto && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );
  };

  const eliminar = (id) => {
    setProductos((prev) => prev.filter((p) => p.id_producto !== id));
  };

  //const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // ✅ Agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex((item) => item.id === producto.id_producto);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({
        id: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito");
  };
  
  const guardarCarrito = () => {
    const carritoConDireccion = {
      productos,
      Direccion,
    };
    localStorage.setItem("carrito", JSON.stringify(carritoConDireccion));
    alert("Carrito guardado con éxito");
  };


  const confirmarCompra = () => {
    if (productos.length === 0) {
      alert("Tu carrito está vacío, agrega productos antes de comprar.");
      return;
    }
    localStorage.setItem("carrito", JSON.stringify(productos));
    navigate("/ConfirmarCompra");
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <NavBar />
      <div>
        <div>
          <p>
            Dirección de envío:{" "}
            {direccionGuardada ? (
              <label>
                {direccionGuardada.calle} {direccionGuardada.numero_exterior},{" "}
                {direccionGuardada.colonia}, {direccionGuardada.estado}, CP{" "}
                {direccionGuardada.codigo_postal}
              </label>
            ) : (
              <label>No has registrado una dirección</label>
            )}
          </p>

          <button
            className="cambiar-btn"
            onClick={() => setMostrarModal(true)}
          >
            <b>{direccionGuardada ? "Cambiar" : "Agregar"}</b>
          </button>
        </div>

        {/* Modal Dirección */}
        <Direccion isOpen={mostrarModal} onClose={() => setMostrarModal(false)}>
          <h2>Formulario de Dirección</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="calle">Calle:</label>
              <input type="text" id="calle" name="calle" value={formData.calle} onChange={handleChange}/>
              {alertas.calle && <p style={{ color: "red" }}>{alertas.calle}</p>}
            </div>
            <div>
              <label htmlFor="numeroIn">Número interior:</label>
              <input type="text" id="numeroIn" name="numeroIn" value={formData.numeroIn} onChange={handleChange}/>
              {alertas.numeroIn && <p style={{ color: "red" }}>{alertas.numeroIn}</p>}
            </div>
            <div>
              <label htmlFor="numeroEx">Número exterior:</label>
              <input type="text" id="numeroEx" name="numeroEx" value={formData.numeroEx} onChange={handleChange}/>
              {alertas.numeroEx && <p style={{ color: "red" }}>{alertas.numeroEx}</p>}
            </div>
            <div>
              <label htmlFor="colonia">Colonia:</label>
              <input type="text" id="colonia" name="colonia" value={formData.colonia} onChange={handleChange}/>
              {alertas.colonia && <p style={{ color: "red" }}>{alertas.colonia}</p>}
            </div>
            <div>
              <label htmlFor="estado">Estado:</label>
              <input type="text" id="estado" name="estado" value={formData.estado} onChange={handleChange}/>
              {alertas.estado && <p style={{ color: "red" }}>{alertas.estado}</p>}
            </div>
            <div>
              <label htmlFor="codigoPostal">Código Postal:</label>
              <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange}/>
              {alertas.codigoPostal && <p style={{ color: "red" }}>{alertas.codigoPostal}</p>}
            </div>
            <button type="submit">Guardar</button>
          </form>
        </Direccion>

        {/* Carrito */}
        <div className="carrito-main-card">
          <div className="productos-lista">
            <h2>Productos</h2>
            {productos.map((p) => (
              <div key={p.id_producto} className="producto-card">
                <img src={p.imagen || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTajfsAf6OPXejLpsV8q0-WeGU7QoUxU3zbXQ&s"} alt={p.nombre} className="producto-img" />
                <div className="producto-info">
                  <p className="producto-nombre">{p.nombre}</p>
                  <p className="producto-precio">${p.precio}</p>
                  <p>{p.marca} | {p.edad_recomendada} | {p.sabor_principal} | {p.tipo_empaque} | {p.peso_empaque_kg}kg</p>
                </div>
                <div className="producto-cantidad">
                  <button onClick={() => decrementar(p.id_producto)}>-</button>
                  <span>{p.cantidad}</span>
                  <button onClick={() => incrementar(p.id_producto)}>+</button>
                </div>
                <p className="producto-subtotal">
                  MXN <b>${p.precio * p.cantidad}</b>
                </p>
                <button className="eliminar" onClick={() => eliminar(p.id_producto)}>✖</button>
                {/* ✅ Agregar al carrito por producto */}
                <button onClick={() => agregarAlCarrito(p)}>Agregar al Carrito</button>
              </div>
            ))}
          </div>

          {/* ✅ Guardar todo el carrito */}
          <button onClick={guardarCarrito}>Guardar Carrito</button>
          <button className="comprar-btn" onClick={confirmarCompra}>Comprar Ahora</button>
        </div>
      </div>
    </>
  );
}

export default Carrito;
