import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1); // 1: login normal, 2: código 2FA
  const [codigo2FA, setCodigo2FA] = useState('');
  const [usuario_id, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) { setError(data.error); return; }

      // Si requiere 2FA
      if (data.requires2FA) {
        setUsuarioId(data.usuario_id);
        setPaso(2);
        return;
      }

      // Login normal
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('nombre', data.nombre);
      localStorage.setItem('usuario_id', data.id);

      if (data.rol === 'admin') navigate('/admin');
      else navigate('/');

    } catch {
      setError('Error al conectar con el servidor');
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/2fa/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, codigo: codigo2FA })
    });

    const data = await res.json();

    if (!res.ok) { setError(data.error); return; }

    // Obtener token completo
    const tokenRes = await fetch('http://localhost:3001/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id })
    });

    const tokenData = await tokenRes.json();
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('rol', tokenData.rol);
    localStorage.setItem('nombre', tokenData.nombre);
    localStorage.setItem('usuario_id', tokenData.id);

    if (tokenData.rol === 'admin') navigate('/admin');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">

        {paso === 1 ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">🔐 Iniciar Sesión</h1>
            {error && <div className="bg-red-900 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2">
                Entrar
              </button>
            </form>
            <p className="text-center text-gray-400 mt-4 text-sm">
              <span onClick={() => navigate('/olvide-password')} className="text-purple-400 cursor-pointer hover:underline">
                ¿Olvidaste tu contraseña?
              </span>
            </p>
            <p className="text-center text-gray-400 mt-4 text-sm">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="text-purple-400 hover:underline">Regístrate</a>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">🔒 Verificación 2FA</h1>
            <p className="text-gray-400 text-center text-sm mb-8">Ingresa el código de Google Authenticator</p>
            {error && <div className="bg-red-900 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handle2FA} className="flex flex-col gap-4">
              <input
                type="text"
                value={codigo2FA}
                onChange={e => setCodigo2FA(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-3xl tracking-widest"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Verificar
              </button>
              <button type="button" onClick={() => { setPaso(1); setError(''); }} className="text-gray-400 hover:text-white text-sm transition-colors">
                ← Volver
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;