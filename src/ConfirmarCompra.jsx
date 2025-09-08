import React from "react";
import "./ConfirmarCompra.css";

export default function ConfirmarCompra() {
  const productos = [
    {
      id: 1,
      nombre: "WholeHearted Libre de Granos Alimento Natural para Perro Senior Todas las Razas Receta Pollo, 11.4 kg",
      precio: 550,
      cantidad: 1,
      imagen: "https://www.petco.com.mx/medias/?context=bWFzdGVyfGltYWdlc3wzNjQ0OTd8aW1hZ2UvanBlZ3xhVzFoWjJWekwyZ3paQzlvWm1Ndk9UUXhOemMzTmpRMk16a3dNaTVxY0djfDgwNmYyOGY1NDZkYTJhY2E2N2ZhOThiY2MzZDU2MThmYmQ1YTA3MGUzYzA0YTBjYTUyMTJmZTE3NzMxNWMwMmM"
    },
    {
      id: 2,
      nombre: "Canidae Pure Alimento Natural sin Granos para Perro Senior Receta Pollo Camote y Garbanzos, 10.8 kg",
      precio: 1850,
      cantidad: 2,
      imagen: "https://petco.com.mx/medias/123038.jpg-1200ftw?context=bWFzdGVyfHJvb3R8MjQ4ODE4fGltYWdlL2pwZWd8YUdVM0wyaGxZeTh4TURNNE1qYzVNamMxTXpFNE1pOHhNak13TXpndWFuQm5YekV5TURCbWRIY3xkZDM0ZDcwYzVlMDM4MjNhZTZhMTI3OThkZmYxNzU5ZmFlMGE3N2ZkN2M2MTUzMDMwMGY1ODRhOGQ1MTUzMGI2"
    },
  ];

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const envio = 50;
  const total = subtotal + envio;

  const confirmarCompra = () => {
    alert("¡Compra confirmada! 🎉");
  };

  return (
    <div className="confirmacion-container">
      <h1 className="titulo">Confirmación de Compra</h1>
      <div className="contenido-principal">

        <div className="productos-y-entrega">
          <div className="productos">
            {productos.map((p) => (
              <div key={p.id} className="producto-card">
                <img src={p.imagen} alt={p.nombre} />
                <div>
                  <h3>{p.nombre}</h3>
                  <p>Cantidad: {p.cantidad}</p>
                  <p>${p.precio}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="entrega">
            <h2>Datos de entrega</h2>
            <p>Dirección: Calle Ejemplo 123, CDMX</p>
            {/*<button className="boton">Cambiar</button>*/}
          </div>
          <div className="entrega">
            <div className="opciones">
              <h3>Opción de envío</h3>
              <select>
                <option>Envío estándar - $50</option>
                <option>Envío exprés - $100</option>
              </select>
            </div>

            <div className="opciones">
              <h3>Método de pago</h3>
              <select>
                <option>Tarjeta de crédito</option>
                <option>PayPal</option>
                <option>Transferencia bancaria</option>
              </select>
            </div>
          </div>  
        </div>


        <div className="resumen-fijo">
          <h2>Resumen del Pedido</h2>
          <p>Subtotal: ${subtotal}</p>
          <p>Envío: ${envio}</p>
          <p className="total">Total: ${total}</p>
          <button onClick={confirmarCompra}>Confirmar Compra</button>
          <p>Términos y Condicones de uso</p>
        </div>
        
      </div>

    </div>
  );
}
