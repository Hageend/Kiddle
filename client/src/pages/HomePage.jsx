import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <div>
        <div>
            <h1>Panel de Control de Mascotas</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
          <div>
            <h2>¡Bienvenido!</h2>
            <p>Para empezar, registra a tu primera mascota.</p>
          </div>
      </div>
    </div>
  );
};

export default HomePage;