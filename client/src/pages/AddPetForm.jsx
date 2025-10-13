// src/pages/AddPetForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api";
import NavBar from "./Navbar/NavBar";

const AddPetForm = () => {
  const navigate = useNavigate();

  // Al cargar, mostrar alerta
  useEffect(() => {
    alert("Vamos a hacerte unas preguntas sobre tu mascota a continuación...");
  }, []);

  // Datos iniciales del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    peso_inicial: "",
    altura: "",
    especie: "",
    raza: "",
    tamaño: "",
    esterilizado: false,
    actividad: "",
    fecha_nacimiento: "",
    sexo: "",
    // alimentación
    tipo_alimento: "",
    cantidad_diaria: "",
    recibe_sobras: false,
    tipo_sobras: "",
    cantidad_sobras: "",
    recibe_premios: false,
    tipo_premios: "",
    cantidad_premios: "",
    // salud
    enfermedad: "",
    medicamento: "",
    operacion: "",
    tipo_operacion: "",
    fecha_operacion: "",
    alergia_alimento: "",
    sintomas_alergia: "",
    objetivo_dieta: "",
  });

  const [especies, setEspecies] = useState([]);
  const [razas, setRazas] = useState([]);
  const [razasFiltradas, setRazasFiltradas] = useState([]);

  // Obtener especies y razas desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEspecies = await apiClient.get("/data/especies");
        const resRazas = await apiClient.get("/data/razas");
        setEspecies(resEspecies.data);
        setRazas(resRazas.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtrar razas según la especie seleccionada
  useEffect(() => {
    if (formData.especie) {
      const filtradas = razas.filter(
        (r) => r.id_especie === parseInt(formData.especie)
      );
      setRazasFiltradas(filtradas);
    } else {
      setRazasFiltradas([]);
    }
  }, [formData.especie, razas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Paso 1: Registrar la mascota
      const mascotaRes = await apiClient.post("/pets", {
        id_raza: formData.raza,
        nombre: formData.nombre,
        sexo: formData.sexo,
        fecha_nacimiento: formData.fecha_nacimiento,
        peso_inicial: formData.peso_inicial,
        altura: formData.altura,
        tamaño: formData.tamaño,
        esterilizado: formData.esterilizado,
        actividad: formData.actividad,
      });

      const id_mascota = mascotaRes.data.id_mascota;

      // Paso 2: Registrar hábitos alimenticios
      await apiClient.post(`/pets/${id_mascota}/alimentacion`, {
        alimento_principal: formData.tipo_alimento,
        cantidad_diaria: parseFloat(formData.cantidad_diaria) || 0,
        recibe_sobras: formData.recibe_sobras,
        tipo_sobras: formData.tipo_sobras,
        cantidad_sobras: parseFloat(formData.cantidad_sobras) || 0,
        recibe_premios: formData.recibe_premios,
        tipo_premios: formData.tipo_premios,
        cantidad_premios: parseFloat(formData.cantidad_premios) || 0,
      });

      // Paso 3: Registrar salud
      await apiClient.post(`/pets/${id_mascota}/salud`, {
        enfermedades: formData.enfermedad,
        medicamentos: formData.medicamento,
        alergias_alimento: formData.alergia_alimento,
        sintomas_alergia: formData.sintomas_alergia,
      });

      // Paso 4: Registrar operación si existe
      if (formData.operacion && formData.tipo_operacion) {
        await apiClient.post(`/pets/${id_mascota}/operacion`, {
          tipo_operacion: formData.tipo_operacion,
          fecha_operacion: formData.fecha_operacion || new Date(),
        });
      }

      // Confirmación
      alert("Mascota registrada correctamente.");

      // Preguntar si desea generar dieta
      if (window.confirm("¿Quieres generar su dieta ahora?")) {
        navigate("/Dietas");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      alert("Ocurrió un error al registrar la mascota.");
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h2>Registro de Mascota</h2>
        <form onSubmit={handleSubmit}>
          <h3>Datos Generales</h3>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre de la mascota"
            required
          />
          <input
            name="peso_inicial"
            value={formData.peso_inicial}
            onChange={handleChange}
            placeholder="Peso (kg)"
            required
          />
          <input
            name="altura"
            value={formData.altura}
            onChange={handleChange}
            placeholder="Altura (cm)"
          />

          <label>Especie</label>
          <select
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            required
          >
            <option value="">--Selecciona--</option>
            {especies.map((e) => (
              <option key={e.id_especie} value={e.id_especie}>
                {e.nombre}
              </option>
            ))}
          </select>

          <label>Raza</label>
          <select
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
          >
            <option value="">--Selecciona--</option>
            {razasFiltradas.map((r) => (
              <option key={r.id_raza} value={r.id_raza}>
                {r.nombre}
              </option>
            ))}
          </select>

          <label>Tamaño</label>
          <select name="tamaño" value={formData.tamaño} onChange={handleChange}>
            <option value="">Selecciona tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
            <option value="Enorme">Enorme</option>
          </select>

          <label>¿Está esterilizado?</label>
          <input
            type="checkbox"
            name="esterilizado"
            checked={formData.esterilizado}
            onChange={handleChange}
          />

          <label>Nivel de actividad física</label>
          <select
            name="actividad"
            value={formData.actividad}
            onChange={handleChange}
          >
            <option value="">Selecciona</option>
            <option value="Baja">Baja</option>
            <option value="Moderada">Moderada</option>
            <option value="Alta">Alta</option>
          </select>

          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />

          <label>Sexo</label>
          <select name="sexo" value={formData.sexo} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>

          <hr />
          <h3>Sobre su alimentación</h3>
          <select
            name="tipo_alimento"
            value={formData.tipo_alimento}
            onChange={handleChange}
          >
            <option value="">Tipo de alimento</option>
            <option value="Seco">Seco</option>
            <option value="Húmedo">Húmedo</option>
            <option value="Mixto">Mixto</option>
            <option value="Casero">Dieta casera</option>
            <option value="Cruda">Cruda</option>
          </select>

          <input
            name="cantidad_diaria"
            value={formData.cantidad_diaria}
            onChange={handleChange}
            placeholder="Cantidad diaria (gramos)"
          />

          <label>
            <input
              type="checkbox"
              name="recibe_sobras"
              checked={formData.recibe_sobras}
              onChange={handleChange}
            />
            ¿Recibe sobras?
          </label>
          {formData.recibe_sobras && (
            <>
              <input
                name="tipo_sobras"
                value={formData.tipo_sobras}
                onChange={handleChange}
                placeholder="Tipo de sobras"
              />
              <input
                name="cantidad_sobras"
                value={formData.cantidad_sobras}
                onChange={handleChange}
                placeholder="Cantidad (gramos)"
              />
            </>
          )}

          <label>
            <input
              type="checkbox"
              name="recibe_premios"
              checked={formData.recibe_premios}
              onChange={handleChange}
            />
            ¿Recibe premios?
          </label>
          {formData.recibe_premios && (
            <>
              <input
                name="tipo_premios"
                value={formData.tipo_premios}
                onChange={handleChange}
                placeholder="Tipo de premios"
              />
              <input
                name="cantidad_premios"
                value={formData.cantidad_premios}
                onChange={handleChange}
                placeholder="Cantidad (gramos)"
              />
            </>
          )}

          <hr />
          <h3>Salud</h3>
          <label>¿Tiene alguna enfermedad?</label>
          <input
            name="enfermedad"
            value={formData.enfermedad}
            onChange={handleChange}
            placeholder="Describe la enfermedad"
          />

          <label>¿Toma medicamentos?</label>
          <input
            name="medicamento"
            value={formData.medicamento}
            onChange={handleChange}
            placeholder="Medicamento(s)"
          />

          <label>¿Ha tenido alguna operación?</label>
          <input
            name="operacion"
            value={formData.operacion}
            onChange={handleChange}
            placeholder="Sí/No"
          />
          {formData.operacion.toLowerCase() === "sí" && (
            <>
              <input
                name="tipo_operacion"
                value={formData.tipo_operacion}
                onChange={handleChange}
                placeholder="Tipo de cirugía"
              />
              <input
                type="date"
                name="fecha_operacion"
                value={formData.fecha_operacion}
                onChange={handleChange}
              />
            </>
          )}

          <label>¿Alergia a algún alimento?</label>
          <input
            name="alergia_alimento"
            value={formData.alergia_alimento}
            onChange={handleChange}
            placeholder="Alimento causante"
          />

          <label>Síntomas</label>
          <input
            name="sintomas_alergia"
            value={formData.sintomas_alergia}
            onChange={handleChange}
            placeholder="Síntomas observados"
          />

          <hr />
          <h3>Objetivo de la dieta</h3>
          <select
            name="objetivo_dieta"
            value={formData.objetivo_dieta}
            onChange={handleChange}
          >
            <option value="">Selecciona objetivo</option>
            <option value="Ganar peso">Ganar peso</option>
            <option value="Perder peso">Perder peso</option>
            <option value="Mejorar digestión">Mejorar digestión</option>
            <option value="Piel y pelaje">Mejorar piel y pelaje</option>
            <option value="Recuperación post-operación">
              Recuperación post-operación
            </option>
            <option value="Enfermedad">Ayudar con enfermedad</option>
          </select>

          <button type="submit">Registrar Mascota</button>
        </form>
      </div>
    </div>
  );
};

export default AddPetForm;
