/*"https://www.petco.com.mx/medias/?context=bWFzdGVyfGltYWdlc3wzNjQ0OTd8aW1hZ2UvanBlZ3xhVzFoWjJWekwyZ3paQzlvWm1Ndk9UUXhOemMzTmpRMk16a3dNaTVxY0djfDgwNmYyOGY1NDZkYTJhY2E2N2ZhOThiY2MzZDU2MThmYmQ1YTA3MGUzYzA0YTBjYTUyMTJmZTE3NzMxNWMwMmM"
"https://petco.com.mx/medias/123038.jpg-1200ftw?context=bWFzdGVyfHJvb3R8MjQ4ODE4fGltYWdlL2pwZWd8YUdVM0wyaGxZeTh4TURNNE1qYzVNamMxTXpFNE1pOHhNak13TXpndWFuQm5YekV5TURCbWRIY3xkZDM0ZDcwYzVlMDM4MjNhZTZhMTI3OThkZmYxNzU5ZmFlMGE3N2ZkN2M2MTUzMDMwMGY1ODRhOGQ1MTUzMGI2"*/
import React, { useId, useState } from 'react';
import "./Carrito.css";
import Direccion from "./Direccion";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [productos, setProductos] = useState([
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
    }
  ]);
    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const navigate = useNavigate();
    const [mostrarModal, setMostrarModal] = useState(false);
  
   const incrementar = (id) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };
  const decrementar = (id) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );
  };
  const eliminar = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const Id= useId();
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
  
    //mostrar errores
    const[alertas, setAlertas] = React.useState({});
    const handleSubmit = (e) => {
  
      e.preventDefault(); // Previene la recarga de la página
      
      let errores = {};
    //calle
    if (formData.calle && !/^[a-zA-Z0-9\s]{2,50}$/.test(formData.calle)) {
      errores.calle = "La calle debe tener entre 2 y 50 caracteres.";
    }
    //numero interior
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
  
    //errores
    if (Object.keys(errores).length > 0) {
      setAlertas(errores);
      //alert("Corrige los errores antes de continuar");
      console.log(errores);
      return;
    }
  
      setAlertas({});
  
      console.log('Datos enviados:', formData);
      // Aquí podrías enviar los datos a una API o realizar otra acción
    };

    const confirmarCompra = () => {
    navigate("/ConfirmarCompra");
  };

  return (
    <>
    <NavBar />
    <div className="carrito-container">

      <div className="direccion-card">
        <p>
          Dirección de envío: <label>Av. Ejemplo 123, CDMX</label>
        </p>
        <button className="cambiar-btn" onClick={() => setMostrarModal(true)}><b>Cambiar</b></button>
      </div>
    {/*-----Modal------*/}
      <Direccion isOpen={mostrarModal} onClose={() => setMostrarModal(false)}>
        <h2>Formulario de Dirección</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="calle">Calle:</label>
            <input type="text" id="calle" name="calle" value={formData.callenge} onChange={handleChange}/>
            {alertas.callenge && <p style={{ color: "red" }}>{alertas.callenge}</p>}
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
    {/*-------*/}
      <div className="carrito-main-card">

        <div className="productos-lista">
          <h2>Productos</h2>
          {productos.map((p) => (
            <div key={p.id} className="producto-card">
              <p className="check-producto"></p>
              <img src={p.imagen} alt={p.nombre} className="producto-img" />
              <div className="producto-info">
                <p className="producto-nombre">{p.nombre}</p>
                <p className="producto-precio">${p.precio}.00</p>
              </div>
              <div className="producto-cantidad">
                <button onClick={() => decrementar(p.id)}>-</button>
                <span>{p.cantidad}</span>
                <button onClick={() => incrementar(p.id)}>+</button>
              </div>
              <p className="producto-subtotal">
                MXN <b>${p.precio * p.cantidad}.00</b>
              </p>
              <button className="eliminar" onClick={() => eliminar(p.id)}>✖</button>
            </div>
          ))}
        </div>

        <div className="resumen-card">
          <h2>Resumen de tu Pedido</h2>
          <p>
            Total de Artículos: {productos.reduce((a, p) => a + p.cantidad, 0)}
          </p>
          <table>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.cantidad}</td>
                  <td>{p.nombre.split(" ")[0]}</td>
                  <td>${p.precio * p.cantidad}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${total}.00 MXN</h3>
          <p className="iva">Los precios incluyen IVA</p>
          <button className="comprar-btn" onClick={confirmarCompra}>Comprar Ahora</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Carrito;
