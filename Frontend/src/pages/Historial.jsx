import { useEffect, useState } from 'react';

function Historial() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch(`http://localhost:3001/compras/${localStorage.getItem('usuario_id')}`);
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error('Error fetching compras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) return <div className="text-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">📋 Historial de Compras</h1>
      {compras.length === 0 ? (
        <p className="text-center text-gray-400">No tienes compras realizadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-purple-400">{compra.title}</h2>
              <p className="text-gray-400">Cantidad: {compra.cantidad}</p>
              <p className="text-green-400 font-bold">Total: ${parseFloat(compra.precio).toFixed(2)}</p>
              <p className="text-sm text-gray-500">Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;