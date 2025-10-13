// src/pages/Dietas.jsx
import { useEffect, useState } from "react";
import apiClient from "../api";
import NavBar from "./Navbar/NavBar";

const Dietas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [dieta, setDieta] = useState(null);

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const res = await apiClient.get("/pets/mis-mascotas");
        setMascotas(res.data);
      } catch (err) {
        console.error("Error al cargar mascotas:", err);
      }
    };
    fetchMascotas();
  }, []);

  const generarDieta = async (id) => {
    try {
      const res = await apiClient.post(`/dietas/generar/${id}`);
      setDieta(res.data);
    } catch (err) {
      console.error("Error generando dieta:", err);
      alert("No se pudo generar la dieta.");
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h2>Generar Dieta Personalizada</h2>

        {mascotas.length === 0 ? (
          <p>No tienes mascotas registradas.</p>
        ) : (
          <div>
            <h3>Selecciona una mascota:</h3>
            {mascotas.map((m) => (
              <button
                key={m.id_mascota}
                onClick={() => generarDieta(m.id_mascota)}
                style={{ margin: "10px" }}
              >
                🐾 {m.nombre} ({m.raza?.nombre || "Sin raza"})
              </button>
            ))}
          </div>
        )}

        {dieta && (
            <div style={{ marginTop: "30px" }}>
                <h3>Dieta generada para {dieta.mascota}</h3>
                <p><b>Calorías diarias:</b> {dieta.kcal_diarias} kcal</p>

                <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad Recomendada</th>
                    <th>Precio Unitario</th>
                    </tr>
                </thead>
                <tbody>
                    {dieta.plan.map((p, i) => (
                    <tr key={i}>
                        <td>{p.producto}</td>
                        <td>{p.tipo}</td>
                        <td>
                        {p.tipo === "Suplemento"
                            ? `${p.cantidad_recomendada} unidad`
                            : `${p.cantidad_recomendada.toFixed(1)} g`}
                        </td>
                        <td>${p.precio.toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                <button
                style={{ marginTop: "20px" }}
                onClick={() => {
                    const items = dieta.plan.map(p => ({
                    id_producto: p.id_producto,
                    nombre: p.producto,
                    precio: p.precio,
                    cantidad: p.tipo === "Suplemento"
                        ? 1
                        : Math.max(1, Math.round(p.cantidad_recomendada / 1000)), // aproximar paquetes/kg
                    }));
                    localStorage.setItem("cartItems", JSON.stringify(items));
                    alert("Dieta agregada al carrito.");
                    window.location.href = "/Carrito";
                }}
                >
                🛒 Agregar dieta al carrito
                </button>
            </div>
            )}

      </div>
    </div>
  );
};

export default Dietas;
