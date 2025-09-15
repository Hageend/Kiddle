import React, { useState } from 'react';
import apiClient from '../api'; 
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    contraseña: '', 
    telefono: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/auth/register', formData);
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data?.error);
      alert('Hubo un error al registrar el usuario.');
    }
*/
  const[alertas, setAlertas] = React.useState({});
  const handleSubmit = async(e) => {
    e.preventDefault(); // Previene la recarga de la página
    let errores = {};
    //Validar campos
    // nombre
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.nombre)) {
    errores.nombre = "El nombre solo debe contener letras y tener entre 2 y 40 caracteres.";
  }
  // apellido paterno
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.primer_apellido)) {
    errores.apellidoP = "El primer apellido solo debe contener letras.";
  }

  //apellido materno
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.segundo_apellido)) {
    errores.apellidoM = "El segundo apellido solo debe contener letras.";
  }

  //email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errores.email = "El correo electrónico no es válido.";
  }

  //contraseña
  /*Longitud mínima de 8 y máxima de 12 caracteres.
    Al menos una letra minúscula.
    Al menos una letra mayúscula.
    Al menos un número.
    Al menos un carácter especial entre @$!%*?&.
    Solo puede contener letras, números y esos caracteres especiales.*/
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(formData.contraseña)) {
    errores.password = "La contraseña debe tener entre 8 y 12 caracteres.";
  }

  //confirmar contraseña
  /*if (formData.password !== formData.confirmPassword) {
    errores.confirmPassword = "Las contraseñas no coinciden.";
  }*/

  // telefono
  if (!/^[0-9]{10}$/.test(formData.telefono)) {
    errores.telefono = "El teléfono debe contener 10 dígitos.";
  }
//errores
  if (Object.keys(errores).length > 0) {
    setAlertas(errores);
    //alert("Corrige los errores antes de continuar");
    console.log(errores);
    return;
  }

    setAlertas({});

    try {
      await apiClient.post('/auth/register', formData);
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data?.error);
      alert('Hubo un error al registrar el usuario.');
    }
  };
  

  return (
    <div>
      <div>
        <h2>Crear una Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
          {alertas.nombre && <p style={{ color: "red" }}>{alertas.nombre}</p>}
          <input name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
          {alertas.primer_apellido && <p style={{ color: "red" }}>{alertas.primer_apellido}</p>}
          <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido (Opcional)" />
          {alertas.segundo_apellido && <p style={{ color: "red" }}>{alertas.segundo_apellido}</p>}
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
          {alertas.correo && <p style={{ color: "red" }}>{alertas.correo}</p>}
          <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" required />
          {alertas.contraseña && <p style={{ color: "red" }}>{alertas.contraseña}</p>}
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono (Opcional)" />
          {alertas.telefono && <p style={{ color: "red" }}>{alertas.telefono}</p>}
          <button type="submit">Crear Cuenta</button>
        </form>
        <div>
          <Link to="/login">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;