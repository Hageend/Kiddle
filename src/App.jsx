import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './App.css';


const AuthButtons = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/inicio-sesion");
  };
  
  const handleRegister = () => {
    navigate("/registro-cliente");
  };
  
  return (
    <div className="auth-buttons">
      <button className="btn btn-login" onClick={handleLogin}>Iniciar sesión</button>
      <button className="btn btn-register" onClick={handleRegister}>Registrarse</button>
    </div>
  );
};

const ImageBackground = () => {
  return (
    <div>
      <p className="empresa">Sigma Devs</p>
      <Link to="/InicioSesion"><button className="btn botonA">Comenzar</button></Link>
      <img src="/assets/fondo.png" width={"100%"} height={"750px"} alt="DIETAAAS" />
    </div>
  );
};

const PetSection = () => {
  return (
    <div className="pet-section">
      <div className="pet-card">
        <i className="fas fa-cat"></i>
        <h3>Razas de gatos</h3>
        <p>Descubre la mejor alimentación para tu felino según su raza y necesidades específicas.</p>
      </div>
      
      <div className="pet-card">
        <i className="fas fa-dog"></i>
        <h3>Razas de perros</h3>
        <p>Encuentra la dieta perfecta para tu canino, personalizada según su raza y estilo de vida.</p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className="about-section">
      <h2>Sobre nosotros</h2>
      <div className="mission-vision">
        <div className="mission">
          <h3><i className="fas fa-bullseye"></i> Nuestra Misión</h3>
          <p>Nuestra misión es mejorar la calidad de vida de perros y gatos mediante la oferta de alimentos de alta calidad y el diseño de dietas personalizadas que respondan a las necesidades nutricionales de cada mascota.</p>
        </div>
        
        <div className="vision">
          <h3><i className="fas fa-eye"></i> Nuestra Visión</h3>
          <p>Tenemos como visión posicionarnos como una tienda líder en el mercado de alimentos para mascotas, reconocida por integrar la tecnología en la personalización de planes alimenticios, logrando que cada mascota reciba una nutrición adecuada y que cada cliente disfrute de una experiencia de compra innovadora, práctica y satisfactoria.</p>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="navbar-logo">
          <img src="/src/logo2.png" alt="Logo" />
          </div>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p><img src="/src/logo2.PNG" width={"50px"}></img></p>
        <p>Redes sociales</p>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <ImageBackground />   
        <div className="divider"></div>
        <PetSection />
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default App;