import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import Historial from './pages/Historial';
import Carrito from './pages/Carrito';
import Recibo from './pages/Recibo';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;