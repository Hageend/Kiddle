import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

const AddPetForm = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [selectedEspecie, setSelectedEspecie] = useState('');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    sexo: 'Macho',
    fecha_nacimiento: '',
    peso_inicial: '',
    altura: '',
    tamaño: '',
    esterilizado: false,
    actividad: 'Moderada',
    id_raza: '',
  });

  const [razas, setRazas] = useState([]);
  const [especies, setEspecies] = useState([]);

  const filteredRazas = razas.filter(raza => raza.id_especie == selectedEspecie);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
    if (error) setError('');
  };

  const handleEspecieChange = (e) => {
    const value = e.target.value;
    setSelectedEspecie(value);
    setFormData({...formData, id_raza: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.id_raza) {
      setError('Por favor, selecciona una raza.');
      return;
    }

    try {
      await apiClient.post('/pets', formData);
      alert('Mascota registrada con éxito!');
      navigate('/');
    } catch (error) {
      setError('No se puedo registrar la mascota.')
      console.error(error.response?.data?.error);
    }


  }

  useEffect(() => {
    const fetchPetsData = async () => {
      try {
        const [razasData, especiesData] = await Promise.all([
          apiClient.get('/data/razas'),
          apiClient.get('/data/especies')
        ]);
        setRazas(razasData.data);
        setEspecies(especiesData.data);

      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchPetsData();
  }, []);  
  
  console.log(formData);
  

  return (
    <div>
      <h2>Registrar Nueva Mascota</h2>
      <form onSubmit={handleSubmit}>
        <input name='nombre' type="text" value={formData.nombre} onChange={handleChange} placeholder='Nombre de la mascota' required/>
        <select name="sexo" value={formData.sexo} onChange={handleChange} required>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange}/>
        <input type="number" name="peso_inicial" step="0.1" value={formData.peso_inicial} onChange={handleChange} placeholder='Peso (Kg)' required/>
        <input type="number" name="altura" step="0.1" value={formData.altura} onChange={handleChange} placeholder='Altura (cm)'/>        
        <select name="tamaño" value={formData.tamaño} onChange={handleChange} required>
          <option value="">-- Seleccione un tamaño --</option>
          <option value="Pequeño">Pequeño</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
          <option value="Enorme">Enorme</option>
        </select>

        <label>
          <input type="checkbox" name="esterilizado" value={formData.esterilizado} onChange={handleChange}/>
          ¿Esta esterilizado?
        </label>
        
        <label htmlFor="actividad">Actividad:</label>
        <select name="actividad" value={formData.actividad} onChange={handleChange} required>
          <option value="">-- Selecciona un tiempo de actividad</option>
          <option value="Baja">Baja</option>
          <option value="Moderada">Moderada</option>
          <option value="Alta">Alta</option>
        </select>

        <label htmlFor="especie">Especie:</label>
        <select 
          id="especie"
          value={selectedEspecie}
          onChange={handleEspecieChange}
        >
          <option value="">-- Selecciona una especie --</option>
          {especies.map((esp) => (
            <option key={esp.id_especie} value={esp.id_especie}>
              {esp.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="raza">Raza:</label>
        <select 
          id="raza"
          name="id_raza"
          value={formData.id_raza}
          onChange={handleChange}
          disabled={!selectedEspecie}
        >
          <option value="">-- Selecciona una raza --</option>
          {filteredRazas.map((raza) => (
            <option key={raza.id_raza} value={raza.id_raza}>
              {raza.nombre}
            </option>
          ))}
        </select>

        <button type="submit">Registrar</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default AddPetForm;