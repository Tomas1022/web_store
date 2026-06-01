import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Catalogo() {
const [juegos, setJuegos] = useState([]);
const navigate = useNavigate();
const nombre = localStorage.getItem('nombre');
const rol = localStorage.getItem('rol');
const usuario_id = localStorage.getItem('usuario_id');
const [busqueda, setBusqueda] = useState('');
useEffect(() => {
    fetch('http://localhost:3001/juegos')
    .then(res => res.json())
    .then(data => setJuegos(data));
}, []);

const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
};
const handleComprar = async (juego) => {
    if (!usuario_id) {
    navigate('/login');
    return;
}

    const res = await fetch('http://localhost:3001/compras', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
    usuario_id: usuario_id,
    juego_id: juego.id,
    cantidad: 1
    })
});

    const data = await res.json();

    if (res.ok) {
    alert(`✅ Compraste ${juego.title} por $${data.precio_total}`);
    } else {
    alert(`❌ ${data.error}`);
    }
};
const juegosFiltrados = juegos.filter(juego =>
    juego.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    juego.genre.toLowerCase().includes(busqueda.toLowerCase()) ||
    juego.desarrollador.toLowerCase().includes(busqueda.toLowerCase())
);
return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
    <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold text-purple-400">🎮 Tienda de Juegos</h1>
        <div className="flex items-center gap-4">
        {nombre ? (
            <>
            <span className="text-gray-300 text-sm">Hola, <span className="text-white font-semibold">{nombre}</span></span>
            {rol === 'admin' && (
                <button onClick={() => navigate('/admin')} className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                ⚙️ Admin
                </button>
            )}
            <button onClick={() => navigate('/historial')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                🕒 Historial
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Cerrar sesión
            </button>
            </>
        ) : (
            <button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Iniciar sesión
            </button>
        )}
        </div>
    </nav>

    {/* Buscador */}
    <div className="max-w-6xl mx-auto px-8 pt-8">
        <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar por nombre o género..."
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
    </div>

      {/* Catálogo */}
    <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {juegosFiltrados.map(juego => (
        <div key={juego.id} className="bg-gray-800 rounded-xl overflow-hidden flex flex-col shadow-lg hover:scale-105 transition-transform">
            {/* Imagen */}
            {juego.imagen ? (
            <img
                src={`http://localhost:3001${juego.imagen}`}
                alt={juego.title}
                className="w-full h-48 object-cover"
            />
            ) : (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🎮</span>
            </div>
            )}

            {/* Contenido */}
            <div className="p-6 flex flex-col gap-3 flex-1">
            <h2 className="text-xl font-bold text-purple-400">{juego.title}</h2>
            <span className="text-sm bg-purple-900 text-purple-300 px-3 py-1 rounded-full w-fit">
                {juego.genre}
            </span>
            <p className="text-gray-400 text-sm">
                🏢 {juego.desarrollador} · {juego.pais}
            </p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                <span className="text-2xl font-bold text-green-400">${juego.price}</span>
                <span className="text-sm text-gray-400">Stock: {juego.stock}</span>
            </div>
            <button onClick={() => handleComprar(juego)} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors">
                Comprar
            </button>
            </div>
        </div>
        ))}
    </div>
    </div>
    </div>
);
}

export default Catalogo;