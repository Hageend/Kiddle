// src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import styles from './RegisterPage.module.css';
import cpData from '../data/cpData'; // archivo que exporta objeto cp -> { estado, colonias: [] }

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    telefono: '',
    // direccion
    codigo_postal: '',
    colonia: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    estado: ''
  });

  const [error, setError] = useState('');
  const [alertas, setAlertas] = useState({});
  const [coloniasDisponibles, setColoniasDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // cuando cambie codigo_postal, actualizar colonias y estado
    const cp = formData.codigo_postal;
    if (!cp) {
      setColoniasDisponibles([]);
      setFormData(prev => ({ ...prev, colonia: '', estado: '' }));
      return;
    }
    const entry = cpData[cp];
    if (entry) {
      setColoniasDisponibles(entry.colonias);
      setFormData(prev => ({ ...prev, estado: entry.estado, colonia: entry.colonias[0] || '' }));
    } else {
      setColoniasDisponibles([]);
      setFormData(prev => ({ ...prev, colonia: '', estado: '' }));
    }
  }, [formData.codigo_postal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    let errores = {};
    if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.nombre)) errores.nombre = "El nombre solo debe contener letras (2-40 caracteres).";
    if (!/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.primer_apellido)) errores.primer_apellido = "El primer apellido solo debe contener letras.";
    if (formData.segundo_apellido && !/^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(formData.segundo_apellido)) errores.segundo_apellido = "El segundo apellido solo debe contener letras.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) errores.correo = "El correo no es válido.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(formData.contraseña))
      errores.contraseña = "La contraseña debe tener entre 8 y 12 caracteres, incluir mayúscula, minúscula, número y carácter especial.";
    if (formData.telefono && !/^[0-9]{10}$/.test(formData.telefono)) errores.telefono = "El teléfono debe contener 10 dígitos.";

    // Validacion direccion: si el usuario seleccionó código postal, colonia y calle obligatorias
    if (formData.codigo_postal) {
      if (!formData.colonia) errores.colonia = "Selecciona una colonia.";
      if (!formData.calle) errores.calle = "Ingresa la calle.";
      if (!formData.numero_exterior) errores.numero_exterior = "Ingresa el número exterior.";
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const errores = validate();
    if (Object.keys(errores).length > 0) {
      setAlertas(errores);
      return;
    }
    setAlertas({});

    try {
      // Preparamos el body para el backend
      const body = {
        nombre: formData.nombre,
        primer_apellido: formData.primer_apellido,
        segundo_apellido: formData.segundo_apellido,
        correo: formData.correo,
        contraseña: formData.contraseña,
        telefono: formData.telefono,
        // direccion si se llenó
        calle: formData.calle || undefined,
        numero_exterior: formData.numero_exterior || undefined,
        numero_interior: formData.numero_interior || undefined,
        colonia: formData.colonia || undefined,
        codigo_postal: formData.codigo_postal || undefined,
        estado: formData.estado || undefined
      };

      const resp = await apiClient.post('/auth/register', body);
      if (resp.status === 201) {
        alert('¡Registro exitoso! Ahora inicia sesión.');
        navigate('/login'); // redirigir a login como pediste
      } else {
        alert('Registro completado, pero hubo una respuesta inesperada del servidor.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Error en registro:', err.response?.data || err.message);
      const msg = err.response?.data?.error || 'Hubo un error al registrar el usuario.';
      alert(msg);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Crear una Cuenta</h2>

        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        {alertas.nombre && <p className={styles.error}>{alertas.nombre}</p>}

        <input name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
        {alertas.primer_apellido && <p className={styles.error}>{alertas.primer_apellido}</p>}

        <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />
        {alertas.segundo_apellido && <p className={styles.error}>{alertas.segundo_apellido}</p>}

        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
        {alertas.correo && <p className={styles.error}>{alertas.correo}</p>}

        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" required />
        {alertas.contraseña && <p className={styles.error}>{alertas.contraseña}</p>}

        <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} placeholder="Confirmar Contraseña" required />
        {error && <p className={styles.error}>{error}</p>}

        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono (10 dígitos)" />
        {alertas.telefono && <p className={styles.error}>{alertas.telefono}</p>}

        <hr />

        <h3>Dirección (opcional)</h3>

        <label>Código Postal</label>
        <select name="codigo_postal" value={formData.codigo_postal} onChange={handleChange}>
          <option value="">-- Selecciona un código postal (opcional) --</option>
          {Object.keys(cpData).map(cp => (
            <option key={cp} value={cp}>{cp} — {cpData[cp].estado}</option>
          ))}
        </select>

        <label>Colonia</label>
        <select name="colonia" value={formData.colonia} onChange={handleChange} disabled={!coloniasDisponibles.length}>
          <option value="">{coloniasDisponibles.length ? '-- Selecciona colonia --' : 'Selecciona código postal primero'}</option>
          {coloniasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
        {alertas.colonia && <p className={styles.error}>{alertas.colonia}</p>}

        <input name="calle" value={formData.calle} onChange={handleChange} placeholder="Calle" />
        {alertas.calle && <p className={styles.error}>{alertas.calle}</p>}

        <input name="numero_exterior" value={formData.numero_exterior} onChange={handleChange} placeholder="Número exterior" />
        {alertas.numero_exterior && <p className={styles.error}>{alertas.numero_exterior}</p>}

        <input name="numero_interior" value={formData.numero_interior} onChange={handleChange} placeholder="Número interior (opcional)" />

        <input name="estado" value={formData.estado} onChange={handleChange} placeholder="Estado" readOnly />

        <button type="submit" className={styles.btnSubmit}>Crear Cuenta</button>

        <div className={styles.loginRedirect}>
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
