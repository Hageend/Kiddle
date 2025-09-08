import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './InicioSesion.css'
import NavBar from './NavBar';

function InicioSesion() {

  const [formData, setFormData] = useState({
    
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página
    console.log('Datos enviados:', formData);
    // Aquí podrías enviar los datos a una API o realizar otra acción
  };

  return (
  <>
    <NavBar /> 

    <form onSubmit={handleSubmit}>
      
      <div >
        <label htmlFor="email">Correo electrónico:</label>
        <input
          required
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          required
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Enviar</button>
      <div>
        <Link to="/RegistroCliente">¿Aún no tienes una cuenta? ¡Registrate!</Link>
      </div>
    </form>
    </>
  );
}


export default InicioSesion