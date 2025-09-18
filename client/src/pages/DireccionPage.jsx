import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import NavBar from './Navbar/NavBar';

const DireccionPage = () => {
  const [formData, setFormData] = useState({
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    codigo_postal: '',
    estado: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/direccion', formData);
      alert('Dirección agregada con éxito');
      navigate('/carrito'); // redirige al carrito
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar la dirección');
    }
  };

  return (
    <>
      <NavBar />
      <div>
        <h2>Agregar Dirección</h2>
        <form onSubmit={handleSubmit}>
          <input name="calle" placeholder="Calle" value={formData.calle} onChange={handleChange} required />
          <input name="numero_exterior" placeholder="Número exterior" value={formData.numero_exterior} onChange={handleChange} />
          <input name="numero_interior" placeholder="Número interior" value={formData.numero_interior} onChange={handleChange} />
          <input name="colonia" placeholder="Colonia" value={formData.colonia} onChange={handleChange} required />
          <input name="codigo_postal" placeholder="Código Postal" value={formData.codigo_postal} onChange={handleChange} required />
          <input name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
          <button type="submit">Guardar Dirección</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default DireccionPage;
