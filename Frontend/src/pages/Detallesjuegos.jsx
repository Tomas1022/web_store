import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleJuego() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [juego, setJuego] = useState(null);
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevaResena, setNuevaResena] = useState({ rating: 5, comentario: '' });
    const [mensaje, setMensaje] = useState('');
    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('usuario_id');

    useEffect(() => {
        // Cargar juego
        fetch(`http://localhost:3001/juegos/${id}`)
        .then(res => res.json())
        .then(data => setJuego(data));

        // Cargar reseñas
        fetch(`http://localhost:3001/resenas/juego/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => { setResenas(data); setLoading(false); });
    }, [id, token]);

    const handleAgregarAlCarrito = async () => {
        if (!usuario_id) { navigate('/login'); return; }
        const res = await fetch('http://localhost:3001/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id, juego_id: id, cantidad: 1 })
        });
        if (res.ok) {
        mostrarMensaje('✅ Agregado al carrito');
        }
    };

    const handleResena = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3001/resenas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id, juego_id: id, ...nuevaResena })
        });
        if (res.ok) {
        mostrarMensaje('✅ Reseña publicada');
        setNuevaResena({ rating: 5, comentario: '' });
        // Recargar reseñas
        fetch(`http://localhost:3001/resenas/juego/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(data => setResenas(data));
        }
    };

    const mostrarMensaje = (msg) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 3000);
    };

    const promedioRating = resenas.length > 0
        ? (resenas.reduce((acc, r) => acc + r.rating, 0) / resenas.length).toFixed(1)
        : null;

    const estrellas = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

    if (loading || !juego) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar */}
        <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
            <button onClick={() => navigate('/')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            ← Volver al catálogo
            </button>
            <button onClick={() => navigate('/carrito')} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            🛒 Carrito
            </button>
        </nav>

        {mensaje && (
            <div className="max-w-4xl mx-auto px-8 pt-4">
            <div className="bg-green-900 text-green-300 px-4 py-3 rounded-lg text-sm">{mensaje}</div>
            </div>
        )}

        <div className="max-w-4xl mx-auto p-8">
            {/* Imagen y info principal */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
            {juego.imagen ? (
                <img src={`http://localhost:3001${juego.imagen}`} alt={juego.title} className="w-full h-72 object-cover" />
            ) : (
                <div className="w-full h-72 bg-gray-700 flex items-center justify-center">
                <span className="text-6xl">🎮</span>
                </div>
            )}

            <div className="p-8">
                <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{juego.title}</h1>
                    <div className="flex gap-3 items-center mb-4">
                    <span className="text-sm bg-purple-900 text-purple-300 px-3 py-1 rounded-full">{juego.genre}</span>
                    <span className="text-gray-400 text-sm">🏢 {juego.desarrollador} · {juego.pais}</span>
                    </div>
                    {promedioRating && (
                    <p className="text-yellow-400 text-sm">⭐ {promedioRating} / 5 ({resenas.length} reseñas)</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-green-400 mb-2">${parseFloat(juego.price).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm mb-4">Stock: {juego.stock}</p>
                    <button
                    onClick={handleAgregarAlCarrito}
                    disabled={juego.stock === 0}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${juego.stock === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                    {juego.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* Descripción */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-4">📖 Descripción</h2>
            <p className="text-gray-300 leading-relaxed">
                {juego.descripcion || 'Sin descripción disponible.'}
            </p>
            </div>

            {/* Requisitos */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-4">💻 Requisitos del sistema</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {juego.requisitos || 'Sin requisitos especificados.'}
            </p>
            </div>

            {/* Reseñas */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-6">⭐ Reseñas ({resenas.length})</h2>

            {/* Formulario nueva reseña */}
            {usuario_id && (
                <form onSubmit={handleResena} className="mb-8 border-b border-gray-700 pb-8">
                <h3 className="text-white font-semibold mb-4">Deja tu reseña</h3>
                <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setNuevaResena({...nuevaResena, rating: star})}
                        className="text-2xl transition-transform hover:scale-110"
                    >
                        {star <= nuevaResena.rating ? '⭐' : '☆'}
                    </button>
                    ))}
                </div>
                <textarea
                    value={nuevaResena.comentario}
                    onChange={e => setNuevaResena({...nuevaResena, comentario: e.target.value})}
                    placeholder="Escribe tu reseña..."
                    rows={3}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                    Publicar reseña
                </button>
                </form>
            )}

            {/* Lista de reseñas */}
            {resenas.length === 0 ? (
                <p className="text-gray-400">Aún no hay reseñas para este juego.</p>
            ) : (
                <div className="flex flex-col gap-6">
                {resenas.map(resena => (
                    <div key={resena.id} className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                        <p className="font-semibold text-white">{resena.nombre_usuario}</p>
                        <p className="text-yellow-400">{estrellas(resena.rating)}</p>
                        </div>
                        <p className="text-gray-400 text-sm">{new Date(resena.fecha).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-300">{resena.comentario}</p>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
        </div>
    );
    }

export default DetalleJuego;