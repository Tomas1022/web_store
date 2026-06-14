import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerificarEmail() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerificar = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/auth/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo })
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje('✅ Email verificado correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">📧 Verifica tu email</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Ingresa el código de 6 dígitos que enviamos a <span className="text-purple-400">{email}</span>
        </p>

        {mensaje && <div className="bg-green-900 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{mensaje}</div>}
        {error && <div className="bg-red-900 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleVerificar} className="flex flex-col gap-4">
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-3xl tracking-widest"
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
            Verificar
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Volver al login
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerificarEmail;