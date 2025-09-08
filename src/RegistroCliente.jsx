import React, { useId, useState } from 'react';
import './RegistroCliente.css'
import NavBar from './NavBar';
import { Link } from "react-router-dom";

function RegistroCliente() {

  const Id= useId();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    calle: '',
    numeroIn: '',
    numeroEx: '',
    colonia: '',
    estado: '',
    codigoPostal: ''
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //mostrar errores
  const[alertas, setAlertas] = React.useState({});

  const handleSubmit = (e) => {

    e.preventDefault(); // Previene la recarga de la página
    
    let errores = {};

    //Validar campos

    // nombre
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.nombre)) {
    errores.nombre = "El nombre solo debe contener letras y tener entre 2 y 40 caracteres.";
  }

  // apellido paterno
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.apellidoP)) {
    errores.apellidoP = "El primer apellido solo debe contener letras.";
  }

  //apellido materno
  if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.apellidoM)) {
    errores.apellidoM = "El segundo apellido solo debe contener letras.";
  }

  //email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errores.email = "El correo electrónico no es válido.";
  }

  //contraseña
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(formData.password)) {
    errores.password = "La contraseña debe tener entre 8 y 12 caracteres.";
  }

  //confirmar contraseña
  if (formData.password !== formData.confirmPassword) {
    errores.confirmPassword = "Las contraseñas no coinciden.";
  }

  // telefono
  if (!/^[0-9]{10}$/.test(formData.telefono)) {
    errores.telefono = "El teléfono debe contener 10 dígitos.";
  }

  //datos de dkireccion opcionales para el registro

  //calle
  if (formData.calle && !/^[a-zA-Z0-9\s]{2,50}$/.test(formData.calle)) {
    errores.calle = "La calle debe tener entre 2 y 50 caracteres.";
  }
  //numero interior
  if (formData.numeroIn && !/^[0-9]{1,5}$/.test(formData.numeroIn)) {
    errores.numeroIn = "El número interior debe ser numérico (máx 5 dígitos).";
  }

  if (formData.numeroEx && !/^[0-9]{1,5}$/.test(formData.numeroEx)) {
    errores.numeroEx = "El número exterior debe ser numérico (máx 5 dígitos).";
  }

  if (formData.colonia && !/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.colonia)) {
    errores.colonia = "La colonia debe contener solo letras (2 a 40 caracteres).";
  }

  if (formData.estado && !/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.estado)) {
    errores.estado = "El estado debe contener solo letras (2 a 40 caracteres).";
  }

  if (formData.codigoPostal && !/^[0-9]{5}$/.test(formData.codigoPostal)) {
    errores.codigoPostal = "El código postal debe tener 5 números.";
  }

  //errores
  if (Object.keys(errores).length > 0) {
    setAlertas(errores);
    //alert("Corrige los errores antes de continuar");
    console.log(errores);
    return;
  }

    setAlertas({});

    console.log('Datos enviados:', formData);
    // Aquí podrías enviar los datos a una API o realizar otra acción
  };

  

  return (
  <>
    <button className="navbar-btn">Regresar</button>
   <NavBar /> 

    <form onSubmit={handleSubmit}>
      <p id={Id}>Registro de Cliente</p>
      <div >
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}/>
        {alertas.nombre && <p style={{ color: "red" }}>{alertas.nombre}</p>}
      </div>
      <div >
        <label htmlFor="apellidoP">Primer Apellido:</label>
        <input type="text" id="apellidoP" name="apellidoP" value={formData.apellidoP} onChange={handleChange}/>
        {alertas.apellidoP && <p style={{ color: "red" }}>{alertas.apellidoP}</p>}
      </div>
      <div >
        <label htmlFor="apellidoM">Segundo Apellido:</label>
        <input type="text" id="apellidoM" name="apellidoM" value={formData.apellidoM} onChange={handleChange}/>
        {alertas.apellidoM && <p style={{ color: "red" }}>{alertas.apellidoM}</p>}
      </div>
      <div >
        <label htmlFor="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} Validation/>
        {alertas.email && <p style={{ color: "red" }}>{alertas.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}/>
        {alertas.password && <p style={{ color: "red" }}>{alertas.password}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirmar contraseña:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
        {alertas.confirmPassword && <p style={{ color: "red" }}>{alertas.confirmPassword}</p>}
      </div>
      <div>
        <label htmlFor="telefono">telefono:</label>
        <input type="number" id="telefono" name="telefono" value={formData.telefonoge} onChange={handleChange}/>
        {alertas.telefonoge && <p style={{ color: "red" }}>{alertas.telefonoge}</p>}
      </div>
      <div>
        <label htmlFor="calle">Calle:</label>
        <input type="text" id="calle" name="calle" value={formData.callenge} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.callenge && <p style={{ color: "red" }}>{alertas.callenge}</p>}
      </div>
      <div>
        <label htmlFor="numeroIn">Número interior:</label>
        <input type="text" id="numeroIn" name="numeroIn" value={formData.numeroIn} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.numeroIn && <p style={{ color: "red" }}>{alertas.numeroIn}</p>}
      </div>
      <div>
        <label htmlFor="numeroEx">Número exterior:</label>
        <input type="text" id="numeroEx" name="numeroEx" value={formData.numeroEx} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.numeroEx && <p style={{ color: "red" }}>{alertas.numeroEx}</p>}
      </div>
      <div>
        <label htmlFor="colonia">Colonia:</label>
        <input type="text" id="colonia" name="colonia" value={formData.colonia} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.colonia && <p style={{ color: "red" }}>{alertas.colonia}</p>}
      </div>
      <div>
        <label htmlFor="estado">Estado:</label>
        <input type="text" id="estado" name="estado" value={formData.estado} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.estado && <p style={{ color: "red" }}>{alertas.estado}</p>}
      </div>
      <div>
        <label htmlFor="codigoPostal">Código Postal:</label>
        <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange}/>
        <small style={{ color: "gray" }}>Este campo es opcional</small>
        {alertas.codigoPostal && <p style={{ color: "red" }}>{alertas.codigoPostal}</p>}
      </div>

      <button type="submit">Enviar</button>
      <div>
        <Link to="/inicio-sesion">¿Ya tienes una cuenta? Inicia sesión!</Link>
      </div>
    </form>

  </> 
  )
}


export default RegistroCliente