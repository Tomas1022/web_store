import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import Historial from './pages/Historial';
import Carrito from './pages/Carrito';
import Recibo from './pages/Recibo';
import Perfil from './pages/Perfil';
import DetalleJuego from './pages/Detallesjuegos';
import OlvidePassword from './pages/OlvidePassword';
import VerificarEmail from './pages/VerificarEmail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/recibo/:id" element={<Recibo />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/juego/:id" element={<DetalleJuego />} />
        <Route path="/olvide-password" element={<OlvidePassword />} />
        <Route path="/verificar-email" element={<VerificarEmail />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;