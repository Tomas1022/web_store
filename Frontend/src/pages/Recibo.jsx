import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Recibo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/recibos/detalle/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => { setCompras(data); setLoading(false); });
    }, [id, token]);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando recibo...</p>
        </div>
    );

    const total = compras.reduce((acc, c) => acc + parseFloat(c.precio), 0);
    const fecha = compras[0] ? new Date(compras[0].fecha).toLocaleDateString() : '';

    return (
        <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold text-green-400">🧾 Recibo #{id}</h1>
            <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            🎮 Volver al catálogo
            </button>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            {/* Encabezado */}
            <div className="border-b border-gray-700 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">🎮 Tienda de Juegos</h2>
                <p className="text-gray-400 text-sm">Fecha: {fecha}</p>
                <p className="text-gray-400 text-sm">Recibo #{id}</p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-4 mb-6">
                {compras.map((compra, index) => (
                <div key={index} className="flex items-center gap-4">
                    {compra.imagen ? (
                    <img src={`http://localhost:3001${compra.imagen}`} alt={compra.title} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎮</span>
                    </div>
                    )}
                    <div className="flex-1">
                    <p className="font-semibold text-white">{compra.title}</p>
                    <p className="text-gray-400 text-sm">Cantidad: {compra.cantidad}</p>
                    </div>
                    <p className="text-green-400 font-bold">${parseFloat(compra.precio).toFixed(2)}</p>
                </div>
                ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
                <p className="text-xl font-bold text-white">Total</p>
                <p className="text-3xl font-bold text-green-400">${total.toFixed(2)}</p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-8">
                <button onClick={() => navigate('/historial')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                🕒 Ver historial
                </button>
                <button onClick={() => navigate('/')} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
                🎮 Seguir comprando
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }

export default Recibo;