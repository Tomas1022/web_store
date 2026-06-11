import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ nombre: '', email: '', descripcion: '', ubicacion: '' });
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const usuario_id = localStorage.getItem('usuario_id');
    const token = localStorage.getItem('token');
    const [modalEliminar, setModalEliminar] = useState(false);
    const [passwordEliminar, setPasswordEliminar] = useState('');
    const [errorEliminar, setErrorEliminar] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/usuarios/${usuario_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUsuario(data);
            setForm({ nombre: data.nombre, email: data.email, descripcion: data.descripcion || '', ubicacion: data.ubicacion || '' });
            setLoading(false);
        });
    }, [usuario_id, token]);

    const handleGuardar = async () => {
        const res = await fetch(`http://localhost:3001/usuarios/${usuario_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
        });
        if (res.ok) {
        setUsuario({ ...usuario, ...form });
        setEditando(false);
        mostrarMensaje('✅ Perfil actualizado correctamente');
        }
    };

    const handleFoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('foto', file);
        const res = await fetch(`http://localhost:3001/usuarios/${usuario_id}/foto`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
        });
        const data = await res.json();
        if (res.ok) {
        setUsuario({ ...usuario, foto: data.foto });
        mostrarMensaje('✅ Foto actualizada');
        }
    };

    const mostrarMensaje = (msg) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 3000);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando perfil...</p>
        </div>
    );
    const handleEliminarCuenta = async () => {
    const res = await fetch(`http://localhost:3001/usuarios/${usuario_id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordEliminar })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.clear();
        navigate('/login');
    } else {
        setErrorEliminar(data.error);
    }
    };
    return (
        <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold text-purple-400">👤 Mi Perfil</h1>
            <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            🎮 Volver al catálogo
            </button>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
            {mensaje && (
            <div className="bg-green-900 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm">{mensaje}</div>
            )}

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                {usuario.foto ? (
                    <img src={`http://localhost:3001${usuario.foto}`} alt="perfil" className="w-28 h-28 rounded-full object-cover border-4 border-purple-500" />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center border-4 border-purple-500">
                    <span className="text-5xl">👤</span>
                    </div>
                )}
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                    📷
                    <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
                </div>
                <h2 className="text-2xl font-bold mt-4">{usuario.nombre}</h2>
                <span className="text-sm bg-purple-900 text-purple-300 px-3 py-1 rounded-full mt-2">{usuario.rol}</span>
            </div>

            {/* Info */}
            {editando ? (
                <div className="flex flex-col gap-4">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                    <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Ubicación</label>
                    <input value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} placeholder="Ciudad, País" className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                    <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Cuéntanos sobre ti..." rows={3} className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
                <div className="flex gap-4 mt-2">
                    <button onClick={handleGuardar} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors">✅ Guardar</button>
                    <button onClick={() => setEditando(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors">Cancelar</button>
                </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{usuario.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-400">Ubicación</span>
                    <span className="text-white">{usuario.ubicacion || 'No especificada'}</span>
                </div>
                <div className="py-3 border-b border-gray-700">
                    <span className="text-gray-400 block mb-2">Descripción</span>
                    <span className="text-white">{usuario.descripcion || 'Sin descripción'}</span>
                </div>
                <button onClick={() => setEditando(true)} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    ✏️ Editar perfil
                </button>
                <button onClick={() => setModalEliminar(true)} className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    🗑️ Eliminar cuenta
                </button>
                {modalEliminar && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
                        <h2 className="text-xl font-bold text-red-400 mb-2">⚠️ Eliminar cuenta</h2>
                        <p className="text-gray-400 text-sm mb-6">Esta acción es irreversible. Ingresa tu contraseña para confirmar.</p>

                        {errorEliminar && (
                            <div className="bg-red-900 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{errorEliminar}</div>
                        )}

                        <input
                            type="password"
                            value={passwordEliminar}
                            onChange={e => setPasswordEliminar(e.target.value)}
                            placeholder="Tu contraseña"
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        />

                        <div className="flex gap-4">
                            <button
                            onClick={handleEliminarCuenta}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                            Confirmar
                            </button>
                            <button
                            onClick={() => { setModalEliminar(false); setErrorEliminar(''); setPasswordEliminar(''); }}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                            Cancelar
                            </button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
            )}
            </div>
        </div>
        </div>
    );
}

export default Perfil;