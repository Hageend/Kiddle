import React from "react";
import { useNavigate } from "react-router-dom";
import "../Navbar/NavBar.css";


function NavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/assets/logo2.png" alt="Logo" />
      </div>
      <div>
        <button onClick={() => navigate('/')}>Menú</button>
          <button onClick={() => navigate('/Carrito')}>Carrito</button>
          <button onClick={() => navigate('/Dietas')}>Ver Dietas</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      
    </nav>
  );
}

export default NavBar;