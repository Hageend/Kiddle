import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Productos en el carrito
        const carritoRes = await apiClient.get('/carrito', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(carritoRes.data);

        // Direcciones del usuario
        const direccionesRes = await apiClient.get('/direccion', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDirecciones(direccionesRes.data);
        if (direccionesRes.data.length > 0) {
          setSelectedDireccion(direccionesRes.data[0]);
        }

        // Productos disponibles (solo de consulta)
        const productosRes = await apiClient.get('/productos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductosDisponibles(productosRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleConfirmarCompra = async () => {
    if (!selectedDireccion) {
      alert('Debes registrar una dirección antes de confirmar la compra.');
      return;
    }
    try {
      await apiClient.post(
        '/pedido',
        { id_direccion_entrega: selectedDireccion.id_direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Compra confirmada ✅');
    } catch (err) {
      console.error(err);
      alert('Error al confirmar compra');
    }
  };

  return (
    <div>
      <h2>🛒 Carrito</h2>

      {productos.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p.id_producto}>{p.nombre} - ${p.precio}</li>
          ))}
        </ul>
      )}

      <h3>📍 Dirección de envío</h3>
      {direcciones.length === 0 ? (
        <div>
          <p>No has registrado una dirección.</p>
          <button onClick={() => navigate('/direccion')}>Agregar dirección</button>
        </div>
      ) : (
        <div>
          <p>
            Dirección seleccionada: {selectedDireccion.calle}, {selectedDireccion.colonia}, {selectedDireccion.estado}
          </p>
          <select
            value={selectedDireccion.id_direccion}
            onChange={(e) =>
              setSelectedDireccion(
                direcciones.find((dir) => dir.id_direccion === parseInt(e.target.value))
              )
            }
          >
            {direcciones.map((dir) => (
              <option key={dir.id_direccion} value={dir.id_direccion}>
                {dir.calle}, {dir.colonia}, {dir.estado}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleConfirmarCompra} disabled={productos.length === 0}>
        Confirmar compra ✅
      </button>

      <h3>Productos disponibles 🛍️</h3>
      <ul>
        {productosDisponibles.map((p) => (
          <li key={p.id_producto}>
            {p.nombre} - ${p.precio} - {p.tipo_alimento || ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Carrito;
