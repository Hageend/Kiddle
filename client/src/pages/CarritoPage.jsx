// src/pages/CarritoPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api";
import NavBar from "./Navbar/NavBar";

const CarritoPage = ({ initialItems = [] }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems); // [{id_producto, nombre, precio, cantidad}]
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [products, setProducts] = useState([]); // opcional: para rellenar nombre/precio si no vienen
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no hay items, traer productos (usuario puede agregar desde lista de productos)
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('No se pudieron obtener productos', err);
      }
    };
    fetchProducts();

    // Obtener direcciones del usuario
    const fetchAddresses = async () => {
      try {
        const res = await apiClient.get('/users/addresses');
        setAddresses(res.data);
        if (res.data.length > 0) setSelectedAddress(res.data[0].id_direccion);
      } catch (err) {
        console.error('No se pudieron obtener direcciones', err);
      }
    };
    fetchAddresses();
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      setItems(JSON.parse(saved));
      localStorage.removeItem("cartItems");
    }
  }, []);
  // Helper para actualizar item (cantidad)
  const updateQty = (id_producto, qty) => {
    setItems(prev => prev.map(it => it.id_producto === id_producto ? { ...it, cantidad: qty } : it));
  };

  const removeItem = (id_producto) => {
    setItems(prev => prev.filter(it => it.id_producto !== id_producto));
  };

  const addProductToCart = (producto) => {
    const exists = items.find(i => i.id_producto === producto.id_producto);
    if (exists) {
      updateQty(producto.id_producto, exists.cantidad + 1);
    } else {
      setItems(prev => [...prev, { id_producto: producto.id_producto, nombre: producto.nombre, precio: parseFloat(producto.precio), cantidad: 1 }]);
    }
  };

  const total = items.reduce((acc, it) => acc + (parseFloat(it.precio) * parseInt(it.cantidad || 0)), 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert('Selecciona una dirección de entrega.');
    if (items.length === 0) return alert('El carrito está vacío.');

    const payload = {
      id_direccion_entrega: selectedAddress,
      items: items.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad }))
    };

    try {
      setLoading(true);
      const res = await apiClient.post('/orders', payload);
      alert(`Pedido creado (ID: ${res.data.pedido_id}). Total: $${res.data.total}`);
      // Limpiar carrito y redirigir
      setItems([]);
      navigate('/');
    } catch (err) {
      console.error('Error al crear pedido:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'No se pudo realizar la compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: 20 }}>
        <h2>Carrito</h2>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h3>Productos disponibles</h3>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {products.map(p => (
                <div key={p.id_producto} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <strong>{p.nombre}</strong><br />
                    <small>{p.marca} — ${p.precio}</small>
                  </div>
                  <div>
                    <button onClick={() => addProductToCart(p)}>Agregar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Tu carrito</h3>
            {items.length === 0 ? <p>Carrito vacío.</p> : (
              <table border="1" cellPadding="6">
                <thead>
                  <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id_producto}>
                      <td>{it.nombre}</td>
                      <td>${parseFloat(it.precio).toFixed(2)}</td>
                      <td>
                        <input type="number" value={it.cantidad} min="1"
                          onChange={(e) => updateQty(it.id_producto, Math.max(1, parseInt(e.target.value || 1)))} style={{ width: 60 }} />
                      </td>
                      <td>${(parseFloat(it.precio) * it.cantidad).toFixed(2)}</td>
                      <td><button onClick={() => removeItem(it.id_producto)}>Quitar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h4>Total: ${total.toFixed(2)}</h4>

            <h3>Dirección de entrega</h3>
            {addresses.length === 0 ? (
              <div>
                <p>No tienes direcciones. <button onClick={() => navigate('/direccion')}>Agregar dirección</button></p>
              </div>
            ) : (
              <select value={selectedAddress || ''} onChange={(e) => setSelectedAddress(parseInt(e.target.value))}>
                {addresses.map(d => (
                  <option key={d.id_direccion} value={d.id_direccion}>
                    {d.calle} {d.numero_exterior || ''} — {d.colonia} ({d.codigo_postal})
                  </option>
                ))}
              </select>
            )}

            <div style={{ marginTop: 12 }}>
              <button onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Procesando...' : 'Realizar compra'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage;
