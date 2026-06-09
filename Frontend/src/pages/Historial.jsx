import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Historial() {
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const usuario_id = localStorage.getItem('usuario_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:3001/recibos/${usuario_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setRecibos(data); setLoading(false); });
  }, [usuario_id, token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Cargando historial...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold text-blue-400">🕒 Historial de Compras</h1>
        <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          🎮 Volver al catálogo
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-8">
        {recibos.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-5xl mb-4">🕒</p>
            <p className="text-xl">No tienes compras realizadas</p>
            <button onClick={() => navigate('/')} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
              Ver catálogo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recibos.map(recibo => (
              <div key={recibo.id} className="bg-gray-800 rounded-xl p-6 flex justify-between items-center shadow-lg">
                <div>
                  <p className="text-white font-bold text-lg">Recibo #{recibo.id}</p>
                  <p className="text-gray-400 text-sm">{new Date(recibo.fecha).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-xl">${parseFloat(recibo.total).toFixed(2)}</p>
                  <button
                    onClick={() => navigate(`/recibo/${recibo.id}`)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Ver detalle →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;