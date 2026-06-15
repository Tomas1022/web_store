import { useNavigate } from 'react-router-dom';

function PagoExitoso() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl text-center shadow-lg">
        <p className="text-6xl mb-4">🎉</p>
        <h1 className="text-3xl font-bold text-green-400 mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-400 mb-6">Tu compra fue procesada correctamente</p>
        <button onClick={() => navigate('/historial')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          Ver historial
        </button>
      </div>
    </div>
  );
}
export default PagoExitoso;