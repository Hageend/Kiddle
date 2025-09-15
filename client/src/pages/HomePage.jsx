import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

const HomePage = () => {
  
  const navigate = useNavigate();

  const [mascotas, setMascotas] = useState([]);

  const handleAddPet = () => {
    navigate('/petForm')
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const pets = await apiClient.get('/pets')
        setMascotas(pets.data)
      } catch (error) {
        console.error('No se pudieron obtener las mascotas!!',error);
      }
    };
    fetchPets();
  }, [])
  console.log(mascotas);
  


  return (
    <div>
      <div>
        <div>
            <h1>Panel de Control de Mascotas</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
          <div>
            {mascotas.length === 0 ? (
              <div>
                <h2>¡Bienvenido!</h2>
                <p>Para empezar, registra a tu primera mascota.</p>
                <button onClick={handleAddPet}>Agregar Primera Mascota</button>
              </div>
            ) : (
              <div>
                <h2>Mis Mascotas!</h2>
                <button onClick={handleAddPet}> + Agregar otra mascota</button>
                <div>
                  {mascotas.map(mascota => (
                    <div key={mascota.id_mascota}>
                      <h3>{mascota.nombre}</h3>
                      <p><strong>Sexo:</strong> {mascota.sexo}</p>
                      <p><strong>Fecha de nacimiento:</strong> {formatDate(mascota.fecha_nacimiento)}</p>
                      <p><strong>Peso inicial:</strong> {mascota.peso_inicial} kg</p>
                      <p><strong>Altura:</strong> {mascota.altura} cm</p>
                      <p><strong>Tamaño:</strong> {mascota.tama_o}</p>
                      <p><strong>Esterilizado:</strong> {mascota.esterilizado ? 'Sí' : 'No'}</p>
                      <p><strong>Nivel de actividad:</strong> {mascota.actividad}</p>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default HomePage;