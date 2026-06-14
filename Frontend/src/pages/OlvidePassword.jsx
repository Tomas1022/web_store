import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OlvidePassword() {
  const [paso, setPaso] = useState(1); // 1: email, 2: código y nueva contraseña
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:3001/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje('✅ Código enviado a tu correo');
      setPaso(2);
    } else {
      setError(data.error);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return; }

    const res = await fetch('http://localhost:3001/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje('✅ Contraseña actualizada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">🔑 Recuperar contraseña</h1>

        {/* Indicador de pasos */}
        <div className="flex justify-center gap-2 mt-4 mb-8">
          <div className={`w-3 h-3 rounded-full ${paso === 1 ? 'bg-purple-500' : 'bg-gray-600'}`} />
          <div className={`w-3 h-3 rounded-full ${paso === 2 ? 'bg-purple-500' : 'bg-gray-600'}`} />
        </div>

        {mensaje && <div className="bg-green-900 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{mensaje}</div>}
        {error && <div className="bg-red-900 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        {paso === 1 ? (
          <form onSubmit={handleEnviarCodigo} className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm text-center">Ingresa tu email y te enviaremos un código de 6 dígitos</p>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Enviar código
            </button>
          </form>
        ) : (
          <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm text-center">Ingresa el código que recibiste y tu nueva contraseña</p>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Código de 6 dígitos</label>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirmar contraseña</label>
              <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder="••••••••" required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Cambiar contraseña
            </button>
            <button type="button" onClick={() => { setPaso(1); setError(''); setMensaje(''); }} className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Volver
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Volver al login
          </span>
        </p>
      </div>
    </div>
  );
}

export default OlvidePassword;