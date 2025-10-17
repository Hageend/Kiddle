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
    telefono: '',
  });

  const [error, setError] = useState('');
  const [alertas, setAlertas] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    let errores = {};

    if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.nombre)) errores.nombre = "El nombre solo debe contener letras (2-40 caracteres).";
    if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.primer_apellido)) errores.primer_apellido = "El primer apellido solo debe contener letras.";
    if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.segundo_apellido)) errores.segundo_apellido = "El segundo apellido solo debe contener letras.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) errores.correo = "El correo no es válido.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(formData.contraseña))
      errores.contraseña = "La contraseña debe tener entre 8 y 12 caracteres, incluir mayúscula, minúscula, número y carácter especial.";
    if (formData.telefono && !/^[0-9]{10}$/.test(formData.telefono)) errores.telefono = "El teléfono debe contener 10 dígitos.";

    if (Object.keys(errores).length > 0) {
      setAlertas(errores);
      return;
    }

    setAlertas({});

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
  //console.log(formData);
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h2>Crear una Cuenta</h2>
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        {alertas.nombre && <p style={{ color: "red", fontSize:"13px" }}>{alertas.nombre}</p>}
        <input name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
        {alertas.primer_apellido && <p style={{ color: "red", fontSize:"13px" }}>{alertas.primer_apellido}</p>}
        <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />
        {alertas.segundo_apellido && <p style={{ color: "red", fontSize:"13px" }}>{alertas.segundo_apellido}</p>}
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
        {alertas.correo && <p style={{ color: "red", fontSize:"13px" }}>{alertas.correo}</p>}
        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" required />
        {alertas.contraseña && <p style={{ color: "red", fontSize:"13px" }}>{alertas.contraseña}</p>}
        <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} placeholder="Confirmar Contraseña" required />
        {error && <p>{error}</p>}
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
        {alertas.telefono && <p style={{ color: "red" , fontSize:"13px"}}>{alertas.telefono}</p>}
        <button type="submit" className={styles.btnSubmit}>Crear Cuenta</button>
      
      <div className={styles.loginRedirect}>
        <p>
          ¿Ya tienes una cuenta?
          <Link to="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
      </form>
    </div>
  );
};

export default RegisterPage;