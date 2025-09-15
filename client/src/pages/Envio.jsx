import React, { useEffect, useState } from "react";
import "../css/Envio.css";

function Envio(){
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    // Aquí llamarías a tu API real con fetch o axios
    setTimeout(() => {
      setPedido({
        id: "12345",
        cliente: "Capibaya",
        estado: "En camino", // Podría ser "Procesando", "En camino", "Entregado"
        fechaPedido: "2025-09-01",
        fechaEntregaEstimada: "2025-09-10",
        productos: [
          { id: 1, nombre: "Croquetas Premium", cantidad: 2 },
          { id: 2, nombre: "Juguete para perro", cantidad: 1 },
        ],
      });
    }, 1000);
  }, []);

  if (!pedido) return <p className="cargando">Cargando pedido...</p>;

  const estados = ["Procesando", "En camino", "Entregado"];

  return (
    <div className="seguimiento-container">
      <h1>Seguimiento de tu Pedido </h1>
      <p>Número de pedido: #{pedido.id}</p>
      <p><strong>Cliente:</strong> {pedido.cliente}</p>
      <p><strong>Fecha de pedido:</strong> {pedido.fechaPedido}</p>
      <p className="green"><strong>Entrega estimada:</strong> {pedido.fechaEntregaEstimada}</p>
        <br></br>
      <p><center>Estado del pedido:</center></p>
      <div className="linea-tiempo">
        {estados.map((estado, index) => (
          <div
            key={index}
            className={`paso ${pedido.estado === estado ? "activo" : ""} ${
              estados.indexOf(pedido.estado) > index ? "completado" : ""
            }`}
          >
            <span>{estado}</span>
          </div>
        ))}
      </div>

      <p>Productos:</p>
      <ul>
        {pedido.productos.map((prod) => (
          <li key={prod.id}>
            {prod.nombre} - {prod.cantidad} pz
          </li>
        ))}
      </ul>
      <br></br>
      <p>Cuentanos tu experiencia</p>
      <p>Comentarios: </p>
      <input type="text" placeholder="Escribe tus comentarios aquí..." style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}></input>
      <br></br>
      <br></br>
      <button style={{padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer'}}>Enviar</button>
    </div>
  );
}
export default Envio;