import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactDOM from "react-dom/client"
import App from './App'
import InicioSesion from "./InicioSesion"
import RegistroCliente from "./RegistroCliente"
import Carrito from "./Carrito"

/*ReactDOM.createRoot(document.getElementById('root')).render(<InicioSesion/>)
ReactDOM.createRoot(document.getElementById('root')).render(<RegistroCliente/>)
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)*/

function Main() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/InicioSesion" element={<InicioSesion/>}/>
                <Route path="/RegistroCliente" element={<RegistroCliente/>}/>
                <Route path="/inicio-sesion" element={<InicioSesion />} />
                <Route path="/registro-cliente" element={<RegistroCliente />} />
                <Route path="/Carrito" element={<Carrito />} />
            </Routes>
        </Router>
    );
}

export default Main;
ReactDOM.createRoot(document.getElementById("root")).render(<Main />);