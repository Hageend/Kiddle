import React, { useEffect, useState } from "react";
import "../css/ConfirmarCompra.css";
import api from "../api";

export default function ConfirmarCompra() {
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const envio = 100;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direccionGuardada, setDireccionGuardada] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("users"));
  const id_usuario = usuario?.id_usuario;

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
      };  fetchDireccion();
  }, []);

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    setProductos(carrito);

    const sumaSubtotal = carrito.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    setSubtotal(sumaSubtotal);
    setTotal(sumaSubtotal + envio);

    setLoading(false);
  }, []);


  useEffect(() => {
    const fetchDireccion = async () => {
      if (!id_usuario) return;
      try {
        const res = await api.get(`/direccion/${id_usuario}`);
        setDireccion(res.data);
      } catch (err) {
        console.error("Error al obtener la dirección:", err);
        setError("No se pudo cargar la dirección.");
      }
    };
    fetchDireccion();
  }, [id_usuario]);


  const confirmarCompra = async () => {
    if (!id_usuario || productos.length === 0 || !direccion) {
      alert("Faltan datos para procesar la compra.");
      return;
    }

    try {
      await api.post("/pedidos", {
        id_usuario,
        id_direccion_entrega: direccion.id_direccion,
        total,
        estado: "Pendiente",
        productos: productos.map((p) => ({
          id_producto: p.id,
          cantidad: p.cantidad,
          precio_unitario: p.precio,
          subtotal: p.precio * p.cantidad,
        })),
      });

      alert("¡Compra confirmada! 🎉");

      localStorage.removeItem("carrito");
      setProductos([]);
    } catch (err) {
      console.error("Error al registrar la compra:", err);
      alert("Error al procesar la compra.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="confirmacion-container">
      <h1 className="titulo">Confirmación de Compra</h1>
      <div className="contenido-principal">
        <div className="productos-y-entrega">
          <div className="productos">
            <h2>Productos</h2>
            {productos.length === 0 ? (
              <p>No hay productos en el carrito</p>
            ) : (
              productos.map((p) => (
                <div key={p.id} className="producto-card">
                  <img src={p.imagen || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTajfsAf6OPXejLpsV8q0-WeGU7QoUxU3zbXQ&s"} alt={p.nombre} />
                  <div>
                    <h3>{p.nombre}</h3>
                    <p>Cantidad: {p.cantidad}</p>
                    <p>Precio: ${p.precio}</p>
                    <p>Subtotal: ${p.precio * p.cantidad}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="entrega">
            <h2>Datos de entrega</h2>
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
            {/*{direccion ? (
              <p>
                {direccion.calle} {direccion.numero_exterior}{" "}
                {direccion.numero_interior
                  ? `Int. ${direccion.numero_interior}`
                  : ""}
                , {direccion.colonia}, {direccion.estado}, CP{" "}
                {direccion.codigo_postal}
              </p>
            ) : (
              <p>No se encontró dirección</p>
            )}*/}
          </div>
        </div>
      
        <div className="resumen-fijo">
          <h2>Resumen del Pedido</h2>
          <p>Subtotal: ${subtotal}</p>
          <p>Envío: ${envio}</p>
          <p className="total">Total: ${total}</p>
          <button onClick={confirmarCompra}>Confirmar Compra</button>
          <p>Aceptas los términos y Condiciones de uso al comprar</p>
        </div>
      </div>
    </div>
  );
}
