import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Carrito() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const usuario_id = localStorage.getItem('usuario_id');
    const token = localStorage.getItem('token');

    useEffect(() => {
    if (!usuario_id) { navigate('/login'); return; }
    
    fetch(`http://localhost:3001/carrito/${usuario_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => { setItems(data); setLoading(false); });
        
}, [usuario_id, token, navigate]);

    const handleCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    await fetch(`http://localhost:3001/carrito/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad: nuevaCantidad })
    });
    setItems(items.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
};

    const handleEliminar = async (id) => {
        const res = await fetch(`http://localhost:3001/carrito/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setItems(items.filter(item => item.id !== id));
    };

    const handleComprar = async () => {
    // 1. Calcular total
    const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.cantidad, 0);

    // 2. Crear recibo
    const reciboRes = await fetch('http://localhost:3001/recibos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id, total })
    });
    const reciboData = await reciboRes.json();
    const recibo_id = reciboData.id;

    // 3. Registrar cada compra con recibo_id
    for (const item of items) {
        await fetch('http://localhost:3001/compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id,
                juego_id: item.juego_id,
                cantidad: item.cantidad,
                recibo_id
            })
        });
    }

    // 4. Vaciar carrito
    await fetch(`http://localhost:3001/carrito/vaciar/${usuario_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // 5. Redirigir al recibo
    navigate(`/recibo/${recibo_id}`);
};

    const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.cantidad, 0);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando carrito...</p>
        </div>
    );
    const handlePagarMP = async () => {
    const res = await fetch('http://localhost:3001/pagos/crear-preferencia', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, usuario_id })
    });

    const data = await res.json();
    if (res.ok) {
        window.location.href = data.init_point; // redirige a MercadoPago
    } else {
        alert(`❌ ${data.error}`);
    }
};

    return (
        <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar */}
        <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold text-purple-400">🛒 Mi Carrito</h1>
            <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            🎮 Seguir comprando
            </button>
        </nav>

        <div className="max-w-4xl mx-auto p-8">
            {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-xl">Tu carrito está vacío</p>
                <button onClick={() => navigate('/')} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                Ver catálogo
                </button>
            </div>
            ) : (
            <>
                {/* Cards de juegos */}
                <div className="flex flex-col gap-4 mb-8">
                {items.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-xl p-6 flex gap-6 items-center shadow-lg">
                    {/* Imagen */}
                    {item.imagen ? (
                        <img src={`http://localhost:3001${item.imagen}`} alt={item.title} className="w-24 h-24 object-cover rounded-lg shrink-0" />
                    ) : (
                        <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-3xl">🎮</span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-purple-400">{item.title}</h2>
                        <p className="text-green-400 font-bold text-lg">${parseFloat(item.price).toFixed(2)}</p>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleCantidad(item.id, item.cantidad - 1)} className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-lg font-bold transition-colors">
                        -
                        </button>
                        <span className="text-white font-semibold w-6 text-center">{item.cantidad}</span>
                        <button onClick={() => handleCantidad(item.id, item.cantidad + 1)} className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-lg font-bold transition-colors">
                        +
                        </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-24">
                        <p className="text-sm text-gray-400">Subtotal</p>
                        <p className="text-white font-bold">${(parseFloat(item.price) * item.cantidad).toFixed(2)}</p>
                    </div>

                    {/* Eliminar */}
                    <button onClick={() => handleEliminar(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                        🗑️
                    </button>
                    </div>
                ))}
                </div>
                {/* Total y botón comprar */}
                <div className="bg-gray-800 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-3xl font-bold text-green-400">${total.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-3">
                    <button onClick={handleComprar} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
                    ✅ Finalizar compra
                    </button>
                    <button onClick={handlePagarMP} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
                    💳 Pagar con MercadoPago
                    </button>
                </div>
                </div>
            </>
            )}
        </div>
        </div>
    );
    }

export default Carrito;