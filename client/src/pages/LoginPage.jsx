import { useState } from 'react';
import apiClient from '../api';
import { useNavigate, Link } from 'react-router-dom';
import "../css/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirige a la página principal
    } catch (error) {
      alert('Correo o contraseña incorrectos.');
      console.error(error);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
          <input type="email" name="correo" onChange={handleChange} placeholder="Correo" required />
          <input type="password" name="contraseña" onChange={handleChange} placeholder="Contraseña" required />
          <button type="submit">Entrar</button>
        <p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
    </form>
    </div>
  );
};

export default LoginPage;