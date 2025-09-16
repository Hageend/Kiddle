import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import apiClient from '../api';
import styles from './RegisterPage.module.css'


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  console.log(formData);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }

    try {
      const { confirmarContraseña, ...dataToSend } = formData;
      await apiClient.post('/auth/register', dataToSend);
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data?.error);
      alert('Hubo un error al registrar el usuario.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Crear una Cuenta</h2>
      <form onSubmit={handleSubmit} className={styles.formBody}>
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
        <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido (Opcional)" />
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" required />
        <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} placeholder="Confirmar Contraseña" required />
        {error && <p>{error}</p>}
        <button type="submit" className={styles.btnSubmit}>Crear Cuenta</button>
      </form>
      <div className={styles.loginRedirect}>
        <p>
          ¿Ya tienes una cuenta?
          <Link to="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;