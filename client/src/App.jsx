import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // La petición se hace a una ruta relativa gracias al proxy
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  console.log('Inspecting users array:', users);
  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id_usuario}>
            {user.nombre} ({user.correo})
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App